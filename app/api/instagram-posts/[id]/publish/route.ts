import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST - Publicar post no Instagram
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    const { imageUrl, caption } = body
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL da imagem é obrigatória' }, { status: 400 })
    }
    
    // Buscar credenciais do Instagram
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
    const instagramAccountId = process.env.INSTAGRAM_ACCOUNT_ID
    
    if (!accessToken || !instagramAccountId) {
      return NextResponse.json(
        { error: 'Credenciais do Instagram não configuradas' },
        { status: 500 }
      )
    }
    
    // Fazer upload da imagem para o bucket público do Supabase
    // (a imagem já deve estar no bucket neste ponto)
    const publicImageUrl = imageUrl
    
    // 1. Criar container de mídia no Instagram
    const createMediaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: publicImageUrl,
          caption: caption || '',
          access_token: accessToken,
        }),
      }
    )
    
    const createMediaData = await createMediaResponse.json()
    
    if (!createMediaResponse.ok || createMediaData.error) {
      console.error('Erro ao criar container de mídia:', createMediaData)
      return NextResponse.json(
        { 
          error: 'Erro ao criar container de mídia', 
          details: createMediaData.error?.message || createMediaData 
        },
        { status: 500 }
      )
    }
    
    const creationId = createMediaData.id
    
    // 2. Aguardar alguns segundos para o Instagram processar
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 3. Publicar o container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    )
    
    const publishData = await publishResponse.json()
    
    if (!publishResponse.ok || publishData.error) {
      console.error('Erro ao publicar mídia:', publishData)
      return NextResponse.json(
        { 
          error: 'Erro ao publicar no Instagram', 
          details: publishData.error?.message || publishData 
        },
        { status: 500 }
      )
    }
    
    // 4. Atualizar post no banco de dados
    const { data: updatedPost, error: updateError } = await supabase
      .from('instagram_posts')
      .update({
        status: 'published',
        instagram_post_id: publishData.id,
        published_at: new Date().toISOString(),
        image_url: publicImageUrl,
      })
      .eq('id', id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Erro ao atualizar post no banco:', updateError)
      return NextResponse.json(
        { error: 'Post publicado mas não foi atualizado no banco', details: updateError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      post: updatedPost,
      instagramPostId: publishData.id,
    })
  } catch (error) {
    console.error('Erro ao publicar post:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    )
  }
}

