import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { InstagramPost } from '@/lib/supabase/types'

// GET - Listar todos os posts
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    let query = supabase
      .from('instagram_posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Filtrar por status se fornecido
    if (status && (status === 'draft' || status === 'published')) {
      query = query.eq('status', status)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Erro ao buscar posts:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar posts:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo post
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('instagram_posts')
      .insert({
        template_type: body.template_type,
        is_carousel: body.is_carousel || false,
        slides: body.slides,
        title: body.title,
        subtitle: body.subtitle,
        description: body.description,
        cta_text: body.cta_text,
        cta_link: body.cta_link,
        period_text: body.period_text,
        tag_text: body.tag_text,
        content: body.content,
        caption: body.caption,
        hashtags: body.hashtags,
        status: body.status || 'draft',
      })
      .select()
      .single()
    
    if (error) {
      console.error('Erro ao criar post:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao criar post:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

