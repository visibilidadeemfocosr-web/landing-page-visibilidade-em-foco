"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicForm } from "@/components/dynamic-form"
import { RegistrationFormLoader } from "@/components/registration-form-loader"
import Image from "next/image"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a4b8c] via-[#2d1b69] to-[#4a1942]">
      <div className="absolute inset-0 overflow-hidden">
        {/* Blob rosa superior esquerdo */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse" />
        
        {/* Blob amarelo superior direito */}
        <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Blob roxo central */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/25 to-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Blob verde inferior direito */}
        <div className="absolute bottom-20 right-40 w-[500px] h-[500px] bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        
        {/* Blob ciano inferior esquerdo */}
        <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-cyan-400/25 to-blue-500/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />

        {/* Grid pattern sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

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

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium uppercase tracking-wider border border-white/20">
              São Roque • 2025
            </span>
          </div>

          {/* Título principal */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight text-balance drop-shadow-2xl">
            VISIBILIDADE
            <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">EM FOCO</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed tracking-wide text-pretty font-medium drop-shadow-lg">
            Mapeamento de Artistas LGBTS da Cidade de São Roque
          </p>

          {/* Descrição */}
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTS em São Roque
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {mounted ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
                  >
                    PARTICIPE
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[100vw] w-[100vw] !max-h-[100vh] h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 rounded-none p-0 sm:max-w-[95vw] sm:w-[95vw] sm:max-h-[95vh] sm:h-[95vh] sm:!top-[50%] sm:!left-[50%] sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:rounded-lg sm:p-6 overflow-hidden flex flex-col">
                  <DialogHeader className="flex-shrink-0 pb-4 pt-4 px-4 sm:px-0 border-b bg-background z-10">
                    <DialogTitle className="text-xl sm:text-2xl font-bold">Cadastro de Artista</DialogTitle>
                    <DialogDescription className="text-sm sm:text-base leading-relaxed pt-2">
                      Preencha o formulário abaixo para fazer parte do mapeamento Visibilidade em Foco. Seus dados serão tratados com total segurança e privacidade.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-4 sm:px-0 mt-4 pb-12 sm:pb-4 pb-safe">
                    <RegistrationFormLoader />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full shadow-2xl hover:shadow-primary/50 transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
                disabled
              >
                PARTICIPE
              </Button>
            )}

            <Button 
              size="lg" 
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1a4b8c] px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
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
