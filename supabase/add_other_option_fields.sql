-- Script para adicionar campos de opção "Outros" na tabela questions
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna has_other_option (boolean, default false)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS has_other_option BOOLEAN DEFAULT false;

-- Adicionar coluna other_option_label (text, nullable)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS other_option_label TEXT;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN questions.has_other_option IS 'Se true, permite que uma das opções seja "outros" com campo de texto adicional';
COMMENT ON COLUMN questions.other_option_label IS 'Label do campo de texto quando opção "outros" é selecionada (ex: "Qual?")';

