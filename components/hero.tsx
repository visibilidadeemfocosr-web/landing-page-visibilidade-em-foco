"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicForm } from "@/components/dynamic-form"
import { RegistrationFormLoader } from "@/components/registration-form-loader"
import Image from "next/image"

interface HomeContent {
  logoPath?: string
  mainTitle?: string
  highlightedWord?: string
  subtitle?: string
  description?: string
  period?: string | null
  heroImage?: {
    url: string
    position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'custom'
    customPosition?: {
      top?: string
      left?: string
      right?: string
      bottom?: string
    }
    size: {
      width: string
      height: string
    }
    opacity: number
  }
}

interface HeroProps {
  content?: HomeContent
}

export function Hero({ content }: HeroProps) {
  const [mounted, setMounted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Valores padrão ou do banco
  const logoPath = content?.logoPath || '/logoN.png'
  const mainTitle = content?.mainTitle || 'Mapeamento de Artistas'
  const highlightedWord = content?.highlightedWord || 'LGBTQIAPN+'
  const subtitle = content?.subtitle || 'do município de São Roque'
  const description = content?.description || 'Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de'
  // Se content existe, usar period mesmo se for null. Só usar padrão se content não existir
  const period = content !== undefined ? content.period : '08/12/2025 até 08/02/2026'
  
  // Função para calcular posicionamento da imagem
  const getImagePosition = () => {
    if (!content?.heroImage) return {}
    
    const { position, customPosition } = content.heroImage
    
    // Se for posicionamento personalizado, usar customPosition
    if (position === 'custom' && customPosition) {
      return customPosition
    }
    
    const positions: Record<string, React.CSSProperties> = {
      'top-left': { top: 0, left: 0 },
      'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
      'top-right': { top: 0, right: 0 },
      'center-left': { top: '50%', left: 0, transform: 'translateY(-50%)' },
      'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      'center-right': { top: '50%', right: 0, transform: 'translateY(-50%)' },
      'bottom-left': { bottom: 0, left: 0 },
      'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
      'bottom-right': { bottom: 0, right: 0 },
    }
    
    return positions[position] || positions.center
  }

  // Debug
  if (typeof window !== 'undefined') {
    console.log('Hero - content:', content)
    console.log('Hero - period:', period, 'tipo:', typeof period)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-slate-50">
      <div className="absolute inset-0 overflow-hidden">
        {/* Blobs decorativos sutis sobre fundo branco */}
        <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
        
        <div className="absolute -top-10 right-10 sm:-top-20 sm:right-20 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-gradient-to-br from-pink-200/25 to-rose-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="absolute top-1/3 left-1/4 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-br from-purple-200/28 to-indigo-200/28 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 md:right-40 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        <div className="absolute -bottom-16 -left-10 sm:-bottom-32 sm:-left-20 w-[225px] h-[225px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] bg-gradient-to-br from-violet-200/25 to-purple-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Hero Image */}
        {content?.heroImage?.url && (
          <div
            className="absolute z-0"
            style={{
              ...getImagePosition(),
              width: content.heroImage.size.width,
              height: content.heroImage.size.height,
              opacity: content.heroImage.opacity / 100,
            }}
          >
            <img
              src={content.heroImage.url}
              alt="Hero background"
              className="w-full h-full object-cover"
              style={{
                width: content.heroImage.size.width,
                height: content.heroImage.size.height,
              }}
            />
          </div>
        )}

        {/* Grid pattern sutil para fundo claro */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-8 md:left-8 z-20">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 lg:w-40 lg:h-40">
          <Image 
            src={logoPath}
            alt="Visibilidade em Foco"
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-2xl"
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-[0.95] tracking-tight text-balance drop-shadow-sm font-heading px-2">
            {mainTitle}{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #E40303 0%, #FF8C00 20%, #FFED00 40%, #008026 60%, #24408E 80%, #732982 100%)'
              }}
            >
              {highlightedWord}
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed tracking-wide text-pretty font-bold font-heading px-2">
            {subtitle}
          </p>

          {/* Descrição */}
          <div 
            className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-heading prose prose-sm max-w-none [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p]:whitespace-pre-line px-2"
            dangerouslySetInnerHTML={{ 
              __html: (period !== null && period !== undefined && period.trim() !== '') 
                ? `${description} <span class="font-bold text-orange-500">${period}</span>` 
                : description 
            }}
          />

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 sm:pt-8 px-2">
            {mounted ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-6 sm:px-8 md:px-12 py-5 sm:py-6 text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation min-h-[48px] sm:min-h-[56px]"
                  >
                    PARTICIPE
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[100vw] w-[100vw] !max-h-[100vh] h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 rounded-none p-0 sm:max-w-[95vw] sm:w-[95vw] sm:max-h-[95vh] sm:h-[95vh] sm:!top-[50%] sm:!left-[50%] sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:rounded-lg sm:p-6 overflow-hidden flex flex-col bg-white">
                  <DialogHeader className="flex-shrink-0 pb-4 pt-4 px-4 sm:px-0 border-b bg-white z-10">
                    <DialogTitle className="text-xl sm:text-2xl font-bold">Cadastro de Artista</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base leading-relaxed pt-2">
                      Preencha o formulário abaixo para fazer parte do mapeamento Visibilidade em Foco. Seus dados serão tratados com total segurança e privacidade.
                    </DialogDescription>
                  </DialogHeader>
                  <div id="form-scroll-container" className="flex-1 overflow-y-auto px-4 sm:px-0 mt-4 pb-12 sm:pb-4 pb-safe">
                    <RegistrationFormLoader onSuccess={() => setDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto px-6 sm:px-8 md:px-12 py-5 sm:py-6 text-sm sm:text-base md:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation min-h-[48px] sm:min-h-[56px]"
                disabled
              >
                PARTICIPE
              </Button>
            )}

            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full sm:w-auto px-6 sm:px-8 md:px-12 py-5 sm:py-6 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-all duration-300 active:scale-95 touch-manipulation min-h-[48px] sm:min-h-[56px] shadow-lg bg-white"
              onClick={() => {
                document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              SAIBA MAIS
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  )
}
