-- Criar tabela para armazenar posts do Instagram
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_type TEXT NOT NULL CHECK (template_type IN ('chamamento', 'artista', 'evento', 'citacao', 'livre')),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  cta_text TEXT,
  cta_link TEXT,
  period_text TEXT,
  content JSONB, -- Armazenar configurações específicas do template
  image_url TEXT,
  caption TEXT, -- Legenda do Instagram
  hashtags TEXT[],
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  instagram_post_id TEXT, -- ID do post no Instagram após publicação
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX idx_instagram_posts_status ON instagram_posts(status);
CREATE INDEX idx_instagram_posts_template_type ON instagram_posts(template_type);
CREATE INDEX idx_instagram_posts_created_at ON instagram_posts(created_at DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_instagram_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_instagram_posts_updated_at_trigger
BEFORE UPDATE ON instagram_posts
FOR EACH ROW
EXECUTE FUNCTION update_instagram_posts_updated_at();

-- RLS (Row Level Security)
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Policy: permitir leitura para todos (autenticados)
CREATE POLICY "Allow read access to instagram_posts"
ON instagram_posts FOR SELECT
USING (true);

-- Policy: permitir insert/update/delete para todos (por enquanto)
CREATE POLICY "Allow all access to instagram_posts"
ON instagram_posts FOR ALL
USING (true);

