import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Listar todas as perguntas (admin)
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: questions, error } = await supabase
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
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('questions')
      .insert([{
        text: body.text,
        field_type: body.field_type,
        required: body.required ?? false,
        order: body.order ?? 0,
        options: body.options ? JSON.parse(JSON.stringify(body.options)) : null,
        min_value: body.min_value ?? null,
        max_value: body.max_value ?? null,
        placeholder: body.placeholder ?? null,
        active: body.active ?? true,
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao criar pergunta' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar pergunta (admin)
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { id, ...updates } = body

    const { data, error } = await supabase
      .from('questions')
      .update({
        ...updates,
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
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }

    const { error } = await supabase
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

