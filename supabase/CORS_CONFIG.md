# Configuração CORS - Supabase Storage

## Problema
Ao processar imagens cropadas, o canvas pode dar erro "Tainted canvases may not be exported" se o CORS não estiver configurado corretamente no Supabase Storage.

## Solução

### 1. Acessar Supabase Dashboard
- Vá para: **Storage** → **artist-images** bucket

### 2. Configurar CORS
Adicione a seguinte configuração CORS:

```json
[
  {
    "allowedOrigins": ["*"],
    "allowedMethods": ["GET", "HEAD"],
    "allowedHeaders": ["*"],
    "maxAge": 3600
  }
]
```

### 3. Ou via SQL (alternativa):
```sql
-- Configurar CORS para o bucket artist-images
UPDATE storage.buckets 
SET allowed_mime_types = NULL,
    file_size_limit = 5242880, -- 5MB
    public = true
WHERE id = 'artist-images';
```

## Como configurar no Dashboard

1. **Supabase Dashboard** → Seu projeto
2. **Storage** (menu lateral)
3. Clique no bucket **artist-images**
4. Clique em **Configuration** ou **Settings**
5. Procure por **CORS configuration**
6. Adicione a regra acima
7. Salve

## Verificação
- Após configurar, recarregue a aplicação
- Teste o crop novamente
- Deve funcionar sem erro de CORS

## Código já aplicado
O código já inclui `crossOrigin="anonymous"` nas imagens, então basta configurar o CORS no Supabase.

