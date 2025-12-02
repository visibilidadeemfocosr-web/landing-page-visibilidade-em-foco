'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, MapPin, Heart, Sparkles, Users, Eye } from 'lucide-react'
import Image from 'next/image'

export default function PreviewClient() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const mockArtists = [
    {
      name: 'Maria Silva',
      category: 'Fotografia',
      image: '/placeholder-user.jpg',
      bio: 'Capturando histórias através das lentes, focando em retratos da diversidade e cotidiano LGBTQIA+.'
    },
    {
      name: 'João Santos',
      category: 'Arte Drag',
      image: '/placeholder-user.jpg',
      bio: 'Transformista e performer que transforma palcos em manifestos de arte e resistência.'
    },
    {
      name: 'Ana Costa',
      category: 'Ilustração',
      image: '/placeholder-user.jpg',
      bio: 'Desenhando mundos coloridos que celebram a identidade e a expressão autêntica.'
    }
  ]

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header Minimalista */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#6F6F6F]/10 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4756F] to-[#B85D52] rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <span className="text-[#1A1A1A] font-bold text-lg">Visibilidade em Foco</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#sobre" className="text-[#6F6F6F] hover:text-[#D4756F] transition-colors">Sobre</a>
            <a href="#artistas" className="text-[#6F6F6F] hover:text-[#D4756F] transition-colors">Artistas</a>
            <a href="#mapa" className="text-[#6F6F6F] hover:text-[#D4756F] transition-colors">Mapa</a>
            <Button className="bg-[#D4756F] hover:bg-[#B85D52] text-white">
              Participar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Impactante */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-[#D4756F] text-sm font-semibold tracking-wider uppercase">
                  São Roque • 2025/2026
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-[#1A1A1A] leading-tight">
                Mapa Vivo da Arte LGBT+ de São Roque
              </h1>
              
              <p className="text-xl text-[#6F6F6F] leading-relaxed">
                Conectando talentos, memórias e expressões da nossa cidade.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-[#D4756F] hover:bg-[#B85D52] text-white group"
                >
                  Conheça as/os artistas
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-[#D4756F] text-[#D4756F] hover:bg-[#D4756F] hover:text-white"
                >
                  Fazer parte do mapa
                </Button>
              </div>

              <div className="pt-8 border-t border-[#6F6F6F]/10">
                <p className="text-[#D4756F] font-medium italic">
                  "Porque visibilidade também é cultura."
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-[#D4756F]/10 to-[#B85D52]/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <Sparkles className="w-16 h-16 text-[#D4756F] mx-auto" />
                    <p className="text-2xl font-semibold text-[#1A1A1A]">
                      Visibilidade é vida.<br/>
                      Arte é resistência.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#D4756F]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#B85D52]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Artistas', value: '50+' },
              { icon: Sparkles, label: 'Linguagens', value: '15+' },
              { icon: Heart, label: 'Histórias', value: '∞' },
              { icon: MapPin, label: 'Uma Cidade', value: 'São Roque' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <stat.icon className="w-8 h-8 text-[#D4756F] mx-auto" />
                <div className="text-3xl font-bold text-[#1A1A1A]">{stat.value}</div>
                <div className="text-sm text-[#6F6F6F]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section id="sobre" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6 mb-16">
            <span className="text-[#D4756F] text-sm font-semibold tracking-wider uppercase">
              Sobre o Projeto
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
              Enxergar é valorizar.<br/>Mapear é reconhecer.
            </h2>
          </div>

          <Card className="p-8 md:p-12 bg-white border-none shadow-lg">
            <div className="space-y-6 text-lg text-[#6F6F6F] leading-relaxed">
              <p>
                O <strong className="text-[#1A1A1A]">Visibilidade em Foco</strong> é um projeto de mapeamento cultural que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIA+ em São Roque.
              </p>
              <p>
                Através deste mapa vivo, reconhecemos que <strong className="text-[#D4756F]">a diversidade sempre esteve aqui</strong>. Este projeto só revela o que já existe: talentos, histórias e expressões que merecem ser vistas, ouvidas e valorizadas.
              </p>
              <p className="text-[#1A1A1A] font-semibold italic pt-4">
                "Reconhecer o artista LGBTQIA+ é reconhecer a própria cidade."
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Artistas em Destaque */}
      <section id="artistas" className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <span className="text-[#D4756F] text-sm font-semibold tracking-wider uppercase">
              Nossos Artistas
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">
              Um mapa feito de pessoas,<br/>arte e orgulho
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockArtists.map((artist, idx) => (
              <Card
                key={idx}
                className="group cursor-pointer border-none shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="aspect-square bg-gradient-to-br from-[#D4756F]/10 to-[#B85D52]/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-24 h-24 text-[#D4756F]/30" />
                  </div>
                  <div className={`absolute inset-0 bg-[#D4756F]/90 transition-opacity duration-300 ${hoveredCard === idx ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-full flex items-center justify-center p-6">
                      <p className="text-white text-center">
                        {artist.bio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="inline-block px-3 py-1 bg-[#D4756F]/10 text-[#D4756F] text-xs font-semibold rounded-full">
                    {artist.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A]">
                    {artist.name}
                  </h3>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="border-[#D4756F] text-[#D4756F] hover:bg-[#D4756F] hover:text-white"
            >
              Ver todos os artistas
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Frase de Impacto */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#D4756F] to-[#B85D52] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight">
            "A arte LGBT+ conta a história<br/>que muitas vezes não é contada."
          </blockquote>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 bg-white border-none shadow-lg text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">
              Faça parte deste mapa
            </h2>
            <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">
              Se você é artista LGBTQIA+ de São Roque, participe do mapeamento. 
              Pesquisa aberta de <strong className="text-[#D4756F]">08/12/2025 até 08/02/2026</strong>.
            </p>
            <div className="pt-4">
              <Button 
                size="lg"
                className="bg-[#D4756F] hover:bg-[#B85D52] text-white"
              >
                Preencher cadastro
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer Minimalista */}
      <footer className="py-12 px-6 bg-[#1A1A1A]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#D4756F] to-[#B85D52] rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold">Visibilidade em Foco</span>
            </div>
            <div className="text-center">
              <p className="text-[#6F6F6F] text-sm">
                © 2025 • São Roque, SP
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[#D4756F] text-sm italic">
                Mapear para existir.<br/>Existir para transformar.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

