import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { ArtistsGrid } from '@/components/artists-grid'

type PublicArtistStatus = 'pending' | 'approved' | 'rejected' | 'published'

interface PublicArtist {
  id: string
  name: string
  bio: string
  photo: string | null
  main_artistic_language: string
  other_artistic_languages: string
  instagram: string
  facebook: string
  linkedin: string
  email: string | null
  status: PublicArtistStatus
  created_at: string | null
}

async function getPublicArtists(): Promise<PublicArtist[]> {
  const adminClient = createAdminClient()

  // Buscar dados de moderação (apenas aprovados/publicados)
  const { data: moderationStatuses, error: moderationError } = await adminClient
    .from('moderation_queue')
    .select(
      'submission_id, status, edited_bio, moderator_notes, edited_instagram, edited_facebook, edited_linkedin, edited_caption'
    )
    .in('status', ['approved', 'published'] as PublicArtistStatus[])

  if (moderationError) {
    console.error('Erro ao buscar status de moderação para página pública:', moderationError)
    return []
  }

  if (!moderationStatuses || moderationStatuses.length === 0) {
    return []
  }

  const submissionIds = moderationStatuses.map((m) => m.submission_id)

  // Buscar perguntas ativas (para identificar campos por texto)
  const { data: allQuestions, error: questionsError } = await adminClient
    .from('questions')
    .select('id, text, field_type, section')
    .eq('active', true)

  if (questionsError || !allQuestions) {
    console.error('Erro ao buscar perguntas para página pública de artistas:', questionsError)
    return []
  }

  // Buscar respostas de todas as submissões relevantes
  const { data: allAnswers, error: allAnswersError } = await adminClient
    .from('answers')
    .select('id, question_id, submission_id, value, file_url')
    .in('submission_id', submissionIds)

  if (allAnswersError || !allAnswers) {
    console.error('Erro ao buscar respostas para artistas públicos:', allAnswersError)
    return []
  }

  // Buscar dados das submissões (principalmente foto recortada e data)
  const { data: submissions, error: submissionsError } = await adminClient
    .from('submissions')
    .select('id, photo_crop, cropped_photo_url, created_at')
    .in('id', submissionIds)

  if (submissionsError || !submissions) {
    console.error('Erro ao buscar submissions para artistas públicos:', submissionsError)
    return []
  }

  const artistsMap = new Map<string, PublicArtist>()

  submissionIds.forEach((submissionId) => {
    const submissionAnswers = allAnswers.filter((a) => a.submission_id === submissionId)
    const moderation = moderationStatuses.find((m) => m.submission_id === submissionId)
    const submission = submissions.find((s) => s.id === submissionId)

    if (!moderation) return

    const findAnswer = (questionText: string) => {
      const question = allQuestions.find((q) =>
        q.text.toLowerCase().includes(questionText.toLowerCase())
      )
      if (!question) return null
      return submissionAnswers.find((a) => a.question_id === question.id) || null
    }

    const nameAnswer =
      findAnswer('gostaria de ser chamado') || findAnswer('nome artístico') || findAnswer('nome')

    // Alguns artistas podem ter colocado apenas iniciais nesse campo.
    // Tentar buscar um campo de "nome completo" para usar na vitrine pública.
    const fullNameAnswer =
      findAnswer('nome completo') ||
      findAnswer('nome civil') ||
      findAnswer('nome de registro') ||
      findAnswer('nome legal')

    const bioAnswer =
      findAnswer('compartilhar um pouco da sua trajetória') ||
      findAnswer('trajetória como artista') ||
      findAnswer('biografia') ||
      findAnswer('sobre o seu trabalho')

    const photoAnswer =
      findAnswer('foto') || submissionAnswers.find((a) => a.file_url || a.value?.includes('storage'))

    const mainLanguageAnswer = findAnswer('linguagem artística principal')
    const otherLanguagesAnswer = findAnswer('outras linguagens')
    const emailAnswer = findAnswer('e-mail') || findAnswer('email')

    // Redes sociais: usar campos editados se existirem; caso contrário, extrair da resposta de social_media
    const socialMediaQuestion = allQuestions.find((q) => q.field_type === 'social_media')
    const socialMediaAnswer = socialMediaQuestion
      ? submissionAnswers.find((a) => a.question_id === socialMediaQuestion.id)
      : null

    let instagram = moderation.edited_instagram || ''
    let facebook = moderation.edited_facebook || ''
    let linkedin = moderation.edited_linkedin || ''

    if (!instagram && !facebook && !linkedin && socialMediaAnswer?.value) {
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

    // Normalizar Instagram para sempre guardar só o @/handle (sem prefixos)
    if (instagram) {
      instagram = instagram
        .replace(/instagram\.com\//i, '')
        .replace('https://', '')
        .replace('http://', '')
        .replace('www.', '')
        .replace('instagram.com/', '')
        .replace('@', '')
        .trim()
    }

    const status: PublicArtistStatus = moderation.status as PublicArtistStatus

    if (status !== 'approved' && status !== 'published') {
      return
    }

    // Nome que aparece no card público
    // Preferência: nome completo -> "como gostaria de ser chamado"
    // Só cai para o @ do Instagram se realmente não houver nenhum nome
    let displayName =
      (fullNameAnswer?.value && fullNameAnswer.value.trim()) ||
      (nameAnswer?.value && nameAnswer.value.trim()) ||
      ''

    if (!displayName && instagram) {
      displayName = instagram
    }

    if (!displayName) {
      displayName = 'Artista em foco'
    }

    artistsMap.set(submissionId, {
      id: submissionId,
      name: displayName,
      bio: moderation.edited_bio || bioAnswer?.value || '',
      photo: submission?.cropped_photo_url || photoAnswer?.file_url || photoAnswer?.value || null,
      main_artistic_language: mainLanguageAnswer?.value || '',
      other_artistic_languages: otherLanguagesAnswer?.value || '',
      instagram,
      facebook,
      linkedin,
      email: emailAnswer?.value || null,
      status,
      created_at: submission?.created_at || null,
    })
  })

  const artists = Array.from(artistsMap.values()).sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })

  return artists
}

