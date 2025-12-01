-- =====================================================
-- CONFIGURAÇÃO DO STORAGE PARA UPLOAD DE IMAGENS
-- =====================================================
-- Este script configura o bucket e as políticas de storage
-- IMPORTANTE: Execute isso no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. Criar o bucket de storage (se ainda não existir)
-- Nota: A criação do bucket precisa ser feita pelo Dashboard do Supabase
-- ou via Supabase CLI. O SQL abaixo só funciona se você tiver permissões
-- administrativas diretas no banco.

-- Para criar pelo Dashboard:
-- 1. Vá em "Storage" no menu lateral
-- 2. Clique em "New bucket"
-- 3. Nome: artist-images
-- 4. Marque "Public bucket" (importante para que as imagens sejam acessíveis)
-- 5. ATIVE "Restrict file size" e defina: 5242880 (5MB em bytes)
-- 6. ATIVE "Restrict MIME types" e adicione os seguintes tipos:
--    - image/jpeg
--    - image/jpg
--    - image/png
--    - image/gif
--    - image/webp
-- 7. Clique em "Create bucket"

-- Se quiser tentar via SQL (pode não funcionar dependendo das permissões):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'artist-images',
  'artist-images',
  true, -- Bucket público (as imagens serão acessíveis publicamente)
  5242880, -- Limite de 5MB por arquivo
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Política para permitir leitura pública das imagens
-- Qualquer pessoa pode visualizar as imagens
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'artist-images');

-- 3. Política para permitir upload público de imagens
-- Qualquer pessoa pode fazer upload (necessário para o formulário público)
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artist-images');

-- 4. Política para permitir atualização de imagens (opcional, caso precise)
-- CREATE POLICY "Public can update images"
-- ON storage.objects FOR UPDATE
-- USING (bucket_id = 'artist-images')
-- WITH CHECK (bucket_id = 'artist-images');

-- 5. Política para permitir exclusão de imagens (opcional, para admin limpar)
-- CREATE POLICY "Public can delete images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'artist-images');

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Após executar, verifique se o bucket foi criado:
-- SELECT * FROM storage.buckets WHERE id = 'artist-images';

-- Verifique as políticas criadas:
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%images%';

