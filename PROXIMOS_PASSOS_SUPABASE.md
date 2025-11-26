# Próximos Passos Após Criar o Projeto no Supabase

## ✅ O que você já configurou:
- ✅ Nome: visibilidade-em-foco
- ✅ Região: South America (São Paulo) - PERFEITO! 🇧🇷
- ✅ Senha do banco: configurada e forte
- ⚠️ **IMPORTANTE**: Anote sua senha do banco: `nt6P1PBaKX693MjU` (guarde em local seguro!)

---

## 📋 Após Clicar em "Create new project"

### 1. ⏳ Aguarde a Criação (2-3 minutos)
- O Supabase está criando seu projeto
- Você verá uma tela de loading
- **Não feche a aba!**

### 2. 🔑 Obter as Chaves de API

Quando o projeto estiver pronto:

1. No menu lateral esquerdo, clique em **"Settings"** (⚙️)
2. Clique em **"API"**
3. Você verá 3 informações importantes:

   **a) Project URL**
   - Copie a URL (ex: `https://xxxxx.supabase.co`)
   - Vai para: `NEXT_PUBLIC_SUPABASE_URL`

   **b) anon public key**
   - Copie a chave (começa com `eyJhbG...`)
   - Vai para: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ⚠️ Esta é segura para usar no frontend

   **c) service_role key**
   - Role a página até encontrar
   - Clique em "Reveal" para mostrar
   - Copie a chave (começa com `eyJhbG...`)
   - Vai para: `SUPABASE_SERVICE_ROLE_KEY`
   - ⚠️ MANTENHA EM SEGREDO! Só para backend

### 3. 📝 Atualizar o arquivo `.env.local`

Após obter as chaves, edite o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_EMAIL=seu-email@exemplo.com
```

Substitua os valores pelos que você copiou.

### 4. 🗄️ Executar o Schema SQL

1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Abra o arquivo `supabase/schema.sql` do projeto
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em **"Run"** (ou `Ctrl+Enter` / `Cmd+Enter`)
7. Aguarde a mensagem de sucesso: ✅

### 5. 📦 Criar o Bucket de Storage

1. No menu lateral, clique em **"Storage"**
2. Clique em **"New bucket"**
3. Configure:
   - **Name**: `artist-images` (EXATAMENTE este nome!)
   - **Public bucket**: ✅ MARQUE como público
4. Clique em **"Create bucket"**

### 6. 🔒 Configurar Políticas de Storage

1. Abra o bucket `artist-images` que você criou
2. Vá na aba **"Policies"**
3. Clique em **"New Policy"**
4. Selecione **"For full customization, write your own policy"**
5. Cole este SQL:

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

6. Salve a política

### 7. 🔄 Reiniciar o Servidor

Após atualizar o `.env.local`, reinicie o servidor:

```bash
# Pare o servidor atual (Ctrl+C) e rode:
PORT=3001 npm run dev
```

### 8. ✅ Testar

1. Acesse: http://localhost:3001/admin/questions
2. Tente criar uma pergunta
3. Se funcionar, está tudo certo! 🎉

---

## 📝 Checklist Final

- [ ] Projeto criado no Supabase
- [ ] Chaves de API obtidas
- [ ] `.env.local` atualizado
- [ ] Schema SQL executado
- [ ] Bucket `artist-images` criado (público)
- [ ] Políticas de storage configuradas
- [ ] Servidor reiniciado
- [ ] Teste realizado com sucesso

---

**Dúvidas?** Me chame após cada etapa! 😊

