'use client'

import { useHomeContent } from '@/lib/hooks/use-home-content'
import { HeroStyled } from './HeroStyled'
import { About } from './about'
import { Impact } from './impact'
import { Footer } from './footer'

interface HomeContentWrapperStyledProps {
  initialContent?: any
}

export function HomeContentWrapperStyled({ initialContent }: HomeContentWrapperStyledProps) {
  const { content, loading } = useHomeContent(initialContent)

  // Se ainda está carregando e não tem conteúdo inicial, mostrar loading mínimo
  if (loading && !initialContent) {
    return (
      <main className="min-h-screen bg-stone-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <HeroStyled content={content} />
      <About content={content} />
      <Impact content={content} />
      <Footer content={content?.footer} />
    </main>
  )
}
