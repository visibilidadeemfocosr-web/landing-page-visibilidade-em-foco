-- Adicionar campo section (bloco/seção) na tabela questions
-- Execute este script no SQL Editor do Supabase

ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS section TEXT;

-- Criar índice para melhor performance nas consultas por seção
CREATE INDEX IF NOT EXISTS idx_questions_section ON questions(section);

