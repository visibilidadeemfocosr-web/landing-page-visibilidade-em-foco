'use client'

import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { useInView } from '@/hooks/use-in-view'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RegistrationFormLoader } from '@/components/registration-form-loader'
import { Instagram, Sparkles, Star, Network, Facebook } from 'lucide-react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { AudioDescriptionButton } from '@/components/accessibility/AudioDescriptionButton'

export function CTA() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once: true, margin: "-100px" })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleShare = async () => {
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('URL copiada para a área de transferência!')
      
      // Resetar o estado após 2 segundos
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast.error('Erro ao copiar URL')
      console.error('Erro ao copiar:', err)
    }
  }

  return (
    <>
      <section ref={ref} id="participar" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-stone-50 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-yellow-400 opacity-20 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-20 right-10 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-600 opacity-20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">04 / PARTICIPE</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-tight mb-6 sm:mb-8">
              <div className="text-black">SUA VOZ</div>
              <div className="relative inline-block">
                <span className="text-black">TRANSFORMA</span>
                <div className="absolute -bottom-2 left-0 right-0 h-3 sm:h-4 bg-pink-500 -z-10" aria-hidden="true" />
              </div>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto px-4">
              Faça parte deste movimento histórico de visibilidade e resistência artística
            </p>
          </motion.div>

          {/* Grid com informações */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16"
          >
            <div className="bg-white p-6 sm:p-8 md:p-10 border-l-4 sm:border-l-6 md:border-l-8 border-purple-600">
              <div className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">PERÍODO</div>
              <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 tracking-tight">
                15/12<span className="text-purple-600">/</span>2025
              </div>
              <div className="text-xl sm:text-2xl text-gray-600 mb-3 sm:mb-4">até</div>
              <div className="text-3xl sm:text-4xl md:text-5xl tracking-tight">
                15/02<span className="text-pink-500">/</span>2026
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 md:p-10 border-l-4 sm:border-l-6 md:border-l-8 border-orange-500">
              <div className="text-xs sm:text-sm tracking-widest text-gray-500 mb-3 sm:mb-4">TEMPO ESTIMADO</div>
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 tracking-tight">
                10<span className="text-orange-500">-</span>15
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-gray-600">minutos para responder</div>
            </div>
          </motion.div>

          {/* Box de chamada principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-black text-white p-8 sm:p-12 md:p-16 mb-12 relative overflow-hidden"
          >
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-pink-500 opacity-20" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} aria-hidden="true" />
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-yellow-400 opacity-20 rounded-full" aria-hidden="true" />

            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <div className="absolute bottom-4 right-4">
                <AudioDescriptionButton
                  text="Artista LGBTQIAPN+ de São Roque, sua história importa! Responda ao questionário e ajude a construir um mapeamento que celebra nossa diversidade e potência criativa."
                  sectionId="cta-call"
                  variant="icon-only"
                />
              </div>
              <div className="mb-6 sm:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 tracking-tight leading-tight px-4">
                  Artista LGBTQIAPN+ de São Roque,
                  <br />
                  <span className="text-yellow-400">sua história importa!</span>
                </div>
                <p className="text-lg sm:text-xl text-gray-300 px-4">
                  Responda ao questionário e ajude a construir um mapeamento que celebra nossa diversidade e potência criativa.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
                {mounted ? (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal={true}>
                    <DialogTrigger asChild>
                      <button 
                        className="group bg-pink-500 hover:bg-pink-600 text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 text-base sm:text-lg md:text-xl tracking-wide transition-all duration-300 relative overflow-hidden active:scale-95 sm:active:scale-100 w-full sm:w-auto"
                        aria-label="Abrir formulário de participação no mapeamento de artistas LGBTQIAPN+"
                      >
                        <span className="relative z-10">PARTICIPAR AGORA</span>
                        <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" aria-hidden="true" />
                        <span className="absolute inset-0 flex items-center justify-center text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 tracking-wide" aria-hidden="true">
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
                        <RegistrationFormLoader onSuccess={() => setDialogOpen(false)} />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <button 
                    className="group bg-pink-500 hover:bg-pink-600 text-white px-12 py-5 text-xl tracking-wide transition-all duration-300 relative overflow-hidden"
                  >
                    <span className="relative z-10">PARTICIPAR AGORA</span>
                    <div className="absolute inset-0 bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    <span className="absolute inset-0 flex items-center justify-center text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 tracking-wide">
                      PARTICIPAR AGORA
                    </span>
                  </button>
                )}

                <button 
                  onClick={handleShare}
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 sm:px-10 md:px-12 py-4 sm:py-5 text-base sm:text-lg md:text-xl tracking-wide transition-all duration-300 relative overflow-hidden active:scale-95 sm:active:scale-100 w-full sm:w-auto"
                  aria-label="Compartilhar link do site"
                  aria-describedby="share-description"
                >
                  <span id="share-description" className="sr-only">Copia a URL do site para compartilhar</span>
                  <span className={`relative z-10 transition-opacity duration-300 ${copied ? 'opacity-0' : 'opacity-100'}`}>
                    COMPARTILHAR
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${copied ? 'opacity-100' : 'opacity-0'}`} aria-live="polite">
                    COPIADO!
                  </span>
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
              <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap px-4">
                <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-purple-600" />
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black tracking-tight">
                  SIGA NAS REDES
                </div>
                <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-pink-500" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-8 sm:mt-12 px-4">
              <a 
                href="https://instagram.com/visibilidadeemfocosr" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 p-4 sm:p-5 md:p-6 text-white flex flex-col items-center justify-center text-center hover:bg-purple-700 transition-colors"
                aria-label="Abrir perfil do Instagram em nova aba"
              >
                <div className="text-xs sm:text-sm tracking-widest mb-2">INSTAGRAM</div>
                <Instagram className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" aria-hidden="true" />
              </a>
              <a 
                href="https://www.facebook.com/share/14UaAhPw5VN/?mibextid=wwXIfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-4 sm:p-5 md:p-6 text-white flex flex-col items-center justify-center text-center hover:bg-blue-700 transition-colors"
                aria-label="Abrir página do Facebook em nova aba"
              >
                <div className="text-xs sm:text-sm tracking-widest mb-2">FACEBOOK</div>
                <Facebook className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" aria-hidden="true" />
              </a>
              <div className="bg-pink-500 p-4 sm:p-5 md:p-6 text-white flex flex-col items-center justify-center text-center">
                <div className="text-xs sm:text-sm tracking-widest mb-2">HISTÓRIAS</div>
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" aria-hidden="true" />
              </div>
              <div className="bg-orange-500 p-4 sm:p-5 md:p-6 text-white flex flex-col items-center justify-center text-center">
                <div className="text-xs sm:text-sm tracking-widest mb-2">DESTAQUES</div>
                <Star className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" aria-hidden="true" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

