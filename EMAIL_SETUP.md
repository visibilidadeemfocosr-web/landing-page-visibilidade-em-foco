# Configuração de E-mail - Visibilidade em Foco

Este documento explica como configurar o envio automático de e-mails quando um post é publicado no Instagram.

## 📧 Funcionalidade

Quando um moderador publica um post no Instagram, o sistema envia automaticamente um e-mail para o artista informando que o post está no ar, com um link direto para o post.

## 🔧 Configuração

### 1. Criar App Password no Gmail

1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em **Segurança**
3. Ative a **Verificação em duas etapas** (se ainda não estiver ativada)
4. Role até **Senhas de app**
5. Selecione **E-mail** e **Outro (personalizado)**
6. Digite "Visibilidade em Foco" como nome
7. Clique em **Gerar**
8. **Copie a senha gerada** (16 caracteres, sem espaços)

### 2. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no arquivo `.env.local` ou nas variáveis de ambiente do seu servidor:

```env
GMAIL_USER=visibilidade.emfocosr@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

**⚠️ IMPORTANTE:**
- Use a **App Password** gerada, NÃO a senha normal da conta
- A App Password tem 16 caracteres, geralmente separados em grupos de 4
- Mantenha essas variáveis seguras e nunca as commite no Git

### 3. Verificar Coleta de E-mail

O sistema busca o e-mail do artista através da pergunta que contém "e-mail" ou "email" no texto. Certifique-se de que:

- A pergunta sobre e-mail está ativa no formulário
- A pergunta está na seção de "Divulgação" (quando o artista quer participar da rede social)
- O campo é do tipo `text` e detecta automaticamente como e-mail

## 📨 Template do E-mail

O e-mail enviado inclui:

- **Header**: Logo e identidade visual do projeto
- **Saudação personalizada**: "Olá, [Nome do Artista]!"
- **Mensagem de agradecimento**: Agradece a participação no mapeamento
- **Notificação**: Informa que o post está no ar
- **Botão CTA**: Link direto para o post no Instagram
- **Footer**: Informações do projeto e links para redes sociais

O design está alinhado com a identidade visual da home principal (cores roxo, laranja, rosa).

## 🔍 Como Funciona

1. Moderador publica post no Instagram através da interface de moderação
2. Sistema atualiza status para "published" no banco de dados
3. Sistema busca automaticamente:
   - Nome do artista
   - E-mail do artista
   - Link do post no Instagram (permalink)
4. Se e-mail válido for encontrado, envia e-mail automaticamente
5. Logs são registrados no console para debug

## 🐛 Troubleshooting

### E-mail não está sendo enviado

1. **Verificar variáveis de ambiente:**
   ```bash
   echo $GMAIL_USER
   echo $GMAIL_APP_PASSWORD
   ```

2. **Verificar logs do servidor:**
   - Procure por mensagens como "📧 E-mail de notificação enviado"
   - Ou "⚠️ E-mail não encontrado ou inválido"

3. **Verificar se o e-mail está sendo coletado:**
   - Confirme que a pergunta sobre e-mail está no formulário
   - Verifique se o artista preencheu o e-mail corretamente

4. **Verificar App Password:**
   - Certifique-se de que a App Password está correta
   - Não use espaços na variável (remova espaços se houver)

### E-mail vai para spam

- Isso pode acontecer com Gmail SMTP
- Recomendamos verificar a pasta de spam
- Para melhor deliverability, considere usar um serviço como Resend no futuro

## 📝 Notas Técnicas

- O envio de e-mail é **assíncrono** e **não bloqueia** a publicação do post
- Se o envio falhar, o post ainda será publicado (erro é apenas logado)
- O sistema valida se o e-mail é válido antes de tentar enviar
- O template é responsivo e funciona em dispositivos móveis

## 🔐 Segurança

- Nunca commite as variáveis de ambiente no Git
- Use App Passwords ao invés de senhas normais
- Mantenha as credenciais seguras
- Considere usar variáveis de ambiente do servidor (Vercel, etc.)
