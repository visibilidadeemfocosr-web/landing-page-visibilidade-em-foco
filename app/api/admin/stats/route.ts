import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Obter estatísticas gerais (admin)
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
    
    // Total de submissões
    const { count: totalSubmissions } = await adminClient
      .from('submissions')
      .select('*', { count: 'exact', head: true })

    // Total de perguntas ativas
    const { count: totalQuestions } = await adminClient
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    // Estatísticas por tipo de campo
    const { data: questions } = await adminClient
      .from('questions')
      .select('id, field_type, text')
      .eq('active', true)

    // Estatísticas por resposta (para campos específicos)
    const { data: allAnswers } = await adminClient
      .from('answers')
      .select(`
        value,
        file_url,
        question_id,
        submission_id
      `)
    
    // Buscar informações das perguntas separadamente
    const questionIds = [...new Set((allAnswers || []).map((a: any) => a.question_id))]
    const { data: questionData } = await adminClient
      .from('questions')
      .select('id, field_type, text')
      .in('id', questionIds.length > 0 ? questionIds : ['00000000-0000-0000-0000-000000000000'])
    
    // Criar mapa de perguntas
    const questionMap = new Map((questionData || []).map((q: any) => [q.id, q]))
    
    // Para perguntas de CEP, buscar o bairro relacionado
    // Primeiro, encontrar a pergunta de CEP
    const cepQuestion = questionData?.find((q: any) => q.field_type === 'cep')
    
    // Se houver pergunta de CEP, buscar perguntas de bairro relacionadas
    let bairroMap = new Map()
    if (cepQuestion) {
      // Buscar pergunta de bairro (que geralmente contém "bairro" no texto)
      const { data: bairroQuestions } = await adminClient
        .from('questions')
        .select('id, text')
        .ilike('text', '%bairro%')
      
      if (bairroQuestions && bairroQuestions.length > 0) {
        // Buscar respostas de bairro agrupadas por submission_id
        const submissionIds = [...new Set((allAnswers || []).map((a: any) => a.submission_id))]
        const { data: bairroAnswers } = await adminClient
          .from('answers')
          .select('value, submission_id')
          .in('question_id', bairroQuestions.map((q: any) => q.id))
          .in('submission_id', submissionIds.length > 0 ? submissionIds : ['00000000-0000-0000-0000-000000000000'])
        
        // Criar mapa: submission_id -> bairro
        bairroAnswers?.forEach((a: any) => {
          if (a.value) {
            bairroMap.set(a.submission_id, a.value)
          }
        })
      }
    }
    
    // Adicionar informações das perguntas às respostas
    const answersWithQuestions = (allAnswers || []).map((a: any) => ({
      ...a,
      question: questionMap.get(a.question_id),
      bairro: a.question_id === cepQuestion?.id ? bairroMap.get(a.submission_id) : null
    }))

    // Processar estatísticas
    const answersByQuestion = questions?.map(q => {
      const questionAnswers = answersWithQuestions.filter(
        (a: any) => a.question_id === q.id
      )
      
      // Para perguntas de CEP, processar com bairro
      if (q.field_type === 'cep') {
        const cepWithBairro: Record<string, { cep: string; bairro?: string; count: number }> = {}
        
        questionAnswers.forEach((a: any) => {
          let cep = a.value || ''
          let bairro = a.bairro || ''
          
          // Verificar se o valor do CEP contém o bairro no formato "CEP|BAIRRO"
          if (cep.includes('|')) {
            const parts = cep.split('|')
            cep = parts[0] || ''
            bairro = parts[1] || bairro
          }
          
          // Se ainda não tem bairro, tentar buscar da pergunta de bairro relacionada
          if (!bairro && a.submission_id) {
            const submissionBairro = bairroMap.get(a.submission_id)
            if (submissionBairro) {
              bairro = submissionBairro
            }
          }
          
          const key = bairro ? `${cep} - ${bairro}` : cep
          
          if (!cepWithBairro[key]) {
            cepWithBairro[key] = { cep, bairro: bairro || undefined, count: 0 }
          }
          cepWithBairro[key].count++
        })
        
        // Converter para o formato esperado
        const uniqueValues: Record<string, number> = {}
        Object.entries(cepWithBairro).forEach(([key, data]) => {
          uniqueValues[key] = data.count
        })
        
        return {
          question_id: q.id,
          question_text: q.text,
          field_type: q.field_type,
          total_answers: questionAnswers.length,
          unique_values: uniqueValues,
          cep_details: cepWithBairro, // Manter detalhes para exibição
        }
      }
      
      const uniqueValues = getUniqueValues(questionAnswers, q.field_type)
      
      return {
        question_id: q.id,
        question_text: q.text,
        field_type: q.field_type,
        total_answers: questionAnswers.length,
        unique_values: uniqueValues,
      }
    }) || []

    const stats = {
      total_submissions: totalSubmissions || 0,
      total_questions: totalQuestions || 0,
      by_field_type: questions?.reduce((acc: any, q) => {
        acc[q.field_type] = (acc[q.field_type] || 0) + 1
        return acc
      }, {}) || {},
      answers_by_question: answersByQuestion.filter((q: any) => q.total_answers > 0), // Mostrar apenas perguntas com respostas
    }

    console.log('Estatísticas processadas:', JSON.stringify(stats, null, 2))
    console.log('Total de perguntas com respostas:', stats.answers_by_question.length)

    return NextResponse.json(stats)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar estatísticas' },
      { status: 500 }
    )
  }
}

function getUniqueValues(answers: any[], fieldType: string) {
  if (!answers || answers.length === 0) {
    return {}
  }

  if (fieldType === 'yesno') {
    const values = answers.map(a => {
      const val = String(a.value || '').toLowerCase()
      if (val === 'true' || val === 'sim' || val === 'yes') return 'Sim'
      if (val === 'false' || val === 'nao' || val === 'não' || val === 'no') return 'Não'
      if (val === 'prefiro-nao-responder' || val.includes('prefiro')) return 'Prefiro não responder'
      return val === 'sim' ? 'Sim' : 'Não'
    })
    const counts: Record<string, number> = {}
    values.forEach(v => {
      counts[v] = (counts[v] || 0) + 1
    })
    return counts
  }
  
  if (fieldType === 'scale') {
    const counts: Record<string, number> = {}
    answers.forEach(a => {
      const val = String(a.value || '').trim()
      if (val) {
        counts[val] = (counts[val] || 0) + 1
      }
    })
    return counts
  }

  // Para outros tipos (radio, select, text, etc), contar valores únicos
  const valueCounts: Record<string, number> = {}
  answers.forEach(a => {
    const val = String(a.value || '').trim()
    if (val) {
      valueCounts[val] = (valueCounts[val] || 0) + 1
    }
  })
  return valueCounts
}

