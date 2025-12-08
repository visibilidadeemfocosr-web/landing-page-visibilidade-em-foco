import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// GET - Buscar artistas que responderam "Sim" à pergunta sobre rede social
export async function GET() {
  try {
    const adminClient = createAdminClient()

    // Primeiro, encontrar a pergunta sobre rede social
    const { data: questions, error: questionError } = await adminClient
      .from('questions')
      .select('id, text')
      .eq('active', true)
    
    if (questionError) {
      console.error('Erro ao buscar perguntas:', questionError)
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    // Buscar pergunta que contém "rede social" e "lgbtqia+"
    const redeSocialQuestion = questions?.find(q => {
      const textLower = q.text.toLowerCase()
      return (textLower.includes('rede social') && textLower.includes('lgbtqia+')) ||
             (textLower.includes('rede social') && textLower.includes('são roque'))
    })

    if (!redeSocialQuestion) {
      console.log('Pergunta sobre rede social não encontrada')
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    // Buscar todas as respostas "sim" para essa pergunta
    const { data: simAnswers, error: answersError } = await adminClient
      .from('answers')
      .select('submission_id')
      .eq('question_id', redeSocialQuestion.id)
      .ilike('value', '%sim%')
      .not('value', 'ilike', '%não%')
      .not('value', 'ilike', '%nao%')

    if (answersError) {
      console.error('Erro ao buscar respostas:', answersError)
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    if (!simAnswers || simAnswers.length === 0) {
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    const submissionIds = simAnswers.map(a => a.submission_id)

    // Buscar todas as perguntas para montar os dados completos
    const { data: allQuestions, error: questionsError } = await adminClient
      .from('questions')
      .select('id, text, field_type, section')
      .eq('active', true)

    if (questionsError) {
      console.error('Erro ao buscar perguntas:', questionsError)
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    // Buscar todas as respostas dessas submissões
    const { data: allAnswers, error: allAnswersError } = await adminClient
      .from('answers')
      .select('id, question_id, submission_id, value, file_url')
      .in('submission_id', submissionIds)

    if (allAnswersError) {
      console.error('Erro ao buscar todas as respostas:', allAnswersError)
      return NextResponse.json({ artists: [] }, { status: 200 })
    }

    // Buscar status de moderação
    const { data: moderationStatuses } = await adminClient
      .from('moderation_queue')
      .select('submission_id, status, edited_bio, moderator_notes, edited_instagram, edited_facebook, edited_linkedin, edited_caption')
      .in('submission_id', submissionIds)

    // Buscar photo_crop e cropped_photo_url das submissions
    const { data: submissions } = await adminClient
      .from('submissions')
      .select('id, photo_crop, cropped_photo_url')
      .in('id', submissionIds)

    // Agrupar dados por submission
    const artistsMap = new Map()

    submissionIds.forEach(submissionId => {
      const submissionAnswers = allAnswers?.filter(a => a.submission_id === submissionId) || []
      const moderation = moderationStatuses?.find(m => m.submission_id === submissionId)
      const submission = submissions?.find(s => s.id === submissionId)

      // Encontrar dados específicos
      const findAnswer = (questionText: string) => {
        const question = allQuestions?.find(q => 
          q.text.toLowerCase().includes(questionText.toLowerCase())
        )
        if (!question) return null
        return submissionAnswers.find(a => a.question_id === question.id)
      }

      // Extrair dados
      const nameAnswer = findAnswer('gostaria de ser chamado') || findAnswer('nome')
      const bioAnswer = findAnswer('compartilhar um pouco da sua trajetória') || findAnswer('trajetória como artista') || findAnswer('biografia')
      const photoAnswer = findAnswer('foto') || submissionAnswers.find(a => a.file_url)
      const mainLanguageAnswer = findAnswer('linguagem artística principal')
      const otherLanguagesAnswer = findAnswer('outras linguagens')
      
      // Extrair redes sociais (campo social_media)
      const socialMediaQuestion = allQuestions?.find(q => q.field_type === 'social_media')
      const socialMediaAnswer = socialMediaQuestion 
        ? submissionAnswers.find(a => a.question_id === socialMediaQuestion.id)
        : null

      // Usar redes sociais editadas se existirem, senão usar as originais
      let instagram = moderation?.edited_instagram || ''
      let facebook = moderation?.edited_facebook || ''
      let linkedin = moderation?.edited_linkedin || ''

      // Se não houver redes sociais editadas, buscar das respostas originais
      if (!instagram && !facebook && !linkedin) {
      if (socialMediaAnswer?.value) {
        // Formato: "Instagram: @user | Facebook: link | LinkedIn: link"
        const parts = socialMediaAnswer.value.split('|')
        parts.forEach((part: string) => {
          const trimmed = part.trim()
          if (trimmed.toLowerCase().includes('instagram:')) {
            instagram = trimmed.replace(/instagram:/i, '').trim()
          } else if (trimmed.toLowerCase().includes('facebook:')) {
            facebook = trimmed.replace(/facebook:/i, '').trim()
          } else if (trimmed.toLowerCase().includes('linkedin:')) {
            linkedin = trimmed.replace(/linkedin:/i, '').trim()
          }
        })
      }
      }

      artistsMap.set(submissionId, {
        submission_id: submissionId,
        name: nameAnswer?.value || 'Sem nome',
        bio: moderation?.edited_bio || bioAnswer?.value || '',
        original_bio: bioAnswer?.value || '',
        photo: submission?.cropped_photo_url || photoAnswer?.file_url || photoAnswer?.value || null,
        original_photo: photoAnswer?.file_url || photoAnswer?.value || null,
        photo_crop: submission?.photo_crop || null,
        main_artistic_language: mainLanguageAnswer?.value || '',
        other_artistic_languages: otherLanguagesAnswer?.value || '',
        instagram,
        facebook,
        linkedin,
        status: moderation?.status || 'pending',
        moderator_notes: moderation?.moderator_notes || null,
        edited_caption: moderation?.edited_caption || null,
        created_at: submissionAnswers[0]?.id || null,
      })
    })

    const artists = Array.from(artistsMap.values())
      .sort((a, b) => {
        // Ordenar: pending primeiro, depois por data
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (a.status !== 'pending' && b.status === 'pending') return 1
        return 0
      })

    return NextResponse.json({ artists }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar artistas para moderação:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar artistas', details: error.message },
      { status: 500 }
    )
  }
}

// PATCH - Atualizar status de moderação
export async function PATCH(request: Request) {
  try {
    const adminClient = createAdminClient()
    const body = await request.json()
    const { submission_id, status, edited_bio, moderator_notes, edited_instagram, edited_facebook, edited_linkedin, edited_caption } = body

    if (!submission_id || !status) {
      return NextResponse.json(
        { error: 'submission_id e status são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe registro
    const { data: existing } = await adminClient
      .from('moderation_queue')
      .select('id')
      .eq('submission_id', submission_id)
      .single()

    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (edited_bio !== undefined) {
      updateData.edited_bio = edited_bio
    }

    if (moderator_notes !== undefined) {
      updateData.moderator_notes = moderator_notes
    }

    if (edited_instagram !== undefined) {
      updateData.edited_instagram = edited_instagram
    }

    if (edited_facebook !== undefined) {
      updateData.edited_facebook = edited_facebook
    }

    if (edited_linkedin !== undefined) {
      updateData.edited_linkedin = edited_linkedin
    }

    if (edited_caption !== undefined) {
      updateData.edited_caption = edited_caption
    }

    if (status === 'approved' || status === 'rejected') {
      // TODO: Pegar ID do admin logado
      // updateData.moderated_by = adminUserId
      updateData.moderated_at = new Date().toISOString()
    }

    let result
    if (existing) {
      // Atualizar
      const { data, error } = await adminClient
        .from('moderation_queue')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Criar novo
      const { data, error } = await adminClient
        .from('moderation_queue')
        .insert([{
          submission_id,
          ...updateData,
        }])
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ success: true, moderation: result }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao atualizar moderação:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar moderação', details: error.message },
      { status: 500 }
    )
  }
}

