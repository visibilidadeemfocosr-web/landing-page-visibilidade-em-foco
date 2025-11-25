# Configuração do Supabase

## Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Preencha os dados:
   - Nome do projeto
   - Senha do banco de dados (anote!)
   - Região (escolha a mais próxima)
5. Aguarde a criação (pode levar alguns minutos)

### 2. Executar o Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New Query**
3. Abra o arquivo `supabase/schema.sql` deste projeto
4. Copie todo o conteúdo e cole no editor SQL
5. Clique em **Run** ou pressione `Ctrl+Enter` (Windows/Linux) ou `Cmd+Enter` (Mac)
6. Aguarde a confirmação de sucesso

### 3. Criar Bucket de Storage

1. Vá em **Storage** no menu lateral
2. Clique em **New bucket**
3. Nome: `artist-images`
4. Marque **Public bucket** (para que as imagens sejam acessíveis publicamente)
5. Clique em **Create bucket**

### 4. Configurar Políticas de Storage (RLS)

1. No bucket `artist-images`, vá em **Policies**
2. Clique em **New Policy**
3. Crie uma política para permitir uploads públicos:

```sql
-- Política para permitir upload público
CREATE POLICY "Permitir upload público"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artist-images');

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública"
ON storage.objects FOR SELECT
USING (bucket_id = 'artist-images');
```

Ou use o SQL Editor:

```sql
-- Permitir upload público
CREATE POLICY "Public can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artist-images');

-- Permitir leitura pública
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'artist-images');
```

### 5. Obter Chaves de API

1. Vá em **Settings** > **API**
2. Você verá:
   - **Project URL**: Use como `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Use como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Use como `SUPABASE_SERVICE_ROLE_KEY` (⚠️ mantenha segredo!)

### 6. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
ADMIN_EMAIL=seu-email@exemplo.com
```

### 7. Testar a Conexão

1. Inicie o servidor: `npm run dev`
2. Acesse `http://localhost:3000/admin/questions`
3. Tente criar uma pergunta
4. Se funcionar, a configuração está correta! ✅

## Troubleshooting

### Erro: "relation does not exist"
- Certifique-se de que executou o schema.sql completo
- Verifique se todas as tabelas foram criadas na aba **Table Editor**

### Erro: "permission denied"
- Verifique as políticas RLS no Storage
- Certifique-se de que o bucket `artist-images` é público

### Erro: "invalid API key"
- Verifique se copiou as chaves corretamente
- Certifique-se de que está usando a chave correta (anon para frontend, service_role apenas no backend se necessário)

### Imagens não aparecem
- Verifique se o bucket está marcado como público
- Verifique as políticas de storage
- Verifique os logs no Supabase Dashboard > Logs

## Próximos Passos

Depois de configurar:

1. Acesse `/admin/questions` e crie suas primeiras perguntas
2. Teste o formulário público em `/`
3. Visualize as submissões em `/admin/submissions`
4. Veja as estatísticas em `/admin/stats`

