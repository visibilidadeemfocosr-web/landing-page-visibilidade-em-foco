# Como Iniciar o Servidor

## ✅ Problemas Corrigidos:
1. ✅ Removido `pnpm-lock.yaml` (conflito com npm)
2. ✅ Corrigido `package.json` (removido flag inválida)
3. ✅ Configurado `next.config.mjs` para desabilitar Turbopack

## 🚀 Para Iniciar o Servidor Manualmente:

Abra um terminal e execute:

```bash
cd /Users/macbookair/Downloads/landing-page-for-project
PORT=3001 npm run dev
```

## ⏳ Aguarde:
- O servidor leva cerca de 15-30 segundos para compilar
- Você verá mensagens como "✓ Ready" quando estiver pronto
- Quando estiver pronto, verá: `Local: http://localhost:3001`

## 🔍 Se Não Funcionar:

1. **Verifique se a porta 3001 está livre:**
   ```bash
   lsof -i :3001
   ```
   Se houver processo, mate-o:
   ```bash
   kill -9 $(lsof -ti:3001)
   ```

2. **Limpe o cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Verifique erros no terminal** e me envie a mensagem de erro

## 📝 Checklist Antes de Iniciar:
- [ ] `.env.local` configurado com as chaves do Supabase
- [ ] Tabelas criadas no Supabase (execute o schema SQL)
- [ ] Bucket `artist-images` criado no Supabase Storage

## 🎯 Depois que o servidor iniciar:
- Acesse: http://localhost:3001
- A landing page deve aparecer
- Para criar perguntas: http://localhost:3001/admin/questions

