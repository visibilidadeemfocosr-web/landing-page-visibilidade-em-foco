'use client'

import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from '@/hooks/use-in-view'

export function Importance() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })

  const points = [
    {
      number: "01",
      title: "Suas respostas importam",
      description: "É por meio das respostas do questionário que conseguiremos realizar o mapeamento e compreender de forma real quem compõe essa cena artística.",
      color: "bg-orange-500"
    },
    {
      number: "02",
      title: "Quanto mais, melhor",
      description: "Divulgar a pesquisa é essencial. Quanto mais artistas alcançarmos, mais forte se torna nossa rede e maior é o impacto do projeto.",
      color: "bg-purple-600"
    },
    {
      number: "03",
      title: "Visibilidade e conexões",
      description: "Com os dados coletados, poderemos dar visibilidade, fortalecer conexões e criar bases para ações culturais mais inclusivas.",
      color: "bg-blue-600"
    },
    {
      number: "04",
      title: "Impacto real",
      description: "Esse levantamento contribui para a produção local, abre caminhos para novos projetos e iniciativas que façam diferença.",
      color: "bg-pink-500"
    }
  ]

  return (
    <section ref={ref} className="py-24 bg-stone-50 relative overflow-hidden">
      {/* Elementos decorativos geométricos */}
      <div className="absolute top-20 right-10 w-40 h-40 border-8 border-yellow-400 rounded-full" />
      <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-600" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />

      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <div className="text-sm tracking-widest text-gray-500 mb-4">02 / IMPORTÂNCIA</div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight max-w-5xl mx-auto">
            <div className="text-black mb-4">POR QUE É</div>
            <div className="relative inline-block">
              <span className="text-black">IMPORTANTE</span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-pink-500 -z-10" />
            </div>
            <div className="text-black mt-4">PARTICIPAR?</div>
          </h2>
        </motion.div>

        {/* Grid de pontos */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="bg-white p-8 relative group hover:shadow-2xl transition-shadow duration-300"
            >
              <div className={`absolute top-0 left-0 w-2 h-full ${point.color}`} />
              <div className="pl-8">
                <div className={`text-8xl tracking-tighter leading-none mb-4 ${point.color.replace('bg-', 'text-')} opacity-20 select-none`} style={{ fontWeight: '900' }}>
                  {point.number}
                </div>
                <h3 className="text-2xl md:text-3xl mb-4 tracking-tight">{point.title}</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Citação destacada */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="bg-black text-white p-12 md:p-20 relative overflow-hidden">
            {/* Elementos decorativos da citação */}
            <div className="absolute top-8 left-8 w-20 h-20 bg-yellow-400 rounded-full" />
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-pink-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} />
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border-4 border-purple-600" />

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-6xl md:text-8xl text-yellow-400 mb-8" style={{ fontWeight: '900', lineHeight: '0.8' }}>"</div>
              <blockquote className="text-2xl md:text-4xl leading-relaxed mb-8 tracking-tight">
                Registrar nossas trajetórias como artistas LGBTQIAPN+ é romper apagamentos, ampliar oportunidades e mostrar a potência criativa que existe aqui!
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-16 h-1 bg-pink-500" />
                <div className="text-sm tracking-widest text-gray-400">VISIBILIDADE EM FOCO</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

