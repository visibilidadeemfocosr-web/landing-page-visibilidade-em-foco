import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Obter estatísticas gerais (admin)
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Total de submissões
    const { count: totalSubmissions } = await supabase
      .from('submissions')
      .select('*', { count: 'exact', head: true })

    // Total de perguntas ativas
    const { count: totalQuestions } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    // Estatísticas por tipo de campo
    const { data: questions } = await supabase
      .from('questions')
      .select('id, field_type, text')
      .eq('active', true)

    // Estatísticas por resposta (para campos específicos)
    const { data: allAnswers } = await supabase
      .from('answers')
      .select(`
        value,
        questions (
          field_type,
          text
        )
      `)

    // Processar estatísticas
    const stats = {
      total_submissions: totalSubmissions || 0,
      total_questions: totalQuestions || 0,
      by_field_type: questions?.reduce((acc: any, q) => {
        acc[q.field_type] = (acc[q.field_type] || 0) + 1
        return acc
      }, {}) || {},
      answers_by_question: questions?.map(q => {
        const questionAnswers = allAnswers?.filter(
          (a: any) => a.questions?.id === q.id
        ) || []
        
        return {
          question_id: q.id,
          question_text: q.text,
          field_type: q.field_type,
          total_answers: questionAnswers.length,
          unique_values: getUniqueValues(questionAnswers, q.field_type),
        }
      }) || [],
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

function getUniqueValues(answers: any[], fieldType: string) {
  if (fieldType === 'yesno') {
    const values = answers.map(a => a.value === 'true' || a.value === 'Sim' ? 'Sim' : 'Não')
    return {
      'Sim': values.filter(v => v === 'Sim').length,
      'Não': values.filter(v => v === 'Não').length,
    }
  }
  
  if (fieldType === 'scale') {
    const values = answers.map(a => Number(a.value))
    const counts: Record<string, number> = {}
    values.forEach(v => {
      counts[String(v)] = (counts[String(v)] || 0) + 1
    })
    return counts
  }

  // Para outros tipos, contar valores únicos
  const valueCounts: Record<string, number> = {}
  answers.forEach(a => {
    const val = String(a.value || '')
    valueCounts[val] = (valueCounts[val] || 0) + 1
  })
  return valueCounts
}

