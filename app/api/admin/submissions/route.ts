import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Listar todas as submissões (admin)
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: submissions, error } = await supabase
      .from('submissions')
      .select(`
        *,
        answers (
          *,
          questions (
            id,
            text,
            field_type
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(submissions)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar submissões' },
      { status: 500 }
    )
  }
}

