# Como Gerar Token do GitHub para Fazer Push

## 🔐 Passo a Passo para Criar um Personal Access Token

### 1. Acesse as Configurações do GitHub

1. Vá para: https://github.com/settings/tokens
2. Ou clique no seu avatar (canto superior direito) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**

### 2. Criar Novo Token

1. Clique em **"Generate new token"** → **"Generate new token (classic)"**
2. Dê um nome para o token (ex: "Landing Page Visibilidade em Foco")
3. Escolha a validade (recomendo **90 dias** ou **No expiration** se for seu computador pessoal)
4. **Marque as permissões**:
   - ✅ **repo** (tudo) - necessário para fazer push/pull

### 3. Gerar e Copiar

1. Role até o final e clique em **"Generate token"**
2. ⚠️ **IMPORTANTE**: Copie o token AGORA! Você só verá ele uma vez.
3. Exemplo: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Usar o Token no Push

Quando pedir **Username**, digite seu usuário do GitHub.
Quando pedir **Password**, cole o **token** (não sua senha do GitHub).

## 📋 Opções para Fazer Push

### Opção 1: Usar Token na URL (Mais Fácil)

Execute este comando (substitua `SEU_TOKEN` pelo token que você copiou):

```bash
git remote set-url origin https://SEU_TOKEN@github.com/visibilidadeemfocosr-web/landing-page-visibilidade-em-foco.git
git push -u origin main
```

### Opção 2: Git pedirá o token automaticamente

Execute normalmente:

```bash
git push -u origin main
```

Quando pedir:
- **Username**: seu usuário do GitHub
- **Password**: cole o token (não sua senha)

### Opção 3: Usar SSH (Mais Seguro a Longo Prazo)

Se você preferir usar SSH:

1. Configure SSH key no GitHub
2. Mude a URL do remote:

```bash
git remote set-url origin git@github.com:visibilidadeemfocosr-web/landing-page-visibilidade-em-foco.git
git push -u origin main
```

## ✅ Depois do Push

Quando funcionar, você verá algo como:
```
Enumerating objects: 134, done.
Counting objects: 100% (134/134), done.
...
To https://github.com/visibilidadeemfocosr-web/landing-page-visibilidade-em-foco.git
 * [new branch]      main -> main
```

E seu código estará no GitHub! 🎉

---

**Dica**: Se você usar o token na URL (Opção 1), não precisará digitar toda vez!

