'use client'

import { useState, useEffect } from 'react'
import { DynamicForm } from './dynamic-form'
import { Loader2 } from 'lucide-react'
import type { Question } from '@/lib/supabase/types'

interface RegistrationFormLoaderProps {
  onSuccess?: () => void
  prefetchedQuestions?: Question[] // Perguntas pré-carregadas
}

// Cache global para as perguntas (compartilhado entre instâncias)
let questionsCache: Question[] | null = null
let questionsCachePromise: Promise<Question[]> | null = null

export function RegistrationFormLoader({ onSuccess, prefetchedQuestions }: RegistrationFormLoaderProps) {
  const [questions, setQuestions] = useState<Question[]>(prefetchedQuestions || [])
  const [loading, setLoading] = useState(!prefetchedQuestions && questionsCache === null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Se já temos perguntas pré-carregadas ou em cache, usar imediatamente
    if (prefetchedQuestions && prefetchedQuestions.length > 0) {
      setQuestions(prefetchedQuestions)
      setLoading(false)
      return
    }

    if (questionsCache) {
      setQuestions(questionsCache)
      setLoading(false)
      return
    }

    // Se já há uma requisição em andamento, aguardar ela
    if (questionsCachePromise) {
      questionsCachePromise
        .then(data => {
          setQuestions(data)
          setLoading(false)
        })
        .catch(err => {
          setError('Erro ao carregar formulário. Tente novamente mais tarde.')
          console.error(err)
          setLoading(false)
        })
      return
    }

    // Fazer nova requisição
    loadQuestions()
  }, [prefetchedQuestions])

  const loadQuestions = async () => {
    try {
      // Criar promise compartilhada
      questionsCachePromise = fetch('/api/questions')
        .then(response => {
          if (!response.ok) throw new Error('Erro ao carregar perguntas')
          return response.json()
        })
        .then(data => {
          questionsCache = data
          questionsCachePromise = null
          return data
        })

      const data = await questionsCachePromise
      setQuestions(data)
    } catch (err) {
      questionsCachePromise = null
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

  return <DynamicForm questions={questions} onSuccess={onSuccess} />
}

