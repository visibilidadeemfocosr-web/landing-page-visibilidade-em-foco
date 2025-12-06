import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const HOME_CONTENT_ID = '00000000-0000-0000-0000-000000000001'

// GET - Carregar conteúdo da home
export async function GET() {
  try {
    // Verificar autenticação
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    // Verificar se é admin
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()
    
    const { data, error } = await adminClient
      .from('home_content')
      .select('content')
      .eq('id', HOME_CONTENT_ID)
      .single()
    
    if (error) {
      // Se não existir, retornar objeto vazio
      if (error.code === 'PGRST116') {
        return NextResponse.json({ content: {} })
      }
      throw error
    }
    
    return NextResponse.json({ content: data?.content || {} })
  } catch (error: any) {
    console.error('Erro ao carregar conteúdo da home:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao carregar conteúdo' },
      { status: 500 }
    )
  }
}

// PUT - Salvar conteúdo da home
export async function PUT(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    // Verificar se é admin
    const adminEmail = process.env.ADMIN_EMAIL || 'visibilidade.emfocosr@gmail.com'
    if (user.email !== adminEmail) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }
    
    const body = await request.json()
    const { content } = body
    
    if (!content) {
      return NextResponse.json({ error: 'Conteúdo é obrigatório' }, { status: 400 })
    }
    
    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()
    
    // Verificar se já existe
    const { data: existing } = await adminClient
      .from('home_content')
      .select('id')
      .eq('id', HOME_CONTENT_ID)
      .single()
    
    let result
    if (existing) {
      // Atualizar
      const { data, error } = await adminClient
        .from('home_content')
        .update({ content })
        .eq('id', HOME_CONTENT_ID)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      // Criar
      const { data, error } = await adminClient
        .from('home_content')
        .insert({
          id: HOME_CONTENT_ID,
          content,
        })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }
    
    return NextResponse.json({ 
      success: true, 
      content: result.content,
      updated_at: result.updated_at 
    })
  } catch (error: any) {
    console.error('Erro ao salvar conteúdo da home:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar conteúdo' },
      { status: 500 }
    )
  }
}

