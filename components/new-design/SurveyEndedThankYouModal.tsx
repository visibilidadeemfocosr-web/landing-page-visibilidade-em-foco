'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { SURVEY_ENDED } from '@/lib/survey-ended'

export function SurveyEndedThankYouModal() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && SURVEY_ENDED) setOpen(true)
  }, [mounted])

  const handleClose = () => setOpen(false)

  if (!SURVEY_ENDED || !open) return null

  return (
    <>
      {/* Overlay – acima de tudo; clicar fecha a modal */}
      <div
        role="presentation"
        className="fixed inset-0 bg-black/80 z-[99999]"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        aria-hidden
        onClick={handleClose}
      />

      {/* Modal – acima do overlay, com X para fechar; clicar dentro não fecha */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="thankyou-modal-title"
        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto pointer-events-none"
        style={{ top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <div
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-2xl pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header – identidade visual da home + X */}
          <div className="relative bg-black text-white p-8 md:p-10 flex-shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} aria-hidden />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400 rounded-full opacity-50" aria-hidden />
            <div className="absolute top-4 right-4 w-20 h-20 bg-purple-600 rounded-full opacity-30" aria-hidden />

            <div className="relative z-10 pr-14 sm:pr-16">
              <h2 id="thankyou-modal-title" className="text-2xl sm:text-3xl md:text-4xl tracking-tight font-bold mb-2">
                MAPEAMENTO ENCERRADO!
              </h2>
              <p className="text-sm text-gray-400 tracking-wide">
                Visibilidade em Foco · São Roque
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Fechar"
            >
              <X className="w-8 h-8" aria-hidden />
            </button>
          </div>

          {/* Corpo – texto de agradecimento */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 bg-stone-50" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="max-w-xl mx-auto space-y-5 text-stone-700 text-base sm:text-lg leading-relaxed">
              <p>
                Queremos agradecer, com muito carinho, a cada artista que confiou sua história, sua trajetória e sua vivência a este projeto. Cada resposta recebida reforça a potência criativa presente em nossa cidade e a importância de construirmos espaços mais inclusivos, diversos e visíveis.
              </p>
              <p>
                O mapeamento foi apenas o começo. Em breve, os artistas participantes começarão a ser apresentados em nossas redes sociais, ampliando sua visibilidade e fortalecendo conexões dentro e fora do município.
              </p>
              <p>
                Seguimos acreditando que dar visibilidade é também promover pertencimento, reconhecimento e oportunidade.
              </p>
              <p className="text-stone-800 font-medium">
                Obrigada por fazerem parte dessa construção coletiva. A cultura se fortalece quando todas as vozes são ouvidas. 💛
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-200 text-center">
              <button
                type="button"
                onClick={handleClose}
                className="bg-black text-white px-8 py-4 rounded-full text-sm sm:text-base font-medium tracking-wide hover:bg-stone-800 transition-colors"
                aria-label="Fechar e continuar navegando"
              >
                Fechar e continuar navegando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
