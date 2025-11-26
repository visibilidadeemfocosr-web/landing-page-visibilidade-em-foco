-- Políticas RLS para operações de admin na tabela questions
-- Execute este script no SQL Editor do Supabase

-- Função para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o email do usuário autenticado está na tabela admin_users
  -- ou se corresponde ao ADMIN_EMAIL do .env
  RETURN EXISTS (
    SELECT 1 
    FROM admin_users 
    WHERE email = auth.jwt() ->> 'email'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Permitir SELECT para todas as perguntas (não apenas ativas) para admin
CREATE POLICY "Admin can view all questions"
  ON questions FOR SELECT
  TO authenticated
  USING (is_admin());

-- Permitir INSERT para admin
CREATE POLICY "Admin can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Permitir UPDATE para admin
CREATE POLICY "Admin can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Permitir DELETE para admin
CREATE POLICY "Admin can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (is_admin());

-- Políticas para outras tabelas também

-- Admin pode ver todas as submissions
CREATE POLICY "Admin can view all submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin pode ver todas as answers
CREATE POLICY "Admin can view all answers"
  ON answers FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admin pode deletar submissions
CREATE POLICY "Admin can delete submissions"
  ON submissions FOR DELETE
  TO authenticated
  USING (is_admin());

-- Admin pode deletar answers
CREATE POLICY "Admin can delete answers"
  ON answers FOR DELETE
  TO authenticated
  USING (is_admin());

