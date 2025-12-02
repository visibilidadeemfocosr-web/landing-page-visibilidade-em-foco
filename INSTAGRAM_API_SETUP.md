# Integração com Instagram API

Este documento explica como configurar e usar a integração com a Instagram API para publicar posts automaticamente.

## 📋 Pré-requisitos

- ✅ Conta do Instagram Business ou Creator
- ✅ Página do Facebook conectada ao Instagram
- ✅ App criado no Meta for Developers
- ✅ Instagram Tester configurado
- ✅ Access Token gerado

## 🔑 Credenciais Configuradas

As seguintes variáveis de ambiente estão configuradas no arquivo `.env.local`:

```env
# Instagram API Configuration
INSTAGRAM_APP_ID=33072353345712168
INSTAGRAM_APP_SECRET=5a5054fb0078fbaeefd6df5ed7470041
INSTAGRAM_REDIRECT_URI=http://localhost:3001/api/instagram/callback
INSTAGRAM_ACCESS_TOKEN=IGAAWwtybbtftBZAFNCSUhqSkhqV1JFazh0X1ZArTU5RbGlKQmd5UWpsZA1UyRl9VVHNfbTZAYNzY2ajRxeFBfdG1rMFpKbUpmUUJwR2ZAxVmVNcFZAHVEoxMnBCazFBNU93cG5INXdLTk40NGxBcmQzYnc2QVFKMHQxY2hLamN3VVh6OAZDZD
```

## 📁 Arquivos Criados

### 1. `lib/instagram.ts`
Funções auxiliares para interação com a Instagram API:
- `getInstagramAccountId()` - Obtém o ID da conta do Instagram Business
- `createMediaContainer()` - Cria um container de mídia (preparação para publicação)
- `createCarouselChild()` - Cria um item filho para carousel
- `publishMedia()` - Publica o container de mídia no Instagram
- `publishInstagramPost()` - Função principal para publicar um post único
- `publishInstagramCarousel()` - Função principal para publicar um carousel (múltiplas imagens)

### 2. `app/api/instagram/callback/route.ts`
Rota de callback OAuth para autorização do Instagram.

### 3. `app/api/instagram/publish/route.ts`
Rota para publicar posts no Instagram via API.

**Uso:**
```typescript
POST /api/instagram/publish
Content-Type: application/json

{
  "imageUrl": "https://exemplo.com/imagem.png",  // ou ["url1.png", "url2.png"] para carousel
  "caption": "Legenda do post com #hashtags",
  "isCarousel": false  // true para carousel
}
```

## 🚀 Como Publicar no Instagram

### Opção 1: Via API (Automático)

Para publicar um post único:

```typescript
const response = await fetch('/api/instagram/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://seu-servidor.com/imagem.png',
    caption: 'Legenda do post #arte #lgbtqia #SaoRoque',
    isCarousel: false
  })
})

const data = await response.json()
console.log('Post publicado:', data.data.permalink)
```

Para publicar um carousel (2+ imagens):

```typescript
const response = await fetch('/api/instagram/publish', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: [
      'https://seu-servidor.com/post1.png',
      'https://seu-servidor.com/post2.png'
    ],
    caption: 'Legenda do carousel #arte #lgbtqia #SaoRoque',
    isCarousel: true
  })
})
```

**⚠️ Importante:** As imagens devem estar hospedadas em um servidor público e acessível via HTTPS.

### Opção 2: Manual (Atual)

Por enquanto, o sistema está configurado para download manual:

1. Acesse **Admin** → **Moderação** → Selecione um artista
2. No preview, use os botões:
   - **Post 1: Apresentação** → Baixar Preview
   - **Post 2: Biografia + Redes** → Baixar Preview
3. Copie a legenda gerada
4. Publique manualmente no Instagram como carousel

## 🔄 Próximos Passos para Publicação Automática

Para implementar a publicação automática, você precisa:

