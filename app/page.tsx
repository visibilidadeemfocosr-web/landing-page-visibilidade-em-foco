import { Hero } from '@/components/new-design/Hero'
import { About } from '@/components/new-design/About'
import { Importance } from '@/components/new-design/Importance'
import { Impact } from '@/components/new-design/Impact'
import { CTA } from '@/components/new-design/CTA'
import { Footer } from '@/components/new-design/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Hero />
      <About />
      <Importance />
      <Impact />
      <CTA />
      <Footer />
    </div>
  )
}
