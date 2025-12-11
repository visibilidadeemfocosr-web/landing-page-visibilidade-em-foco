'use client'

import { motion } from 'framer-motion'
import { AbstractShape1, StarBurstShape } from './CustomShapes'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RegistrationFormLoader } from '@/components/registration-form-loader'
import { X } from 'lucide-react'
import Image from 'next/image'
import { AudioDescriptionButton } from '@/components/accessibility/AudioDescriptionButton'

export function Hero() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [prefetchedQuestions, setPrefetchedQuestions] = useState<any[] | null>(null)

  useEffect(() => {
    setMounted(true)
    
    // Prefetch das perguntas em background para melhorar performance
    // Isso carrega as perguntas antes do usuário clicar no botão
    fetch('/api/questions')
      .then(res => res.json())
      .then(data => {
        setPrefetchedQuestions(data)
      })
      .catch(err => {
        console.warn('Erro ao fazer prefetch das perguntas:', err)
        // Não é crítico, o formulário vai carregar depois
      })
  }, [])

  return (
    <>
      <section className="relative min-h-screen bg-stone-50 overflow-hidden" id="hero-section">
        {/* Header/Nav */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                <Image 
                  src="/logoN.png"
                  alt="Logo do projeto Visibilidade em Foco - Mapeamento de artistas LGBTQIAPN+ do município de São Roque"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-2xl"
                  unoptimized
                />
                <div className="absolute -top-2 -right-8 w-6 h-6 bg-yellow-400 rounded-full" aria-hidden="true" />
                <div className="absolute -bottom-1 -left-4 w-8 h-8 bg-purple-600 rounded-full" aria-hidden="true" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:flex gap-8 text-sm tracking-wide"
            >
              <a href="#sobre" className="text-black hover:text-purple-600 transition-colors" aria-label="Ir para seção sobre o projeto">SOBRE</a>
              <a href="#impacto" className="text-black hover:text-purple-600 transition-colors" aria-label="Ir para seção de impacto">IMPACTO</a>
              <a href="#participar" className="text-black hover:text-purple-600 transition-colors" aria-label="Ir para seção de participação">PARTICIPAR</a>
            </motion.div>
          </div>
        </nav>

        {/* Formas geométricas de fundo */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 opacity-80 hidden sm:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            <StarBurstShape />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20 w-48 h-48 opacity-60 hidden md:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          >
            <AbstractShape1 />
          </motion.div>

          {/* Blocos de cor sólida */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-16 h-16 sm:w-24 sm:h-24 bg-pink-500 opacity-60 sm:opacity-100"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            aria-hidden="true"
          />
          
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full opacity-60 sm:opacity-100"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            aria-hidden="true"
          />

          <motion.div
            className="absolute top-1/2 left-4 sm:left-10 w-16 h-24 sm:w-20 sm:h-32 bg-orange-500 opacity-60 sm:opacity-100"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 100%, 0 75%)' }}
            aria-hidden="true"
          />
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              {/* Lado esquerdo - Texto */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="mb-6 sm:mb-8">
                  <div className="inline-block bg-purple-600 text-white px-4 sm:px-6 py-2 text-xs sm:text-sm tracking-wider mb-4 sm:mb-6">
                    1º MAPEAMENTO CULTURAL
                  </div>
                  
                  <h1 className="space-y-1 sm:space-y-2 mb-6 sm:mb-8">
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-black leading-none tracking-tight">
                      ARTISTAS
                    </div>
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-none tracking-tight relative inline-block">
                      <span className="text-black">LGB</span>
                      <span className="relative inline-block">
                        <span className="text-black">T</span>
                        <div className="absolute -top-2 -right-4 sm:-top-4 sm:-right-6 w-8 h-8 sm:w-12 sm:h-12 bg-yellow-400 -z-10" />
                      </span>
                      <span className="text-black">QIAPN+</span>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-700 tracking-tight">
                      de São Roque
                    </div>
                  </h1>

                  <div className="relative mb-6 sm:mb-8">
                    <div className="absolute -left-2 sm:-left-4 top-0 bottom-0 w-0.5 sm:w-1 bg-pink-500" />
                    <div className="pl-4 sm:pl-6 md:pl-8">
                      <p className="text-lg sm:text-xl md:text-2xl text-gray-800">
                        Reconhecer. Documentar. Celebrar.
                        <br />
                        <strong>Sua voz importa.</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {mounted ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={true}>
                      <DialogTrigger asChild>
                        <button 
                          className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden"
                          aria-label="Abrir formulário de participação no mapeamento de artistas LGBTQIAPN+"
                        >
                          <span className="relative z-10">PARTICIPAR AGORA</span>
                          <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" aria-hidden="true" />
                          <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" aria-hidden="true">
                            PARTICIPAR AGORA
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent 
                        className="!max-w-[100vw] w-[100vw] !max-h-[100vh] h-[100vh] !top-0 !left-0 !translate-x-0 !translate-y-0 rounded-none p-0 sm:max-w-[95vw] sm:w-[95vw] sm:max-h-[95vh] sm:h-[95vh] sm:!top-[50%] sm:!left-[50%] sm:!translate-x-[-50%] sm:!translate-y-[-50%] sm:rounded-lg sm:p-6 overflow-hidden flex flex-col bg-white !z-[60]"
                        showCloseButton={false}
                      >
                        {/* DialogTitle oculto para acessibilidade */}
                        <DialogTitle className="sr-only">Cadastro de Artista</DialogTitle>
                        
                        {/* Header com design igual ao FormModal */}
                        <div className="relative bg-black text-white p-8 md:p-10 flex-shrink-0">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full opacity-50" />
                          
                          <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
                              CADASTRO DE ARTISTA
                            </h2>
                            <p className="text-gray-300 max-w-3xl">
                              Preencha o formulário abaixo para fazer parte do mapeamento Visibilidade em Foco. 
                              Seus dados serão tratados com total segurança e privacidade.
                            </p>
                          </div>

                          <button
                            onClick={() => setDialogOpen(false)}
                            className="absolute top-8 right-8 z-20 text-white hover:text-gray-300 transition-colors"
                            aria-label="Fechar formulário de cadastro"
                          >
                            <X className="w-8 h-8" aria-hidden="true" />
                          </button>
                        </div>
                        
                        <div id="form-scroll-container" className="flex-1 overflow-y-auto p-8 md:p-10 lg:p-12 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
                          <RegistrationFormLoader 
                            onSuccess={() => setDialogOpen(false)} 
                            prefetchedQuestions={prefetchedQuestions || undefined}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <button 
                      className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden"
                    >
                      <span className="relative z-10">PARTICIPAR AGORA</span>
                      <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        PARTICIPAR AGORA
                      </span>
                    </button>
                  )}
                  
                  <button 
                    onClick={() => {
                      const sobreSection = document.getElementById('sobre')
                      if (sobreSection) {
                        sobreSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className="border-2 border-black text-black hover:bg-black hover:text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-base sm:text-lg tracking-wide transition-all duration-300 active:scale-95 w-full sm:w-auto"
                    aria-label="Rolar para a seção sobre o projeto"
                  >
                    SAIBA MAIS
                  </button>
                </motion.div>

                <div className="mt-6 sm:mt-8 bg-black text-white px-4 sm:px-6 py-3 sm:py-4 inline-block">
                  <p className="text-xs sm:text-sm tracking-wider">
                    <span className="text-yellow-400">12/12/2025</span> até <span className="text-yellow-400">12/02/2026</span>
                  </p>
                </div>
              </motion.div>

              {/* Lado direito - Arte abstrata customizada */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative h-[600px] hidden lg:block"
                aria-hidden="true"
              >
                {/* Composição artística exclusiva */}
                <div className="relative w-full h-full">
                  {/* Fundo grande com texto recortado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[280px] leading-none select-none"
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '2.5px black',
                        fontWeight: '900',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                        letterSpacing: '-0.02em',
                        textRendering: 'geometricPrecision',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        transform: 'translateZ(0)'
                      }}
                    >
                      SR
                    </div>
                  </div>

                  {/* Formas sobrepostas */}
                  <motion.div
                    className="absolute top-10 left-4 w-40 h-40 bg-purple-600"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                  />

                  <motion.div
                    className="absolute bottom-20 right-0 w-48 h-48 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <motion.div
                    className="absolute top-1/3 right-8 w-32 h-32 bg-orange-500"
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />

                  <motion.div
                    className="absolute bottom-10 left-4 w-24 h-64 bg-blue-600"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 80%)' }}
                  />

                  <motion.div
                    className="absolute top-4 right-16 w-20 h-20 bg-pink-500 rounded-full"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Elemento de scroll indicator */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 sm:gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-black rounded-full flex justify-center pt-1.5 sm:pt-2">
            <div className="w-0.5 h-1.5 sm:w-1 sm:h-2 bg-black rounded-full" />
          </div>
          <span className="text-[10px] sm:text-xs tracking-widest text-gray-600">SCROLL</span>
        </motion.div>

        {/* Botão de áudio descrição no canto inferior direito */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 right-4 sm:right-6 md:right-8 z-20">
          <AudioDescriptionButton
            text="Reconhecer. Documentar. Celebrar. Sua voz importa. Este é o primeiro mapeamento cultural de artistas LGBTQIAPN+ do município de São Roque. Um projeto de resistência, visibilidade e celebração das nossas existências."
            sectionId="hero-description"
            variant="icon-only"
          />
        </div>
      </section>
    </>
  )
}

