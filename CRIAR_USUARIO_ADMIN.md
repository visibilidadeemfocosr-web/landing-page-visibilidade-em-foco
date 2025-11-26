# Criar Usuário Admin no Supabase

## 📝 Credenciais:
- **Email**: visibilidade.emfocosr@gmail.com
- **Senha**: Visiinst01@

## 🚀 Passo a Passo:

### Opção 1: Via Dashboard do Supabase (Mais Fácil)

1. Acesse seu projeto no Supabase: https://supabase.com/dashboard
2. No menu lateral, clique em **"Authentication"**
3. Clique em **"Users"**
4. Clique no botão **"Add user"** ou **"Create user"**
5. Preencha:
   - **Email**: `visibilidade.emfocosr@gmail.com`
   - **Password**: `Visiinst01@`
   - Marque **"Auto Confirm User"** (para não precisar confirmar email)
6. Clique em **"Create user"**

### Opção 2: Via SQL Editor

Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Criar usuário admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'visibilidade.emfocosr@gmail.com',
  crypt('Visiinst01@', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

## ✅ Depois de Criar:

1. Teste o login em: http://localhost:3001/admin/login
2. Use:
   - Email: `visibilidade.emfocosr@gmail.com`
   - Senha: `Visiinst01@`
3. Deve redirecionar para `/admin`

## 🔒 Segurança:

- Não compartilhe essas credenciais
- Altere a senha periodicamente
- Use uma senha forte em produção

