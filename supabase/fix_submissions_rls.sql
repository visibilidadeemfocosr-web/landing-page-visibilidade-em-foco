-- Script para corrigir políticas RLS para submissões públicas

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Public can create submissions" ON submissions;
DROP POLICY IF EXISTS "Public can create answers" ON answers;

-- Criar política para permitir INSERT público em submissions
CREATE POLICY "Public can create submissions"
  ON submissions FOR INSERT
  TO public
  WITH CHECK (true);

-- Criar política para permitir INSERT público em answers
CREATE POLICY "Public can create answers"
  ON answers FOR INSERT
  TO public
  WITH CHECK (true);

-- Verificar se RLS está habilitado
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

