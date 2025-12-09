'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { EyeIllustration, RecognitionIcon, HeartHandIllustration } from './CustomShapes'
import { AudioDescriptionButton } from '@/components/accessibility/AudioDescriptionButton'

export function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="sobre" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      {/* Elemento decorativo lateral */}
      <div className="absolute left-0 top-1/4 w-1 sm:w-2 h-32 sm:h-48 md:h-64 bg-yellow-400 opacity-60 sm:opacity-100" aria-hidden="true" />
      <div className="absolute right-0 top-1/2 w-1.5 sm:w-2 md:w-3 h-24 sm:h-36 md:h-48 bg-purple-600 opacity-60 sm:opacity-100" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
            <div className="hidden md:block w-32 h-32 bg-pink-500 flex-shrink-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }} aria-hidden="true" />
            <div className="flex-1">
              <div className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">01 / SOBRE O PROJETO</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight mb-4 sm:mb-6">
                <div className="text-black">O QUE É O</div>
                <div className="relative inline-block">
                  <span className="relative inline-block text-black" style={{ zIndex: 2 }}>
                    VISIBILIDADE
                  </span>
                  <span 
                    className="absolute bottom-0 left-0 right-0 bg-orange-500 block" 
                    style={{ 
                      height: '12px',
                      transform: 'translateY(4px)',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }} 
                  />
                </div>
                <div className="text-black">EM FOCO</div>
              </h2>
            </div>
          </div>
        </motion.div>

        {/* Grid de ícones conceituais */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-16 md:mb-20"
        >
          <div className="text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 relative" aria-hidden="true">
              <div className="absolute inset-0 bg-orange-100" />
              <div className="absolute inset-3 sm:inset-4">
                <RecognitionIcon />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 tracking-tight">RECONHECIMENTO</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Valorizamos a existência e produção artística da comunidade
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 relative" aria-hidden="true">
              <div className="absolute inset-0 bg-purple-100" />
              <div className="absolute inset-3 sm:inset-4">
                <EyeIllustration />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 tracking-tight">DOCUMENTAÇÃO</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Criamos um arquivo vivo que valida identidades
            </p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 relative" aria-hidden="true">
              <div className="absolute inset-0 bg-pink-100" />
              <div className="absolute inset-3 sm:inset-4">
                <HeartHandIllustration />
              </div>
            </div>
            <h3 className="text-xl sm:text-2xl mb-2 sm:mb-3 tracking-tight">COMUNIDADE</h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Fortalecemos redes e construímos legado cultural
            </p>
          </div>
        </motion.div>

        {/* Conteúdo textual em blocos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-6 sm:space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-stone-100 p-6 sm:p-8 relative">
              <div className="absolute top-0 left-0 w-12 sm:w-16 h-1 bg-purple-600" />
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed flex-1">
                  Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda.
                </p>
                <AudioDescriptionButton
                  text="Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda."
                  sectionId="about-historical"
                  variant="icon-only"
                  className="flex-shrink-0"
                />
              </div>
            </div>

            <div className="bg-stone-100 p-6 sm:p-8 relative">
              <div className="absolute top-0 left-0 w-12 sm:w-16 h-1 bg-orange-500" />
              <div className="flex items-start justify-between gap-3 mb-2">
                <p className="text-base sm:text-lg text-gray-800 leading-relaxed flex-1">
                  O Visibilidade em Foco nasce para mapear e conhecer melhor os artistas LGBTQIAPN+ de São Roque, entendendo suas potências, barreiras e perspectivas.
                </p>
                <AudioDescriptionButton
                  text="O Visibilidade em Foco nasce para mapear e conhecer melhor os artistas LGBTQIAPN+ de São Roque, entendendo suas potências, barreiras e perspectivas."
                  sectionId="about-project"
                  variant="icon-only"
                  className="flex-shrink-0"
                />
              </div>
            </div>
          </div>

            <div className="relative bg-black text-white p-8 sm:p-12 md:p-16">
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-400 rounded-full opacity-60 sm:opacity-100" aria-hidden="true" />
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 bg-pink-500 opacity-60 sm:opacity-100" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} aria-hidden="true" />
            
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-start justify-between gap-4 mb-4 sm:mb-6">
                <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed flex-1">
                  Ao registrar as <span className="bg-yellow-400 text-black px-2">NOSSAS</span> existências, criamos um arquivo vivo que valida identidades e fortalece redes de apoio.
                </p>
                <AudioDescriptionButton
                  text="Ao registrar as nossas existências, criamos um arquivo vivo que valida identidades e fortalece redes de apoio. Este mapeamento não é apenas um levantamento de dados — é um ato político de resistência e afirmação."
                  sectionId="about-resistance"
                  variant="icon-only"
                  className="flex-shrink-0"
                />
              </div>
              <p className="text-lg sm:text-xl text-gray-300">
                Este mapeamento não é apenas um levantamento de dados — é um <span className="text-yellow-400">ato político de resistência e afirmação</span>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-48 sm:h-56 md:h-64 bg-purple-600">
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                  <div className="text-6xl sm:text-7xl md:text-9xl opacity-20 select-none" style={{ fontWeight: '900' }}>
                    +
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
                  <p className="text-white text-lg sm:text-xl">
                    É também um espaço de <strong>visibilidade!</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Através das nossas redes sociais, daremos destaque a cada pessoa que quiser fazer parte dessa iniciativa.
              </p>
              <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                Vamos contar histórias, mostrar trajetórias, divulgar trabalhos e aproximar artistas LGBTQIAPN+ do mercado cultural da cidade.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

