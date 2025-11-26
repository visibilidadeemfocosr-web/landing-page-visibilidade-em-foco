import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// POST - Criar nova submissão com respostas
export async function POST(request: Request) {
  try {
    // Para submissões públicas, usar service_role para bypass RLS
    // Isso é seguro porque não expõe dados sensíveis, apenas cria submissões
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
        },
      }
    )
    const body = await request.json()
    const { answers } = body

    // Validar se answers existe e é um array
    if (!answers || !Array.isArray(answers)) {
      console.error('Erro: answers não é um array válido', { answers })
      return NextResponse.json(
        { error: 'Respostas inválidas' },
        { status: 400 }
      )
    }

    // Criar submissão
    const { data: submission, error: submissionError } = await supabase
      .from('submissions')
      .insert([{}])
      .select()
      .single()

    if (submissionError) {
      console.error('Erro ao criar submissão:', submissionError)
      throw submissionError
    }

    if (!submission || !submission.id) {
      console.error('Erro: submissão não foi criada corretamente')
      throw new Error('Erro ao criar submissão')
    }

    // Inserir respostas (filtrar respostas vazias ou inválidas)
    const answersToInsert = answers
      .filter((answer: any) => answer && answer.question_id)
      .map((answer: any) => ({
        question_id: answer.question_id,
        submission_id: submission.id,
        value: answer.value !== undefined && answer.value !== null && answer.value !== '' 
          ? String(answer.value) 
          : null,
        file_url: answer.file_url || null,
      }))

    if (answersToInsert.length === 0) {
      console.error('Erro: nenhuma resposta válida para inserir')
      return NextResponse.json(
        { error: 'Nenhuma resposta válida' },
        { status: 400 }
      )
    }

    const { error: answersError } = await supabase
      .from('answers')
      .insert(answersToInsert)

    if (answersError) {
      console.error('Erro ao inserir respostas:', answersError)
      throw answersError
    }

    return NextResponse.json({ 
      success: true, 
      submission_id: submission.id 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro completo na API de submissões:', error)
    return NextResponse.json(
      { 
        error: error.message || 'Erro ao salvar formulário',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

