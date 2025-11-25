import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { ArtistsShowcase } from "@/components/artists-showcase"
import { Impact } from "@/components/impact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <ArtistsShowcase />
      <Impact />
      <Footer />
    </main>
  )
}
