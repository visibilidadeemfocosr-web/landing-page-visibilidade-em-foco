import { Hero } from './components/Hero';
import { About } from './components/About';
import { Importance } from './components/Importance';
import { Impact } from './components/Impact';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Hero />
      <About />
      <Importance />
      <Impact />
      <CTA />
      <Footer />
    </div>
  );
}
