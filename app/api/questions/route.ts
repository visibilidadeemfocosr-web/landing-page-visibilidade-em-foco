import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('active', true)
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

