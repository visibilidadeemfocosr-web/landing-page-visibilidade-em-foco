-- Adicionar coluna tag_text à tabela instagram_posts
ALTER TABLE instagram_posts 
ADD COLUMN IF NOT EXISTS tag_text TEXT;

-- Comentário descrevendo o campo
COMMENT ON COLUMN instagram_posts.tag_text IS 'Texto da tag/assinatura do projeto que aparece no post';

