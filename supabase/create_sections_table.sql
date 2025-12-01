-- Criar tabela para armazenar ordem das seções/blocos
-- Esta tabela permite definir uma ordem customizada para os blocos

CREATE TABLE IF NOT EXISTS sections (
  name TEXT PRIMARY KEY,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections("order");

-- Ativar RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Permitir acesso admin (via service_role)
-- Nota: As políticas de admin serão gerenciadas via service_role key

-- Trigger para atualizar updated_at
CREATE TRIGGER update_sections_updated_at BEFORE UPDATE ON sections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir seções existentes baseado nas perguntas atuais
-- Execute este comando após criar a tabela para popular com as seções existentes
INSERT INTO sections (name, "order")
SELECT DISTINCT section, ROW_NUMBER() OVER (ORDER BY MIN("order")) as "order"
FROM questions
WHERE section IS NOT NULL AND section != 'Sem seção'
GROUP BY section
ON CONFLICT (name) DO UPDATE SET "order" = EXCLUDED."order";

