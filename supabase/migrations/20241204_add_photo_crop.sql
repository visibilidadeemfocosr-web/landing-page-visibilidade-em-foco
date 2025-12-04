-- Adicionar coluna para guardar dados de crop da foto
-- OPCIONAL: Sistema funciona sem essa coluna (usa foto original)

-- Adicionar coluna photo_crop na tabela submissions
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS photo_crop JSONB DEFAULT NULL;

-- Comentário explicativo
COMMENT ON COLUMN submissions.photo_crop IS 'Dados de crop da foto: {x, y, zoom, width, height}. Opcional - se NULL, usa foto original.';

-- Índice para consultas
CREATE INDEX IF NOT EXISTS idx_submissions_photo_crop 
ON submissions USING GIN (photo_crop) 
WHERE photo_crop IS NOT NULL;

-- Verificar resultado
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'submissions' 
  AND column_name = 'photo_crop';

