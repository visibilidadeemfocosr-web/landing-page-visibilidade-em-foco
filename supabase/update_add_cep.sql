-- Script para adicionar suporte ao tipo 'cep' no campo field_type
-- Execute este script no SQL Editor do Supabase

-- Remover a constraint antiga
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_field_type_check;

-- Adicionar nova constraint com 'cep'
ALTER TABLE questions ADD CONSTRAINT questions_field_type_check 
  CHECK (field_type IN ('text', 'textarea', 'number', 'select', 'radio', 'checkbox', 'yesno', 'scale', 'image', 'cep'));

