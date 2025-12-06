-- Criar bucket para armazenar imagens do conteúdo da home
-- Execute este script no Supabase SQL Editor

-- Criar bucket se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'home-content',
  'home-content',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir leitura pública
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'home-content');

-- Política para permitir upload apenas para admins autenticados
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'home-content' AND
  auth.role() = 'authenticated'
);

-- Política para permitir atualização apenas para admins autenticados
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
CREATE POLICY "Authenticated users can update"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'home-content' AND
  auth.role() = 'authenticated'
);

-- Política para permitir exclusão apenas para admins autenticados
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
CREATE POLICY "Authenticated users can delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'home-content' AND
  auth.role() = 'authenticated'
);

