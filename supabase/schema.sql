-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'yesno', 'scale', 'image')),
  required BOOLEAN DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  options JSONB, -- Array de strings para select/radio
  min_value INTEGER, -- Para scale
  max_value INTEGER, -- Para scale
  placeholder TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  value TEXT, -- Para armazenar valores diversos (texto, número, JSON)
  file_url TEXT, -- Para imagens
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  UNIQUE(question_id, submission_id)
);

-- Create admin_users table (opcional, para controlar quem pode acessar o admin)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_submission_id ON answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions("order");
CREATE INDEX IF NOT EXISTS idx_questions_active ON questions(active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active questions
CREATE POLICY "Public can view active questions"
  ON questions FOR SELECT
  USING (active = true);

-- Allow public insert to submissions
CREATE POLICY "Public can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (true);

-- Allow public insert to answers (only for their own submissions)
CREATE POLICY "Public can create answers"
  ON answers FOR INSERT
  WITH CHECK (true);

-- Admin policies (will be created after auth setup)
-- For now, we'll use service_role key for admin operations

-- Storage bucket for images
-- This needs to be run in Supabase Dashboard or via Supabase CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('artist-images', 'artist-images', true);

-- Storage policy for public read
-- CREATE POLICY "Public can view images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'artist-images');

-- Storage policy for authenticated upload (will be updated after auth)
-- CREATE POLICY "Public can upload images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'artist-images');

