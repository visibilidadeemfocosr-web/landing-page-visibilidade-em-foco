"use client"

import React, { useState, useEffect } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RegistrationFormLoader } from "@/components/registration-form-loader"
import Image from "next/image"
import { AbstractShape1, StarBurstShape } from '@/components/new-design/CustomShapes'

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

interface HeroStyledProps {
  content?: HomeContent
}

export function HeroStyled({ content }: HeroStyledProps) {
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
  const period = content !== undefined ? content.period : '08/12/2025 até 08/02/2026'

  // Extrair título principal e palavra destacada
  const titleParts = mainTitle.split(highlightedWord)
  const beforeHighlight = titleParts[0].trim()
  const afterHighlight = titleParts[1]?.trim() || ''

  return (
    <>
      <section className="relative min-h-screen bg-stone-50 overflow-hidden">
        {/* Header/Nav */}
        <nav className="absolute top-0 left-0 right-0 z-50 p-8">
          <div className="max-w-7xl mx-auto flex justify-between items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                <Image 
                  src={logoPath}
                  alt="Visibilidade em Foco"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="hidden md:flex gap-8 text-sm tracking-wide"
            >
              <a href="#sobre" className="text-black hover:text-purple-600 transition-colors">SOBRE</a>
              <a href="#impacto" className="text-black hover:text-purple-600 transition-colors">IMPACTO</a>
              <a href="#participar" className="text-black hover:text-purple-600 transition-colors">PARTICIPAR</a>
            </motion.div>
          </div>
        </nav>

        {/* Formas geométricas de fundo */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-10 w-32 h-32 opacity-80"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <StarBurstShape />
          </motion.div>

          <motion.div
            className="absolute bottom-40 left-20 w-48 h-48 opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <AbstractShape1 />
          </motion.div>

          {/* Blocos de cor sólida */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-24 h-24 bg-pink-500"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          
          <motion.div
            className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-blue-600 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          <motion.div
            className="absolute top-1/2 left-10 w-20 h-32 bg-orange-500"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ clipPath: 'polygon(0 0, 100% 25%, 100% 100%, 0 75%)' }}
          />
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-8 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Lado esquerdo - Texto */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="mb-8">
                  <div className="inline-block bg-purple-600 text-white px-6 py-2 text-sm tracking-wider mb-6">
                    1º MAPEAMENTO CULTURAL
                  </div>
                  
                  <h1 className="space-y-2 mb-8">
                    <div className="text-6xl md:text-7xl lg:text-8xl text-black leading-none tracking-tight">
                      {beforeHighlight || 'ARTISTAS'}
                    </div>
                    <div className="text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight relative inline-block">
                      <span className="text-black">{highlightedWord}</span>
                      <div className="absolute -top-4 -right-6 w-12 h-12 bg-yellow-400 -z-10" />
                    </div>
                    <div className="text-4xl md:text-5xl text-gray-700 tracking-tight">
                      {subtitle}
                    </div>
                  </h1>

                  <div className="relative mb-8">
                    <div className="absolute -left-4 top-0 bottom-0 w-1 bg-pink-500" />
                    <div 
                      className="text-xl md:text-2xl text-gray-800 pl-8"
                      dangerouslySetInnerHTML={{ 
                        __html: (period !== null && period !== undefined && period.trim() !== '') 
                          ? `${description} <span class="font-bold text-orange-500">${period}</span>` 
                          : description 
                      }}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {mounted ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <button 
                          className="group bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 relative overflow-hidden"
                        >
                          <span className="relative z-10">PARTICIPAR AGORA</span>
                          <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                          <span className="absolute inset-0 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            PARTICIPAR AGORA
                          </span>
                        </button>
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
                    <button 
                      className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-full transition-all duration-300 shadow-xl opacity-50 cursor-not-allowed"
                      disabled
                    >
                      PARTICIPAR AGORA
                    </button>
                  )}
                  
                  <button 
                    className="border-2 border-black text-black hover:bg-black hover:text-white px-10 py-4 text-lg tracking-wide transition-all duration-300"
                    onClick={() => {
                      document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    SAIBA MAIS
                  </button>
                </motion.div>

                {period && (
                  <div className="mt-8 bg-black text-white px-6 py-4 inline-block">
                    <p className="text-sm tracking-wider">
                      <span className="text-yellow-400">{period}</span>
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Lado direito - Arte abstrata customizada */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative h-[600px] hidden lg:block"
              >
                {/* Composição artística exclusiva */}
                <div className="relative w-full h-full">
                  {/* Fundo grande com texto recortado */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-[280px] tracking-tighter leading-none select-none"
                      style={{
                        color: 'transparent',
                        WebkitTextStroke: '2px black',
                        fontWeight: '900'
                      }}
                    >
                      SR
                    </div>
                  </div>

                  {/* Formas sobrepostas */}
                  <motion.div
                    className="absolute top-20 left-10 w-40 h-40 bg-purple-600"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                  />

                  <motion.div
                    className="absolute bottom-32 right-20 w-48 h-48 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />

                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500"
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />

                  <motion.div
                    className="absolute bottom-20 left-16 w-24 h-64 bg-blue-600"
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 100%, 0 80%)' }}
                  />

                  <motion.div
                    className="absolute top-10 right-32 w-20 h-20 bg-pink-500 rounded-full"
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
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-6 h-10 border-2 border-black rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-black rounded-full" />
          </div>
          <span className="text-xs tracking-widest text-gray-600">SCROLL</span>
        </motion.div>
      </section>
    </>
  )
}
