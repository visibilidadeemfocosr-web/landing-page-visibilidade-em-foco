'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function PreviewV3Client() {

  const artistTypes = [
    {
      title: "Artes Visuais",
      description: "Pintores, ilustradores, fotógrafos e artistas plásticos",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/visual-artist-painting.jpg"
    },
    {
      title: "Música",
      description: "Cantores, compositores, músicos e produtores musicais",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/musician-performing.jpg"
    },
    {
      title: "Teatro",
      description: "Atores, diretores, dramaturgos e performers",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/theater-performer.jpg"
    },
    {
      title: "Dança",
      description: "Bailarinos, coreógrafos e performers corporais",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/hiphop-dancer.jpg"
    },
    {
      title: "Audiovisual",
      description: "Cineastas, videomakers, fotógrafos e produtores audiovisuais",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/audiovisual-filmmaker.jpg"
    },
    {
      title: "Arte Circense",
      description: "Artistas circenses, malabaristas, acrobatas, palhaços, contorcionistas e performers aéreos",
      color: "from-slate-200/40 to-gray-200/30",
      imageUrl: "/circus-artist.jpg"
    }
  ]

  const impacts = [
    {
      number: "01",
      title: "Reconhecimento",
      description: "Valida a existência e o trabalho de artistas LGBTS, criando espaço de representatividade e pertencimento."
    },
    {
      number: "02",
      title: "Memória",
      description: "Documenta trajetórias e produções artísticas, construindo um acervo histórico para a comunidade."
    },
    {
      number: "03",
      title: "Conexão",
      description: "Fortalece redes de apoio mútuo, colaboração e troca entre artistas da região."
    },
    {
      number: "04",
      title: "Transformação",
      description: "Promove mudanças culturais e sociais através da arte e da visibilidade LGBTS."
    }
  ]

  return (
    <main className="min-h-screen">
      {/* HERO SECTION - Com gradiente BRANCO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-slate-50">
        <div className="absolute inset-0 overflow-hidden">
          {/* Blobs decorativos sutis sobre fundo branco */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          
          <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/25 to-rose-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/28 to-indigo-200/28 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          <div className="absolute bottom-20 right-40 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-violet-200/25 to-purple-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Grid pattern sutil para fundo claro */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        {/* Logo */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
          <div className="w-32 h-32 md:w-40 md:h-40">
            <Image 
              src="/logoN.png?v=2"
              alt="Visibilidade em Foco"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-2xl"
              unoptimized
            />
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Título principal */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.95] tracking-tight text-balance drop-shadow-sm font-heading">
              Mapeamento de Artistas{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E40303 0%, #FF8C00 20%, #FFED00 40%, #008026 60%, #24408E 80%, #732982 100%)'
                }}
              >
                LGBTQIAPN+
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed tracking-wide text-pretty font-bold font-heading">
              do município de São Roque
            </p>

            {/* Descrição */}
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-heading">
              Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque!<br/>Participe do mapeamento, pesquisa aberta de <span className="font-bold text-orange-500">08/12/2025 até 08/02/2026</span>
            </p>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                PARTICIPE
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px] shadow-lg bg-white"
                onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Saiba Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O PROJETO */}
      <section id="sobre" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Tag de seção */}
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Sobre o Projeto
              </span>
            </div>

            {/* Título */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 text-balance leading-tight font-heading">
              Por que mapear artistas LGBTQIAPN+?
            </h2>

            {/* Conteúdo */}
            <div className="space-y-6 text-lg leading-relaxed text-gray-600">
              <p className="text-pretty">
                O projeto <strong className="text-gray-900">Visibilidade em Foco</strong> nasce da urgência de reconhecer, documentar e celebrar a existência e a produção artística da comunidade LGBTQIAPN+ no interior de São Paulo.
              </p>

              <p className="text-pretty">
                Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda, onde a falta de espaços de representação e o isolamento cultural dificultam o reconhecimento e a circulação de suas produções.
              </p>

              <p className="text-pretty">
                Este mapeamento não é apenas um levantamento de dados — <strong className="text-gray-900">é um ato político de resistência e afirmação</strong>. Ao registrar essas existências, criamos um arquivo vivo que valida identidades, fortalece redes de apoio e constrói um legado cultural para futuras gerações.
              </p>

              <div className="pt-8 border-t border-gray-200 mt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">Objetivos do projeto</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Dar visibilidade à produção artística LGBTQIAPN+ em São Roque</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Criar um arquivo histórico e cultural da comunidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Fortalecer redes de apoio e colaboração entre artistas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Promover políticas públicas de cultura e diversidade</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>Combater o apagamento e a marginalização cultural</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO SOCIAL */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                Impacto Social
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 text-balance font-heading">
                A importância de existir e resistir
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty">
                Mais do que um levantamento de dados, este projeto é sobre <strong className="text-gray-900">dar voz</strong>, <strong className="text-gray-900">criar memória</strong> e <strong className="text-gray-900">transformar realidades</strong>.
              </p>
            </div>

            {/* Grid de impactos */}
            <div className="grid md:grid-cols-2 gap-8">
              {impacts.map((impact) => (
                <div
                  key={impact.number}
                  className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start gap-6">
                    <span className="text-5xl font-bold text-orange-500/20 font-heading">
                      {impact.number}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 font-heading">
                        {impact.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {impact.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 italic text-balance leading-tight">
                "É nossa voz, nossa expressão e nosso talento que nos colocam no mundo — e a arte é parte essencial disso."
              </blockquote>
              <p className="mt-4 text-sm text-gray-600">
                — Equipe Visibilidade em Foco
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 text-gray-800 py-16 relative overflow-hidden border-t border-gray-200">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-100/25 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Título e descrição */}
            <div className="text-center space-y-6 mb-12">
              <h3 className="text-3xl font-bold text-orange-500 font-heading">
                Visibilidade em Foco
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque
              </p>
            </div>

            {/* Seção de Apoio/Realização */}
            <div className="py-8 border-y border-gray-300">
              <p className="text-center text-sm font-semibold text-gray-700 mb-6 uppercase tracking-wider">
                Apoio e Realização
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                <div className="h-16 md:h-20 flex items-center">
                  <Image 
                    src="/prefeitura.png?v=1"
                    alt="Prefeitura de São Roque"
                    width={180}
                    height={80}
                    className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>
                <div className="h-20 md:h-24 flex items-center">
                  <Image 
                    src="/pnab.png?v=1"
                    alt="PNAB"
                    width={220}
                    height={96}
                    className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            
            {/* Copyright e links */}
            <div className="pt-8 text-center space-y-3">
              <p className="text-sm text-gray-600">
                © 2025 Visibilidade em Foco. Todos os direitos reservados.
              </p>
              <p className="text-sm text-gray-500">
                <a 
                  href="/admin" 
                  className="hover:text-gray-700 transition-colors underline underline-offset-2"
                >
                  Área Administrativa
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

