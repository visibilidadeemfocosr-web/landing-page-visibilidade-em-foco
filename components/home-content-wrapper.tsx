'use client'

import { useHomeContent } from '@/lib/hooks/use-home-content'
import { Hero } from './hero'
import { About } from './about'
import { Impact } from './impact'
import { Footer } from './footer'

export function HomeContentWrapper() {
  const { content, loading } = useHomeContent()

  return (
    <main className="min-h-screen">
      <Hero content={content} />
      <About content={content} />
      <Impact content={content} />
      <Footer content={content?.footer} />
    </main>
  )
}

