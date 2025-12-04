import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { publishInstagramPost } from '@/lib/instagram'

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
    
    // Publicar usando a função da lib (mesma que moderação usa)
    let publishData
    try {
      publishData = await publishInstagramPost(imageUrl, caption || '')
    } catch (error: any) {
      console.error('Erro ao publicar no Instagram:', error)
      return NextResponse.json(
        { 
          error: error.message || 'Erro ao publicar no Instagram', 
          details: error 
        },
        { status: 500 }
      )
    }
    
    // 2. Atualizar post no banco de dados
    const { data: updatedPost, error: updateError } = await supabase
      .from('instagram_posts')
      .update({
        status: 'published',
        instagram_post_id: publishData.id,
        published_at: new Date().toISOString(),
        image_url: imageUrl,
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
  } catch (error: any) {
    console.error('Erro ao publicar post:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor', details: String(error) },
      { status: 500 }
    )
  }
}

