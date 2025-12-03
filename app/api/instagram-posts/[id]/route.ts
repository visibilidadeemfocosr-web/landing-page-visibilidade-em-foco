import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Buscar post específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Erro ao buscar post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar post:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// PUT - Atualizar post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('instagram_posts')
      .update({
        is_carousel: body.is_carousel,
        slides: body.slides,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        cta_text: body.cta_text,
        cta_link: body.cta_link,
        period_text: body.period_text,
        tag_text: body.tag_text,
        content: body.content,
        image_url: body.image_url,
        caption: body.caption,
        hashtags: body.hashtags,
        status: body.status,
        instagram_post_id: body.instagram_post_id,
        published_at: body.published_at,
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao atualizar post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao atualizar post:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Erro ao deletar post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar post:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

