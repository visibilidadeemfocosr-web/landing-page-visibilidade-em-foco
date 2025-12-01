-- Script para adicionar suporte ao tipo 'social_media' no campo field_type
-- Execute este script no Supabase SQL Editor

-- Remover constraint antiga
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_field_type_check;

-- Adicionar nova constraint com o tipo 'social_media'
ALTER TABLE questions ADD CONSTRAINT questions_field_type_check 
  CHECK (field_type IN ('text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'yesno', 'scale', 'image', 'cep', 'social_media'));

