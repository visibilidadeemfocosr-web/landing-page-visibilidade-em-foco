# Como Subir o Projeto no GitHub

## ✅ Passo 1: Commit já foi feito!

O commit inicial já foi criado com sucesso. Agora você precisa criar o repositório no GitHub.

## 📋 Opção 1: Via GitHub CLI (se tiver instalado)

```bash
# Criar repositório e fazer push em um comando
gh repo create landing-page-for-project --public --source=. --remote=origin --push
```

## 📋 Opção 2: Via Site do GitHub (Manual - Recomendado)

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. **Nome do repositório**: `landing-page-visibilidade-em-foco` (ou outro nome de sua escolha)
3. **Descrição**: "Sistema de mapeamento de artistas LGBTS - São Roque"
4. Escolha **Público** ou **Privado**
5. **NÃO marque** "Initialize with README" (já temos arquivos)
6. Clique em **"Create repository"**

### 2. Conectar o Repositório Local ao GitHub

Copie a URL do seu novo repositório (algo como: `https://github.com/SEU_USUARIO/nome-do-repo.git`)

Execute estes comandos:

```bash
# Adicionar o repositório remoto (substitua pela URL do seu repositório)
git remote add origin https://github.com/SEU_USUARIO/nome-do-repo.git

# Renomear a branch para main (se necessário)
git branch -M main

# Fazer push do código
git push -u origin main
```

## 📋 Opção 3: Comandos Rápidos (Copie e Cole)

Depois de criar o repositório no GitHub, execute:

```bash
# 1. Adicionar remote (substitua SEU_USUARIO e NOME_DO_REPO)
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git

# 2. Fazer push
git push -u origin main
```

## 🔐 Autenticação

### Se pedir usuário/senha:
- Use um **Personal Access Token** (não sua senha do GitHub)
- Crie em: https://github.com/settings/tokens
- Permissões necessárias: `repo` (full control)

### Ou configure SSH:
```bash
# Se você prefere usar SSH ao invés de HTTPS
git remote set-url origin git@github.com:SEU_USUARIO/NOME_DO_REPO.git
```

## ✅ Verificar se Funcionou

Depois do push, acesse seu repositório no GitHub e você deve ver todos os arquivos lá!

## 🚀 Próximos Passos

Depois de subir no GitHub:

1. ✅ Configure o Supabase (siga `SUPABASE_SETUP.md`)
2. ✅ Crie o arquivo `.env.local` (não será commitado - está no .gitignore)
3. ✅ Faça deploy na Vercel ou outro serviço (opcional)

## 📝 Dica Importante

O arquivo `.env.local` **NÃO** será commitado (está no `.gitignore`). Isso é correto por segurança!

As variáveis de ambiente devem ser configuradas:
- Localmente: no arquivo `.env.local`
- No Vercel/Deploy: nas configurações do serviço

---

**Precisa de ajuda?** Me avise!

