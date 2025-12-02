'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, MapPin, Heart, Sparkles, Users, Eye } from 'lucide-react'
import Image from 'next/image'

export default function PreviewV2Client() {
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
      {/* Hero Section - Com gradiente TERRACOTA e VERDE */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#2d4a3e] via-[#4a3d2d] to-[#5a2d2d]">
        {/* Blobs decorativos com TERRACOTA e VERDE */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob TERRACOTA superior esquerdo */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#D4756F]/30 to-[#B85D52]/30 rounded-full blur-3xl animate-pulse" />
          
          {/* Blob VERDE superior direito */}
          <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-[#6B9B7C]/25 to-[#4A7C59]/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          {/* Blob TERRACOTA/VERDE central */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-[#8B7355]/25 to-[#6B9B7C]/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Blob VERDE inferior direito */}
          <div className="absolute bottom-20 right-40 w-[500px] h-[500px] bg-gradient-to-br from-[#5A8A6A]/20 to-[#4A7C59]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Blob TERRACOTA inferior esquerdo */}
          <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-[#C4654F]/25 to-[#A8564A]/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Grid pattern sutil */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
          <div className="w-32 h-32 md:w-40 md:h-40">
            <Image 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_Tela_2025-11-14_a%CC%80s_20.28.13-removebg-preview-ZHLqMcqvj2fR23VIPIBhdOyvkeAAcx.png"
              alt="Visibilidade em Foco"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium uppercase tracking-wider border border-white/20">
                São Roque • 2025/2026
              </span>
            </div>

            {/* Título principal */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight text-balance drop-shadow-2xl font-heading">
              VISIBILIDADE
              <br />
              <span className="text-[#D4756F] drop-shadow-[0_0_30px_rgba(212,117,111,0.6)]">EM FOCO</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide text-pretty font-medium drop-shadow-lg">
              Mapa Vivo da Arte LGBT+ de São Roque
            </p>

            {/* Descrição com slogan */}
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Conectando talentos, memórias e expressões da nossa cidade.
              <br/>
              <span className="text-[#6B9B7C] font-semibold italic">Porque visibilidade também é cultura.</span>
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg"
                className="bg-[#D4756F] hover:bg-[#B85D52] text-white px-12 py-6 text-lg font-semibold rounded-full shadow-2xl hover:shadow-[#D4756F]/50 transition-all duration-300 active:scale-95"
              >
                Conheça as/os artistas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-12 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
              >
                Fazer parte do mapa
              </Button>
            </div>

            {/* Frase de impacto adicional */}
            <div className="pt-12">
              <p className="text-white/70 text-sm italic max-w-2xl mx-auto">
                "Enxergar é valorizar. Mapear é reconhecer."
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Artistas', value: '50+', color: 'text-[#D4756F]' },
              { icon: Sparkles, label: 'Linguagens', value: '15+', color: 'text-[#6B9B7C]' },
              { icon: Heart, label: 'Histórias', value: '∞', color: 'text-[#D4756F]' },
              { icon: MapPin, label: 'Uma Cidade', value: 'São Roque', color: 'text-[#6B9B7C]' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center space-y-2">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto`} />
                <div className="text-3xl font-bold text-[#1A1A1A] font-heading">{stat.value}</div>
                <div className="text-sm text-[#6F6F6F]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      <section id="sobre" className="py-20 px-6 bg-gradient-to-br from-[#6B9B7C]/5 to-[#D4756F]/5">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-6 mb-16">
            <span className="text-[#6B9B7C] text-sm font-semibold tracking-wider uppercase">
              Sobre o Projeto
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] font-heading">
              Um mapa feito de pessoas,<br/>arte e orgulho
            </h2>
          </div>

          <Card className="p-8 md:p-12 bg-white border-none shadow-lg">
            <div className="space-y-6 text-lg text-[#6F6F6F] leading-relaxed">
              <p>
                O <strong className="text-[#1A1A1A]">Visibilidade em Foco</strong> é um projeto de mapeamento cultural que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIA+ em São Roque.
              </p>
              <p>
                Através deste mapa vivo, reconhecemos que <strong className="text-[#6B9B7C]">a diversidade sempre esteve aqui</strong>. Este projeto só revela o que já existe: talentos, histórias e expressões que merecem ser vistas, ouvidas e valorizadas.
              </p>
              <div className="flex items-start gap-4 pt-4 border-t border-[#6F6F6F]/10">
                <div className="flex-shrink-0 w-1 h-16 bg-gradient-to-b from-[#D4756F] to-[#6B9B7C] rounded-full" />
                <p className="text-[#1A1A1A] font-semibold italic">
                  "Reconhecer o artista LGBTQIA+ é reconhecer a própria cidade."
                </p>
              </div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] font-heading">
              Visibilidade é vida.<br/>Arte é resistência.
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
                <div className="aspect-square bg-gradient-to-br from-[#6B9B7C]/10 to-[#D4756F]/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-24 h-24 text-[#6B9B7C]/30" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-[#6B9B7C] to-[#D4756F] transition-opacity duration-300 ${hoveredCard === idx ? 'opacity-90' : 'opacity-0'}`}>
                    <div className="h-full flex items-center justify-center p-6">
                      <p className="text-white text-center">
                        {artist.bio}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#6B9B7C]/10 to-[#D4756F]/10 text-[#6B9B7C] text-xs font-semibold rounded-full">
                    {artist.category}
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] font-heading">
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
              className="border-[#6B9B7C] text-[#6B9B7C] hover:bg-[#6B9B7C] hover:text-white"
            >
              Ver todos os artistas
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Frase de Impacto */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#6B9B7C] via-[#8B7355] to-[#D4756F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <blockquote className="text-3xl md:text-5xl font-bold text-white leading-tight font-heading">
            "A arte LGBT+ conta a história<br/>que muitas vezes não é contada."
          </blockquote>
          <p className="mt-8 text-white/80 text-lg">
            Mapear para existir. Existir para transformar São Roque.
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-[#F8F8F8]">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 bg-white border-none shadow-lg text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] font-heading">
              Faça parte deste mapa
            </h2>
            <p className="text-lg text-[#6F6F6F] max-w-2xl mx-auto">
              Se você é artista LGBTQIA+ de São Roque, participe do mapeamento. 
              Pesquisa aberta de <strong className="text-[#D4756F]">08/12/2025 até 08/02/2026</strong>.
            </p>
            <div className="pt-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-[#6B9B7C] to-[#D4756F] hover:from-[#5A8A6A] hover:to-[#B85D52] text-white px-12 py-6 text-lg font-semibold rounded-full"
              >
                Preencher cadastro
                <ArrowRight className="ml-2 w-5 h-5" />
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
              <div className="w-8 h-8 bg-gradient-to-br from-[#6B9B7C] to-[#D4756F] rounded-lg flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold font-heading">Visibilidade em Foco</span>
            </div>
            <div className="text-center">
              <p className="text-[#6F6F6F] text-sm">
                © 2025 • São Roque, SP
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[#6B9B7C] text-sm italic">
                Visibilidade é cuidado.<br/>Arte é pertencimento.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

