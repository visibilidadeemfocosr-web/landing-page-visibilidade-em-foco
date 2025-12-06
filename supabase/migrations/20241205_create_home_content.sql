-- Tabela para armazenar conteúdo editável da home
-- Apenas textos e seções, mantendo identidade visual intacta

CREATE TABLE IF NOT EXISTS home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_home_content_updated_at ON home_content(updated_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_home_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_home_content_updated_at
  BEFORE UPDATE ON home_content
  FOR EACH ROW
  EXECUTE FUNCTION update_home_content_updated_at();

-- Inserir registro inicial vazio (será preenchido pelo editor)
INSERT INTO home_content (id, content)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{}'
)
ON CONFLICT (id) DO NOTHING;

-- Comentários
COMMENT ON TABLE home_content IS 'Armazena conteúdo editável da home (textos, seções) sem alterar identidade visual';
COMMENT ON COLUMN home_content.content IS 'JSONB com toda a estrutura de conteúdo: logoPath, mainTitle, highlightedWord, subtitle, description, period, aboutTag, aboutSections, objectives, impactTag, impactTitle, impactDescription, impacts, quote, quoteAuthor';

