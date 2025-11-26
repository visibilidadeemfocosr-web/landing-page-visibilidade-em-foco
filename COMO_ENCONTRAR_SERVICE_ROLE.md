# Como Encontrar a Service Role Key no Supabase

## 📍 Você está no lugar certo!

Você já está em **Settings** → **Data API**.

## 🎯 Próximo Passo:

1. **Clique em "API Keys"** (está logo abaixo de "Data API" na lista)

2. Você verá uma página com várias seções:
   - **Project URL** (já temos essa)
   - **anon public** key (já temos essa também)
   - **service_role** key ⬅️ **ESTA É A QUE PRECISAMOS!**

3. Para ver a **service_role key**:
   - Role a página para baixo
   - Procure por "service_role" 
   - Você verá um botão **"Reveal"** ou um ícone de olho 👁️
   - Clique nele para revelar a chave
   - **Copie a chave completa** (é uma string longa que começa com `eyJhbG...`)

## ⚠️ IMPORTANTE:

- A **service_role** key é **SECRETA**!
- Ela tem **acesso total** ao seu banco de dados
- **NÃO compartilhe** publicamente
- Só use no backend (arquivo `.env.local`)

## 📝 Depois de copiar:

Envie a chave para mim que eu atualizo o `.env.local` automaticamente!

---

**Dica**: Se não encontrar, a chave pode estar em uma seção separada ou você pode precisar clicar em "Reveal" primeiro para mostrá-la.

