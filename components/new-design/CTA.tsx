'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { RegistrationFormLoader } from '@/components/registration-form-loader'

export function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <section ref={ref} id="participar" className="py-24 bg-stone-50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400 opacity-20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-600 opacity-20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="text-sm tracking-widest text-gray-500 mb-4">04 / PARTICIPE</div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl tracking-tight leading-tight mb-8">
              <div className="text-black">SUA VOZ</div>
              <div className="relative inline-block">
                <span className="text-black">TRANSFORMA</span>
                <div className="absolute -bottom-2 left-0 right-0 h-4 bg-pink-500 -z-10" />
              </div>
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
              Faça parte deste movimento histórico de visibilidade e resistência artística
            </p>
          </motion.div>

          {/* Grid com informações */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <div className="bg-white p-10 border-l-8 border-purple-600">
              <div className="text-sm tracking-widest text-gray-500 mb-4">PERÍODO</div>
              <div className="text-4xl md:text-5xl mb-4 tracking-tight">
                15/12<span className="text-purple-600">/</span>2025
              </div>
              <div className="text-2xl text-gray-600 mb-4">até</div>
              <div className="text-4xl md:text-5xl tracking-tight">
                15/02<span className="text-pink-500">/</span>2026
              </div>
            </div>

            <div className="bg-white p-10 border-l-8 border-orange-500">
              <div className="text-sm tracking-widest text-gray-500 mb-4">TEMPO ESTIMADO</div>
              <div className="text-6xl md:text-7xl mb-4 tracking-tight">
                10<span className="text-orange-500">-</span>15
              </div>
              <div className="text-2xl text-gray-600">minutos para responder</div>
            </div>
          </motion.div>

          {/* Box de chamada principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black text-white p-12 md:p-16 mb-12 relative overflow-hidden"
          >
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500 opacity-20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-400 opacity-20 rounded-full" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="mb-8">
                <div className="text-3xl md:text-4xl mb-6 tracking-tight leading-tight">
                  Artista LGBTQIAPN+ de São Roque,
                  <br />
                  <span className="text-yellow-400">sua história importa!</span>
                </div>
                <p className="text-xl text-gray-300">
                  Responda ao questionário e ajude a construir um mapeamento que celebra nossa diversidade e potência criativa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="group bg-pink-500 hover:bg-pink-600 text-white px-12 py-5 text-xl tracking-wide transition-all duration-300 relative overflow-hidden"
                >
                  <span className="relative z-10">PARTICIPAR AGORA</span>
                  <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="absolute inset-0 flex items-center justify-center text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 tracking-wide">
                    PARTICIPAR AGORA
                  </span>
                </button>

                <button className="border-2 border-white text-white hover:bg-white hover:text-black px-12 py-5 text-xl tracking-wide transition-all duration-300">
                  COMPARTILHAR
                </button>
              </div>
            </div>
          </motion.div>

          {/* Redes sociais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center"
          >
            <div className="mb-6">
              <div className="text-sm tracking-widest text-gray-500 mb-4">SIGA NAS REDES</div>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-1 bg-purple-600" />
                <a 
                  href="https://instagram.com/visibilidadeemfocosr" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl md:text-4xl text-black hover:text-purple-600 transition-colors tracking-tight"
                >
                  @visibilidadeemfocosr
                </a>
                <div className="w-12 h-1 bg-pink-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="bg-purple-600 p-6 text-white">
                <div className="text-sm tracking-widest mb-2">INSTAGRAM</div>
                <div className="text-2xl">📸</div>
              </div>
              <div className="bg-pink-500 p-6 text-white">
                <div className="text-sm tracking-widest mb-2">HISTÓRIAS</div>
                <div className="text-2xl">✨</div>
              </div>
              <div className="bg-orange-500 p-6 text-white">
                <div className="text-sm tracking-widest mb-2">DESTAQUES</div>
                <div className="text-2xl">🎨</div>
              </div>
              <div className="bg-blue-600 p-6 text-white">
                <div className="text-sm tracking-widest mb-2">CONEXÕES</div>
                <div className="text-2xl">🤝</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal do Formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl">
            <button
              onClick={() => setIsFormOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <RegistrationFormLoader onSuccess={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

