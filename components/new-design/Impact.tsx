'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { PeopleIllustration, SpeakerIllustration } from './CustomShapes'
import { AudioDescriptionButton } from '@/components/accessibility/AudioDescriptionButton'

export function Impact() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="impacto" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 md:mb-20"
        >
          <div className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">03 / IMPACTO</div>
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight">
                <div className="text-black">A IMPORTÂNCIA</div>
                <div className="text-black">DE</div>
                <div className="relative inline-block">
                  <span className="relative inline-block text-black" style={{ zIndex: 2 }}>
                    EXISTIR
                  </span>
                  <span 
                    className="absolute bottom-0 left-0 right-0 bg-yellow-400 block" 
                    style={{ 
                      height: '12px',
                      transform: 'translateY(4px)',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-black">E RESISTIR</div>
              </h2>
            </div>
            <div className="flex items-end h-full">
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed">
                Muito mais que números e estatísticas — um movimento de validação, resistência e transformação.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Grid de conceitos visuais */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 md:mb-20"
        >
          <div className="bg-orange-500 p-4 sm:p-6 md:p-8 text-white aspect-square flex flex-col justify-between">
            <div className="text-xs sm:text-sm tracking-widest">01</div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">RESISTÊNCIA</div>
              <p className="text-xs sm:text-sm text-orange-100">Combater apagamento histórico</p>
            </div>
          </div>

          <div className="bg-purple-600 p-4 sm:p-6 md:p-8 text-white aspect-square flex flex-col justify-between">
            <div className="text-xs sm:text-sm tracking-widest">02</div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">VISIBILIDADE</div>
              <p className="text-xs sm:text-sm text-purple-100">Reconhecimento aos artistas</p>
            </div>
          </div>

          <div className="bg-blue-600 p-4 sm:p-6 md:p-8 text-white aspect-square flex flex-col justify-between">
            <div className="text-xs sm:text-sm tracking-widest">03</div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">CONEXÃO</div>
              <p className="text-xs sm:text-sm text-blue-100">Fortalecer a rede local</p>
            </div>
          </div>

          <div className="bg-pink-500 p-4 sm:p-6 md:p-8 text-white aspect-square flex flex-col justify-between">
            <div className="text-xs sm:text-sm tracking-widest">04</div>
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl tracking-tight mb-1 sm:mb-2">VOZ</div>
              <p className="text-xs sm:text-sm text-pink-100">Amplificar histórias</p>
            </div>
          </div>
        </motion.div>

        {/* Seção de ilustrações conceituais */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-12 mb-20"
        >
          <div className="bg-stone-100 p-12 relative">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-30" aria-hidden="true">
              <PeopleIllustration />
            </div>
            <div className="absolute bottom-4 right-4 z-20">
              <AudioDescriptionButton
                text="Comunidade: Criar espaços de encontro, troca e fortalecimento mútuo entre artistas LGBTQIAPN+."
                sectionId="impact-community"
                variant="icon-only"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl mb-6 tracking-tight">COMUNIDADE</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Criar espaços de encontro, troca e fortalecimento mútuo entre artistas LGBTQIAPN+.
              </p>
              <div className="w-20 h-1 bg-purple-600" />
            </div>
          </div>

          <div className="bg-stone-100 p-12 relative">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-30" aria-hidden="true">
              <SpeakerIllustration />
            </div>
            <div className="absolute bottom-4 right-4 z-20">
              <AudioDescriptionButton
                text="Amplificação: Dar voz, palco e reconhecimento para quem sempre esteve aqui, criando e resistindo."
                sectionId="impact-amplification"
                variant="icon-only"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl mb-6 tracking-tight">AMPLIFICAÇÃO</h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                Dar voz, palco e reconhecimento para quem sempre esteve aqui, criando e resistindo.
              </p>
              <div className="w-20 h-1 bg-orange-500" />
            </div>
          </div>
        </motion.div>

        {/* Bloco de destaque final */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative"
        >
          <div className="grid md:grid-cols-5 gap-8">
            {/* Bloco visual */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-12 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" aria-hidden="true">
                <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full" />
                <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full" />
              </div>
              <div className="text-white text-center relative z-10">
                <div className="flex items-center justify-center mb-4" aria-hidden="true">
                  <div className="w-32 h-32 bg-pink-300 rounded-full flex items-center justify-center">
                    <div className="text-6xl md:text-7xl" style={{ fontWeight: '900', lineHeight: '1' }}>+</div>
                  </div>
                </div>
                <div className="text-xl tracking-wider">JUNTOS</div>
              </div>
            </div>

            {/* Bloco de texto */}
            <div className="md:col-span-3 bg-black text-white p-12 flex flex-col justify-center relative">
              <div className="absolute bottom-4 right-4">
                <AudioDescriptionButton
                  text="Este mapeamento é muito mais que dados. É sobre validar existências, fortalecer identidades e construir um futuro onde artistas LGBTQIAPN+ tenham o reconhecimento e espaço que merecem. Transformar a realidade cultural."
                  sectionId="impact-final"
                  variant="icon-only"
                />
              </div>
              <h3 className="text-3xl md:text-4xl mb-6 tracking-tight leading-tight">
                Este mapeamento é muito mais que dados
              </h3>
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-6">
                É sobre <span className="text-yellow-400">validar existências</span>, <span className="text-pink-400">fortalecer identidades</span> e <span className="text-purple-400">construir um futuro</span> onde artistas LGBTQIAPN+ tenham o reconhecimento e espaço que merecem.
              </p>
              <div className="flex items-center gap-4 text-lg">
                <div className="w-12 h-1 bg-pink-500" />
                <span className="tracking-wide">Transformar a realidade cultural</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

