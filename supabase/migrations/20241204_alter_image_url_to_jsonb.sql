-- Alterar campo image_url de TEXT para JSONB para suportar arrays (carrossel)
ALTER TABLE instagram_posts 
  ALTER COLUMN image_url TYPE JSONB USING 
    CASE 
      WHEN image_url IS NULL THEN NULL
      WHEN image_url LIKE '[%' THEN image_url::jsonb
      ELSE to_jsonb(image_url)
    END;

-- Comentário explicativo
COMMENT ON COLUMN instagram_posts.image_url IS 
  'URL da imagem (string) ou array de URLs (array de strings) para carrossel';

