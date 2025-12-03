-- Adicionar suporte a carrossel na tabela instagram_posts
ALTER TABLE instagram_posts 
ADD COLUMN IF NOT EXISTS is_carousel BOOLEAN DEFAULT FALSE;

ALTER TABLE instagram_posts 
ADD COLUMN IF NOT EXISTS slides JSONB;

-- Comentários
COMMENT ON COLUMN instagram_posts.is_carousel IS 'Indica se o post é um carrossel (múltiplas imagens) ou post único';
COMMENT ON COLUMN instagram_posts.slides IS 'Array de slides do carrossel com título, subtítulo, descrição, etc de cada slide';

-- Exemplo de estrutura do JSONB slides:
-- [
--   {
--     "order": 1,
--     "title": "PARTICIPE DO MAPEAMENTO",
--     "subtitle": "Artistas LGBTQIA+ de São Roque",
--     "description": "Compartilhe sua história...",
--     "ctaText": "CADASTRE-SE AGORA",
--     "ctaLink": "https://...",
--     "periodText": "08/12/2025 até 08/02/2026"
--   },
--   {
--     "order": 2,
--     "title": "QUEM PODE PARTICIPAR?",
--     "description": "Artistas de todas as linguagens..."
--   }
-- ]

