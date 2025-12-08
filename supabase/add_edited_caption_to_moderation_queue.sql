-- Adicionar campo para legenda editada na tabela moderation_queue

ALTER TABLE moderation_queue
ADD COLUMN IF NOT EXISTS edited_caption TEXT;

COMMENT ON COLUMN moderation_queue.edited_caption IS 'Legenda do Instagram editada pelo moderador';
