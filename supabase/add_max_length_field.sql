-- Adicionar campo max_length para limitar caracteres em campos de texto
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS max_length INTEGER;

-- Comentário explicativo
COMMENT ON COLUMN questions.max_length IS 'Limite máximo de caracteres para campos do tipo text e textarea. NULL significa sem limite.';

