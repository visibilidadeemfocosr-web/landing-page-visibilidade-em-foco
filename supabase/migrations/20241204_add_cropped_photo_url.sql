-- Adicionar coluna para URL da foto já cropada
-- Quando moderador ajusta crop, salvamos a imagem já processada

ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS cropped_photo_url TEXT DEFAULT NULL;

-- Comentário explicativo
COMMENT ON COLUMN submissions.cropped_photo_url IS 'URL da foto já cropada e processada. Se NULL, usa photo original. Se preenchida, usa esta versão no Post 1.';

-- Verificar resultado
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'submissions' 
  AND column_name IN ('photo_crop', 'cropped_photo_url');

