import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Listar todas as perguntas (admin)
export async function GET() {
  try {
    // Verificar autenticação primeiro
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
    
    const { data: questions, error } = await adminClient
      .from('questions')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error

    return NextResponse.json(questions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar perguntas' },
      { status: 500 }
    )
  }
}

// POST - Criar nova pergunta (admin)
export async function POST(request: Request) {
  try {
    // Verificar autenticação primeiro
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
    
    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('questions')
      .insert([{
        text: body.text,
        field_type: body.field_type,
        required: body.required ?? false,
        order: body.order ?? 0,
        section: body.section || null,
        options: body.options ? JSON.parse(JSON.stringify(body.options)) : null,
        min_value: body.min_value ?? null,
        max_value: body.max_value ?? null,
        placeholder: body.placeholder ?? null,
        has_other_option: body.has_other_option ?? false,
        other_option_label: body.other_option_label || null,
        active: body.active ?? true,
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar pergunta:', error)
      throw error
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Erro detalhado:', error)
    const errorMessage = error.message || 'Erro ao criar pergunta'
    
    // Mensagem mais específica para erro de constraint
    if (errorMessage.includes('check constraint') || errorMessage.includes('field_type')) {
      return NextResponse.json(
        { 
          error: 'Tipo de campo não suportado. Execute o script SQL para adicionar suporte ao tipo CEP no banco de dados.',
          details: errorMessage 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

// PUT - Atualizar pergunta (admin)
export async function PUT(request: Request) {
  try {
    // Verificar autenticação primeiro
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
    const { id, ...updates } = body

    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()

    const { data, error } = await adminClient
      .from('questions')
      .update({
        ...updates,
        section: updates.section || null,
        options: updates.options ? JSON.parse(JSON.stringify(updates.options)) : null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar pergunta' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar pergunta (admin)
export async function DELETE(request: Request) {
  try {
    // Verificar autenticação primeiro
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
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    // Usar admin client para bypass RLS
    const adminClient = createAdminClient()

    const { error } = await adminClient
      .from('questions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar pergunta' },
      { status: 500 }
    )
  }
}