export default async function ArtistsInFocusPage() {
  const artists = await getPublicArtists()

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden bg-black text-white py-16 sm:py-20">
        {/* Shapes de fundo, seguindo identidade das outras seções */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-yellow-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 -top-10 h-64 w-64 rounded-full bg-pink-500/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-4rem] left-1/3 h-40 w-40 rounded-full bg-purple-600/35 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-pink-300 mb-3">
            Artistas em Foco
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
            Rede de artistas LGBTQIAPN+ mapeados em São Roque
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            Esta página apresenta artistas que participaram do mapeamento Visibilidade em Foco e
            tiveram seus perfis aprovados na curadoria. É um espaço vivo de visibilidade, memória e
            celebração das artes LGBTQIAPN+ da cidade.
          </p>
        </div>
      </section>

      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Elementos geométricos inspirados na identidade visual da home (somente no corpo) */}
        {/* Círculo contornado amarelo no canto direito */}
        <div className="pointer-events-none absolute -right-8 top-24 h-40 w-40 rounded-full border-[8px] border-yellow-400/80" />
        {/* Novo círculo azul no canto esquerdo */}
        <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full border-[6px] border-sky-400/80" />
        {/* Losango roxo no canto esquerdo, mais ao rodapé */}
        <div
          className="pointer-events-none absolute -left-10 bottom-10 h-24 w-24 bg-purple-500/90"
          style={{ transform: 'rotate(45deg)' }}
        />
        {/* Pequeno círculo rosa atrás dos cards, no canto inferior direito */}
        <div className="pointer-events-none absolute right-[-3rem] bottom-6 h-32 w-32 rounded-full bg-pink-400/25 blur-2xl" />
        {/* Retângulo azul vertical recortado na borda esquerda */}
        <div className="pointer-events-none absolute -left-12 top-1/3 h-48 w-12 bg-gradient-to-b from-blue-500 to-indigo-600" />
        {/* Quadrado magenta em diagonal no topo central */}
        <div
          className="pointer-events-none absolute left-1/2 top-6 h-10 w-10 bg-fuchsia-500/80"
          style={{ transform: 'translateX(-50%) rotate(45deg)' }}
        />
        {/* Pequenos pontos de “estrelas” no fundo direito */}
        <div className="pointer-events-none absolute inset-y-24 right-0 w-12 bg-gradient-to-b from-transparent via-white/10 to-transparent opacity-40 [mask-image:radial-gradient(circle_at_center,white,transparent)]" />
        {/* Losango menor no rodapé direito, próximo ao botão */}
        <div
          className="pointer-events-none absolute right-6 bottom-4 h-8 w-8 bg-purple-500/85"
          style={{ transform: 'rotate(45deg)' }}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-gray-900 px-5 py-2 text-xs font-medium text-gray-900 hover:bg-gray-900 hover:text-white transition-colors bg-transparent"
            >
              Voltar para o site
            </Link>
          </div>

          <ArtistsGrid artists={artists} />
        </div>
      </section>
    </main>
  )
}

