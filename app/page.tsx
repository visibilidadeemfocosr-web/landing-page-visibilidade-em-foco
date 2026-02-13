import { Hero } from '@/components/new-design/Hero'
import { About } from '@/components/new-design/About'
import { Importance } from '@/components/new-design/Importance'
import { Impact } from '@/components/new-design/Impact'
import { CTA } from '@/components/new-design/CTA'
import { Footer } from '@/components/new-design/Footer'
import { SurveyEndedThankYouModal } from '@/components/new-design/SurveyEndedThankYouModal'

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <SurveyEndedThankYouModal />
      <Hero />
      <About />
      <Importance />
      <Impact />
      <CTA />
      <Footer />
    </div>
  )
}
