'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { DynamicForm } from '@/components/dynamic-form'
import { Loader2 } from 'lucide-react'
import type { Question } from '@/lib/supabase/types'

// Componente wrapper que carrega perguntas
function FormModalContent({ 
  onSuccess
}: { 
  onSuccess?: () => void
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

  return (
    <DynamicForm 
      questions={questions} 
      onSuccess={onSuccess} 
    />
  )
}

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormModal({ isOpen, onClose }: FormModalProps) {
  const handleSuccess = () => {
    setTimeout(() => {
      onClose()
    }, 2000)
  }

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
              <FormModalContent onSuccess={handleSuccess} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
