-- Script para criar tabela de moderação
-- Execute este script no Supabase SQL Editor

CREATE TABLE IF NOT EXISTS moderation_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  edited_bio TEXT,
  moderator_notes TEXT,
  instagram_post_id TEXT,
  moderated_by UUID REFERENCES admin_users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_moderation_queue_submission_id ON moderation_queue(submission_id);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_status ON moderation_queue(status);
CREATE INDEX IF NOT EXISTS idx_moderation_queue_created_at ON moderation_queue(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_moderation_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_moderation_queue_updated_at
  BEFORE UPDATE ON moderation_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_moderation_queue_updated_at();

-- Comentários
COMMENT ON TABLE moderation_queue IS 'Fila de moderação para artistas que desejam participar da rede social';
COMMENT ON COLUMN moderation_queue.status IS 'Status: pending, approved, rejected, published';
COMMENT ON COLUMN moderation_queue.edited_bio IS 'Biografia editada pelo moderador';
COMMENT ON COLUMN moderation_queue.instagram_post_id IS 'ID do post publicado no Instagram';

