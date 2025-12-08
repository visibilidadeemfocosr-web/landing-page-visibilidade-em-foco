'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { EyeIllustration, RecognitionIcon, HeartHandIllustration } from './CustomShapes'

export function About() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} id="sobre" className="py-24 bg-white relative overflow-hidden">
      {/* Elemento decorativo lateral */}
      <div className="absolute left-0 top-1/4 w-2 h-64 bg-yellow-400" />
      <div className="absolute right-0 top-1/2 w-3 h-48 bg-purple-600" />

      <div className="max-w-7xl mx-auto px-8">
        {/* Header da seção */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-start gap-8">
            <div className="hidden md:block w-32 h-32 bg-pink-500 flex-shrink-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }} />
            <div>
              <div className="text-sm tracking-widest text-gray-500 mb-4">01 / SOBRE O PROJETO</div>
              <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight mb-6">
                <div className="text-black">O QUE É O</div>
                <div className="relative inline-block">
                  <span className="text-black">VISIBILIDADE</span>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-orange-500 -z-10" />
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
          className="grid md:grid-cols-3 gap-12 mb-20"
        >
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-orange-100" />
              <div className="absolute inset-4">
                <RecognitionIcon />
              </div>
            </div>
            <h3 className="text-2xl mb-3 tracking-tight">RECONHECIMENTO</h3>
            <p className="text-gray-700 leading-relaxed">
              Valorizamos a existência e produção artística da comunidade
            </p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-purple-100" />
              <div className="absolute inset-4">
                <EyeIllustration />
              </div>
            </div>
            <h3 className="text-2xl mb-3 tracking-tight">DOCUMENTAÇÃO</h3>
            <p className="text-gray-700 leading-relaxed">
              Criamos um arquivo vivo que valida identidades
            </p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-pink-100" />
              <div className="absolute inset-4">
                <HeartHandIllustration />
              </div>
            </div>
            <h3 className="text-2xl mb-3 tracking-tight">COMUNIDADE</h3>
            <p className="text-gray-700 leading-relaxed">
              Fortalecemos redes e construímos legado cultural
            </p>
          </div>
        </motion.div>

        {/* Conteúdo textual em blocos */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-stone-100 p-8 relative">
              <div className="absolute top-0 left-0 w-16 h-1 bg-purple-600" />
              <p className="text-lg text-gray-800 leading-relaxed">
                Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda.
              </p>
            </div>

            <div className="bg-stone-100 p-8 relative">
              <div className="absolute top-0 left-0 w-16 h-1 bg-orange-500" />
              <p className="text-lg text-gray-800 leading-relaxed">
                O Visibilidade em Foco nasce para mapear e conhecer melhor os artistas LGBTQIAPN+ de São Roque, entendendo suas potências, barreiras e perspectivas.
              </p>
            </div>
          </div>

          <div className="relative bg-black text-white p-12 md:p-16">
            <div className="absolute top-8 right-8 w-24 h-24 bg-yellow-400 rounded-full" />
            <div className="absolute bottom-8 left-8 w-32 h-32 bg-pink-500" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
            
            <div className="relative z-10 max-w-4xl">
              <p className="text-2xl md:text-3xl leading-relaxed mb-6">
                Ao registrar as <span className="bg-yellow-400 text-black px-2">NOSSAS</span> existências, criamos um arquivo vivo que valida identidades e fortalece redes de apoio.
              </p>
              <p className="text-xl text-gray-300">
                Este mapeamento não é apenas um levantamento de dados — é um <span className="text-yellow-400">ato político de resistência e afirmação</span>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-64 bg-purple-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl opacity-20 select-none" style={{ fontWeight: '900' }}>
                    +
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white text-xl">
                    É também um espaço de <strong>visibilidade!</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-4">
              <p className="text-lg text-gray-800 leading-relaxed">
                Através da nossa rede social{' '}
                <span className="bg-purple-600 text-white px-2 py-1">@visibilidadeemfocosr</span>, daremos destaque a cada pessoa que quiser fazer parte dessa rede.
              </p>
              <p className="text-lg text-gray-800 leading-relaxed">
                Vamos contar histórias, mostrar trajetórias, divulgar trabalhos e aproximar artistas LGBTQIAPN+ do mercado cultural da cidade.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