### 1. Hospedar as Imagens
As imagens geradas precisam estar em um servidor público:
- Supabase Storage
- Vercel Blob
- Cloudinary
- AWS S3
- Outro serviço de hospedagem

### 2. Atualizar o Fluxo de Moderação

No arquivo `app/admin/moderate-preview/moderate-preview-client.tsx`, descomente e implemente a função `handlePublishToInstagram`:

```typescript
const handlePublishToInstagram = async () => {
  setLoading(true)
  try {
    // 1. Gerar e fazer upload das imagens para um servidor público
    const post1Url = await uploadImageToServer(post1Data)
    const post2Url = await uploadImageToServer(post2Data)
    
    // 2. Obter a legenda
    const caption = generateInstagramCaption()
    
    // 3. Publicar no Instagram via API
    const response = await fetch('/api/instagram/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: [post1Url, post2Url],
        caption: caption,
        isCarousel: true
      })
    })
    
    if (!response.ok) throw new Error('Erro ao publicar')
    
    const data = await response.json()
    toast.success('Post publicado no Instagram!')
    
    // 4. Atualizar o status na moderação
    if (submissionId) {
      await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          status: 'published',
          instagram_post_id: data.data.id
        })
      })
    }
    
    // 5. Abrir o post no Instagram
    if (data.data.permalink) {
      window.open(data.data.permalink, '_blank')
    }
  } catch (error: any) {
    toast.error('Erro ao publicar: ' + error.message)
  } finally {
    setLoading(false)
  }
}
```

### 3. Renovar o Access Token

O Access Token atual é de **curta duração** (expira em 1 hora). Para produção, você precisa:

1. Trocar por um **Long-lived Access Token** (expira em 60 dias)
2. Implementar renovação automática do token

**Como gerar Long-lived Token:**

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=33072353345712168&client_secret=5a5054fb0078fbaeefd6df5ed7470041&fb_exchange_token=SEU_TOKEN_ATUAL"
```

## 📝 Limitações da API do Instagram

- Máximo de **25 posts por dia** por conta
- Imagens devem ter no mínimo **320px** de largura
- Tamanho máximo do arquivo: **8MB**
- Formato de imagem: **JPEG ou PNG**
- Carousel: entre **2 e 10 imagens**
- Legenda: máximo **2.200 caracteres**
- Hashtags: máximo **30 por post**

## 🔗 Links Úteis

- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Instagram Content Publishing](https://developers.facebook.com/docs/instagram-api/guides/content-publishing)
- [Access Tokens](https://developers.facebook.com/docs/instagram-basic-display-api/overview#instagram-user-access-tokens)
- [Meta for Developers](https://developers.facebook.com/)

## 🐛 Troubleshooting

### Erro: "Access Token inválido"
- Verifique se o token não expirou
- Gere um novo token no Meta for Developers
- Atualize o `.env.local`

### Erro: "Instagram Business Account não encontrada"
- Certifique-se de que o Instagram está conectado à Página do Facebook
- Verifique se a conta é Business ou Creator (não pode ser pessoal)

### Erro: "Erro ao criar container de mídia"
- Verifique se a URL da imagem é pública e acessível
- Confirme que a imagem tem o formato correto (JPEG ou PNG)
- Verifique o tamanho da imagem (mínimo 320px, máximo 8MB)

## ✅ Status Atual

- ✅ App criado no Meta for Developers
- ✅ Instagram Tester configurado
- ✅ Access Token gerado
- ✅ Rotas da API criadas
- ✅ Funções auxiliares implementadas
- ⏳ Upload de imagens para servidor público (pendente)
- ⏳ Implementação da publicação automática no admin (pendente)
- ⏳ Renovação automática do token (pendente)

## 📞 Suporte

Em caso de dúvidas ou problemas, consulte:
- Documentação oficial da Meta: https://developers.facebook.com/docs/
- Logs do servidor: `npm run dev` e verifique o terminal
- Logs do navegador: Console do DevTools

