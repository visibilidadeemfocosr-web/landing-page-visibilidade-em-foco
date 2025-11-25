'use client'

import { useState, useEffect } from 'react'
import { DynamicForm } from './dynamic-form'
import { Loader2 } from 'lucide-react'
import type { Question } from '@/lib/supabase/types'

export function RegistrationFormLoader() {
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

  return <DynamicForm questions={questions} />
}

