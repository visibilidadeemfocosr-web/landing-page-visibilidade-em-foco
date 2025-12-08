'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'
import { DynamicForm } from '@/components/dynamic-form'
import { Loader2 } from 'lucide-react'
import type { Question } from '@/lib/supabase/types'

// Componente wrapper que carrega perguntas e pula a pergunta inicial
function FormModalContent({ 
  onSuccess, 
  onBlockChange,
  onNavigateNextReady,
  onNavigatePrevReady
}: { 
  onSuccess?: () => void
  onBlockChange?: (blockIndex: number, totalBlocks: number) => void
  onNavigateNextReady?: (navigateNext: () => Promise<void>) => void
  onNavigatePrevReady?: (navigatePrev: () => void) => void
}) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadQuestions()
  }, [])

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      if (!response.ok) throw new Error('Erro ao carregar perguntas')
      const data = await response.json()
      setQuestions(data)
    } catch (err) {
      setError('Erro ao carregar formulário. Tente novamente mais tarde.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Nenhuma pergunta configurada ainda.</p>
      </div>
    )
  }

  // Usar DynamicForm diretamente - pular pergunta inicial pois já está no modal
  // Ocultar progresso interno e passar callbacks para notificar mudanças de bloco e expor funções de navegação
  return (
    <DynamicForm 
      questions={questions} 
      onSuccess={onSuccess} 
      skipInitialQuestion={true}
      hideProgress={true}
      onBlockChange={onBlockChange}
      onNavigateNextReady={onNavigateNextReady}
      onNavigatePrevReady={onNavigatePrevReady}
    />
  )
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormModal({ isOpen, onClose }: FormModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isArtist, setIsArtist] = useState<boolean | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [totalBlocks, setTotalBlocks] = useState(0)
  const [cepValidated, setCepValidated] = useState(false)
  const [navigateNext, setNavigateNext] = useState<(() => Promise<void>) | null>(null)
  const [navigatePrev, setNavigatePrev] = useState<(() => void) | null>(null)
  
  // Refs para armazenar valores pendentes de atualização (evitar atualização durante renderização)
  const pendingBlockIndexRef = useRef<number | null>(null)
  const pendingTotalBlocksRef = useRef<number | null>(null)

  // Estado das etapas:
  // Etapa 0: Pergunta inicial (você é artista?)
  // Etapa 1-3: Blocos do formulário (após validar CEP)
  const currentEtapa = cepValidated ? currentBlockIndex + 1 : 0
  const totalEtapas = cepValidated && totalBlocks > 0 ? totalBlocks : 1

  const handleNext = () => {
    if (isArtist === true) {
      setShowForm(true)
    }
  }

  const handleBack = () => {
    if (cepValidated && currentBlockIndex > 0 && navigatePrev && typeof navigatePrev === 'function') {
      // Voltar para bloco anterior usando função do DynamicForm
      try {
        navigatePrev()
      } catch (error) {
        console.error('Erro ao voltar:', error)
      }
      return
    } else if (showForm && !cepValidated) {
      // Voltar para pergunta inicial antes de validar CEP
      setShowForm(false)
      setIsArtist(null)
      setCepValidated(false)
    } else if (showForm) {
      // Voltar para pergunta inicial
      setShowForm(false)
      setIsArtist(null)
      setCepValidated(false)
      setCurrentBlockIndex(0)
      setTotalBlocks(0)
    }
  }

  const handleContinue = async () => {
    // Verificar se navigateNext está disponível
    if (!navigateNext || typeof navigateNext !== 'function') {
      console.warn('navigateNext ainda não está disponível:', navigateNext)
      return
    }
    
    // Chamar diretamente
    try {
      await navigateNext()
    } catch (error: unknown) {
      console.error('Erro ao navegar:', error)
    }
  }

  const handleSuccess = () => {
    // Fechar modal após sucesso
    setTimeout(() => {
      onClose()
      // Resetar estado
      setIsArtist(null)
      setShowForm(false)
      setCurrentStep(0)
      setCurrentBlockIndex(0)
      setTotalBlocks(0)
      setCepValidated(false)
    }, 2000)
  }

  const handleBlockChange = (blockIndex: number, total: number) => {
    // Armazenar valores pendentes em refs para evitar atualização durante renderização
    pendingBlockIndexRef.current = blockIndex
    pendingTotalBlocksRef.current = total
    
    // Quando recebemos notificação de bloco, significa que CEP foi validado e estamos nos blocos
    if (total > 0 && !cepValidated) {
      setCepValidated(true)
    }
  }

  // Atualizar estado de forma assíncrona quando houver valores pendentes
  useEffect(() => {
    if (pendingBlockIndexRef.current !== null || pendingTotalBlocksRef.current !== null) {
      const timeoutId = setTimeout(() => {
        if (pendingBlockIndexRef.current !== null) {
          setCurrentBlockIndex(pendingBlockIndexRef.current)
          pendingBlockIndexRef.current = null
        }
        if (pendingTotalBlocksRef.current !== null) {
          setTotalBlocks(pendingTotalBlocksRef.current)
          pendingTotalBlocksRef.current = null
        }
      }, 0)
      return () => clearTimeout(timeoutId)
    }
  })

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal - quase full screen */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-2 md:inset-4 lg:inset-8 bg-white z-50 overflow-hidden flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-4rem)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
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
                onClick={onClose}
                className="absolute top-8 right-8 z-20 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content */}
            <div id="form-scroll-container" className="flex-1 overflow-y-auto p-8 md:p-10 lg:p-12 min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
              <AnimatePresence mode="wait">
                {/* Step 0 - Pergunta inicial */}
                {!showForm && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-1 bg-purple-600" />
                        <span className="text-sm tracking-widest text-gray-500">PERGUNTA INICIAL</span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl lg:text-4xl tracking-tight leading-tight mb-2">
                        Você responde este formulário como pessoa artista LGBTQIAPN+ morador(a/e) do município de São Roque?
                      </h3>
                      <span className="text-pink-500 text-xl">*</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <button
                        onClick={() => {
                          setIsArtist(true)
                          handleNext()
                        }}
                        className={`group relative p-8 border-4 transition-all duration-300 ${
                          isArtist === true 
                            ? 'border-orange-500 bg-orange-500 text-white' 
                            : 'border-gray-200 hover:border-orange-500'
                        }`}
                      >
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-4 border-current" />
                        {isArtist === true && (
                          <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full" />
                        )}
                        <div className="text-3xl md:text-4xl tracking-tight">SIM</div>
                      </button>

                      <button
                        onClick={() => setIsArtist(false)}
                        className={`group relative p-8 border-4 transition-all duration-300 ${
                          isArtist === false 
                            ? 'border-gray-600 bg-gray-600 text-white' 
                            : 'border-gray-200 hover:border-gray-600'
                        }`}
                      >
                        <div className="absolute top-4 right-4 w-8 h-8 rounded-full border-4 border-current" />
                        {isArtist === false && (
                          <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full" />
                        )}
                        <div className="text-3xl md:text-4xl tracking-tight">NÃO</div>
                      </button>
                    </div>

                    {isArtist === false && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 bg-gray-100 p-6 border-l-4 border-gray-600"
                      >
                        <p className="text-gray-700">
                          Este formulário é destinado exclusivamente para artistas LGBTQIAPN+ residentes em São Roque.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Step 1 - Formulário dinâmico */}
                {showForm && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-1 bg-purple-600" />
                        <span className="text-sm tracking-widest text-gray-500">FORMULÁRIO DE CADASTRO</span>
                      </div>
                    </div>

                    {/* Aviso de privacidade */}
                    <div className="mb-8 bg-stone-50 p-8 border-l-4 border-purple-600">
                      <div className="mb-6">
                        <h4 className="mb-2 tracking-tight font-semibold">PRIVACIDADE E PROTEÇÃO DE DADOS:</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Seus dados serão utilizados exclusivamente para o projeto Visibilidade em Foco e não serão compartilhados com terceiros sem seu consentimento. 
                          Você pode solicitar a remoção das suas informações a qualquer momento.
                        </p>
                      </div>
                    </div>

                    {/* Formulário dinâmico com estilos do novo design */}
                    <div className="new-design-form-wrapper">
                      <FormModalContent 
                        onSuccess={handleSuccess} 
                        onBlockChange={handleBlockChange}
                        onNavigateNextReady={(fn) => {
                          if (typeof fn === 'function') {
                            setNavigateNext(fn)
                          } else {
                            console.warn('onNavigateNextReady recebeu algo que não é função:', fn)
                          }
                        }}
                        onNavigatePrevReady={(fn) => {
                          if (typeof fn === 'function') {
                            setNavigatePrev(fn)
                          } else {
                            console.warn('onNavigatePrevReady recebeu algo que não é função:', fn)
                          }
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer com navegação */}
            {!showForm && (
              <div className="bg-stone-100 p-4 md:p-5 border-t-4 border-black flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs tracking-widest text-gray-600">
                        ETAPA 0 DE {totalEtapas}
                      </span>
                      <span className="text-xs text-gray-600">PERGUNTA INICIAL</span>
                    </div>
                    <div className="h-1.5 bg-gray-300 relative">
                      <motion.div
                        className="absolute top-0 left-0 h-full bg-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: '0%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {isArtist === true && (
                      <button
                        onClick={handleNext}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                      >
                        <span className="tracking-wide text-base">CONTINUAR</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {showForm && (
              <div className="bg-stone-100 p-4 md:p-5 border-t-4 border-black flex-shrink-0">
                <div className="max-w-4xl mx-auto">
                  {/* Progress bar - só mostrar se CEP foi validado */}
                  {cepValidated && totalEtapas > 0 && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs tracking-widest text-gray-600">
                          ETAPA {currentEtapa} DE {totalEtapas}
                        </span>
                        <span className="text-xs text-gray-600">
                          {currentEtapa === totalEtapas ? 'FINALIZAÇÃO' : 'FORMULÁRIO'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-300 relative">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-orange-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentEtapa / totalEtapas) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    {/* Botão Voltar - apenas a partir da Etapa 2 (currentEtapa >= 2) ou se CEP não foi validado ainda */}
                    {(currentEtapa >= 2 || (!cepValidated && showForm)) && (
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 px-6 py-3 border-4 border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="tracking-wide text-sm">VOLTAR</span>
                      </button>
                    )}
                    {/* Botão Continuar - quando CEP foi validado e não estamos no último bloco */}
                    {cepValidated && currentEtapa < totalEtapas && navigateNext && (
                      <button
                        onClick={handleContinue}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300"
                      >
                        <span className="tracking-wide text-base">CONTINUAR</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

