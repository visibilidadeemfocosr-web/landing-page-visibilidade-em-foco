-- Adicionar campos para redes sociais editadas na tabela moderation_queue
-- Execute este script no Supabase SQL Editor

ALTER TABLE moderation_queue
ADD COLUMN IF NOT EXISTS edited_instagram TEXT,
ADD COLUMN IF NOT EXISTS edited_facebook TEXT,
ADD COLUMN IF NOT EXISTS edited_linkedin TEXT;

COMMENT ON COLUMN moderation_queue.edited_instagram IS 'Instagram editado pelo moderador';
COMMENT ON COLUMN moderation_queue.edited_facebook IS 'Facebook editado pelo moderador';
COMMENT ON COLUMN moderation_queue.edited_linkedin IS 'LinkedIn editado pelo moderador';

