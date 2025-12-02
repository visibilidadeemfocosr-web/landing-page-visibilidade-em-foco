"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DynamicForm } from "@/components/dynamic-form"
import { RegistrationFormLoader } from "@/components/registration-form-loader"
import Image from "next/image"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
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
            Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de <span className="font-bold text-orange-500">08/12/2025 até 08/02/2026</span>
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            {mounted ? (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
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
                  <div id="form-scroll-container" className="flex-1 overflow-y-auto px-4 sm:px-0 mt-4 pb-12 sm:pb-4 pb-safe">
                    <RegistrationFormLoader onSuccess={() => setDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px]"
                disabled
              >
                PARTICIPE
              </Button>
            )}

            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 sm:px-12 py-6 text-base sm:text-lg font-semibold rounded-full transition-all duration-300 active:scale-95 touch-manipulation min-h-[56px] shadow-lg bg-white"
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
