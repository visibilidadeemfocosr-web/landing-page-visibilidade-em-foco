import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST - Criar nova submissão com respostas
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { answers } = body

    // Criar submissão
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert([{}])
      .select()
      .single()

    if (submissionError) throw submissionError

    // Inserir respostas
    const answersToInsert = answers.map((answer: any) => ({
      question_id: answer.question_id,
      submission_id: submission.id,
      value: answer.value ? String(answer.value) : null,
      file_url: answer.file_url || null,
    }))

    const { error: answersError } = await supabase
      .from('answers')
      .insert(answersToInsert)

    if (answersError) throw answersError

    return NextResponse.json({ 
      success: true, 
      submission_id: submission.id 
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar formulário' },
      { status: 500 }
    )
  }
}

