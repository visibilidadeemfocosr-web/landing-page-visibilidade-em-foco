# 🔧 Troubleshooting - Conexão com Gmail

## ❌ Problema: Não consigo conectar com Gmail

Este guia vai te ajudar a diagnosticar e resolver problemas de conexão com o Gmail.

---

## 🔍 Diagnóstico Rápido

### **1. Onde você está testando?**

- ✅ **Local (`.env.local`)**: Para desenvolvimento
- ⚠️ **Vercel (Produção)**: Precisa configurar variáveis de ambiente na Vercel

### **2. Verificar variáveis de ambiente**

#### **Localmente:**
```bash
# Verificar se o arquivo .env.local existe
cat .env.local | grep GMAIL

# Deve mostrar:
# GMAIL_USER=visibilidade.emfocosr@gmail.com
# GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
```

#### **Na Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Verifique se existem:
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`

---

## 🛠️ Soluções por Tipo de Erro

### **Erro: "EAUTH" ou "Invalid login"**

**Causa:** App Password incorreta ou formato errado

**Solução:**
1. **Gerar nova App Password:**
   - Acesse: https://myaccount.google.com/security
   - Ative **Verificação em duas etapas** (se não estiver)
   - Vá em **Senhas de app**
   - Selecione **E-mail** → **Outro** → Digite "Visibilidade em Foco"
   - Clique em **Gerar**
   - **Copie a senha de 16 caracteres** (ex: `abcd efgh ijkl mnop`)

2. **Remover espaços:**
   - A senha aparece como: `abcd efgh ijkl mnop`
   - **Use sem espaços:** `abcdefghijklmnop`
   - Cole exatamente assim nas variáveis de ambiente

3. **Atualizar variáveis:**
   ```env
   GMAIL_USER=visibilidade.emfocosr@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   ```

4. **Na Vercel:**
   - Remova a variável antiga
   - Adicione a nova (sem espaços)
   - Faça um novo deploy

---

### **Erro: "ECONNECTION" ou "ETIMEDOUT"**

**Causa:** Problema de rede ou firewall bloqueando

**Solução:**
1. **Verificar conexão com internet**
2. **Verificar firewall/antivírus** (pode bloquear porta 465)
3. **Se estiver na Vercel:** Pode ser temporário, tente novamente

---

### **Erro: "Verificação em duas etapas não ativada"**

**Causa:** App Password só funciona com verificação em duas etapas

**Solução:**
1. Acesse: https://myaccount.google.com/security
2. Ative **Verificação em duas etapas**
3. Depois, gere uma nova **App Password**

---

### **Erro: "Variáveis não encontradas"**

**Causa:** Variáveis de ambiente não configuradas

**Solução:**

#### **Localmente:**
1. Crie/edite `.env.local` na raiz do projeto:
   ```env
   GMAIL_USER=seu-email@gmail.com
   GMAIL_APP_PASSWORD=sua-senha-de-16-caracteres-sem-espacos
   ```

2. Reinicie o servidor:
   ```bash
   npm run dev
   ```

#### **Na Vercel:**
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. **Settings** → **Environment Variables**
4. Adicione:
   - **Key:** `GMAIL_USER`
   - **Value:** `visibilidade.emfocosr@gmail.com`
   - **Environment:** Production, Preview, Development (todas)
   
5. Adicione:
   - **Key:** `GMAIL_APP_PASSWORD`
   - **Value:** `sua-senha-sem-espacos`
   - **Environment:** Production, Preview, Development (todas)

6. **Importante:** Faça um novo deploy após adicionar variáveis!

---

## 🧪 Teste de Conexão

### **Teste Local:**

1. **Verificar logs ao publicar um post:**
   - Abra o terminal onde o servidor está rodando
   - Publique um post no Instagram
   - Procure por:
     - ✅ `✅ E-mail enviado com sucesso` → Funcionou!
     - ❌ `❌ Erro ao enviar e-mail` → Veja o erro específico
     - ⚠️ `⚠️ Gmail credentials não configuradas` → Variáveis faltando

### **Teste na Vercel:**

1. **Verificar logs:**
   - Acesse: https://vercel.com/dashboard
   - Seu projeto → **Deployments** → Último deployment → **Functions**
   - Clique no log da função que envia e-mail
   - Procure por mensagens de erro

2. **Testar via API:**
   - Você pode criar um endpoint de teste (se necessário)

---

## 📋 Checklist Completo

Marque cada item conforme for verificando:

- [ ] Verificação em duas etapas está ativada no Gmail
- [ ] App Password foi gerada (16 caracteres)
- [ ] App Password está sem espaços nas variáveis
- [ ] `GMAIL_USER` está configurado corretamente (e-mail completo)
- [ ] `GMAIL_APP_PASSWORD` está configurado (senha sem espaços)
- [ ] Variáveis estão no `.env.local` (local) OU na Vercel (produção)
- [ ] Servidor foi reiniciado após alterar `.env.local`
- [ ] Novo deploy foi feito na Vercel após adicionar variáveis
- [ ] Logs foram verificados para ver erro específico

---

## 🆘 Ainda não funciona?

### **Informações para me enviar:**

1. **Onde está testando?** (Local ou Vercel)
2. **Mensagem de erro completa** dos logs
3. **Código do erro** (se aparecer, ex: `EAUTH`, `ECONNECTION`)
4. **Screenshot** dos logs (se possível)

### **Verificações extras:**

1. **Testar login manual no Gmail:**
   - Certifique-se de que consegue fazer login normalmente
   - Verifique se a conta não está bloqueada

2. **Tentar com outra conta Gmail:**
   - Use outra conta temporariamente para testar
   - Se funcionar, o problema é na conta original

3. **Verificar se App Password não foi revogada:**
   - Google pode revogar se detectar atividade suspeita
   - Gere uma nova App Password

---

## 💡 Dicas Importantes

1. **App Password ≠ Senha normal**
   - Nunca use a senha normal da conta
   - Sempre use App Password (16 caracteres)

2. **Sem espaços**
   - App Password: `abcd efgh ijkl mnop` (como aparece)
   - Use nas variáveis: `abcdefghijklmnop` (sem espaços)

3. **Vercel precisa de novo deploy**
   - Variáveis adicionadas na Vercel só funcionam após novo deploy
   - Faça um novo push para o GitHub

4. **Logs são seus amigos**
   - Sempre verifique os logs quando algo não funciona
   - Mensagens de erro ajudam muito no diagnóstico

---

## 🔗 Links Úteis

- [Criar App Password](https://myaccount.google.com/apppasswords)
- [Configurar Verificação em Duas Etapas](https://myaccount.google.com/security)
- [Documentação Nodemailer](https://nodemailer.com/about/)

---

**Última atualização:** Janeiro 2025
