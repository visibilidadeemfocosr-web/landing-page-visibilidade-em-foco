'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

// Componente para renderizar HTML formatado de forma segura
function FormattedText({ html }: { html: string }) {
  if (!html) return null
  
  // Verificar se contém tags HTML
  const hasHtml = /<[^>]+>/g.test(html)
  
  if (hasHtml) {
    // Limpar e sanitizar o HTML básico (apenas permitir tags seguras)
    const sanitizedHtml = html
      .replace(/<script[^>]*>.*?<\/script>/gi, '') // Remover scripts
      .replace(/<style[^>]*>.*?<\/style>/gi, '') // Remover estilos inline
    
    return (
      <span 
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        className="[&_strong]:font-bold [&_em]:italic [&_i]:italic [&_p]:mb-0 [&_p]:inline [&_p_strong]:font-bold [&_p_em]:italic [&_p]:leading-normal [&_p]:m-0 [&_p]:p-0"
      />
    )
  }
  
  return <span>{html}</span>
}

interface Submission {
  id: string
  created_at: string
  answers: Array<{
    id: string
    value: string
    file_url?: string
    questions: {
      id: string
      text: string
      field_type: string
    }
  }>
}

export default function AdminSubmissionsClient() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Erro ao carregar submissões:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para remover tags HTML do texto
  const stripHtml = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]+>/g, '').trim()
  }

  const exportToCSV = () => {
    if (submissions.length === 0) return

    const allQuestions = new Set<string>()
    submissions.forEach(sub => {
      sub.answers.forEach(ans => {
        // Remover tags HTML dos títulos das perguntas para o CSV
        allQuestions.add(stripHtml(ans.questions.text))
      })
    })

    const headers = ['ID', 'Data de Criação', ...Array.from(allQuestions)]
    
    const rows = submissions.map(sub => {
      const row: any = {
        'ID': sub.id,
        'Data de Criação': new Date(sub.created_at).toLocaleString('pt-BR'),
      }
      
      sub.answers.forEach(ans => {
        // Usar texto sem HTML para a chave e também limpar o valor se necessário
        const questionText = stripHtml(ans.questions.text)
        const answerValue = ans.file_url || ans.value || ''
        row[questionText] = answerValue
      })
      
      return row
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        const value = row[header] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `submissoes-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Carregando submissões...</div>
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Submissões</h2>
        <Button 
          onClick={exportToCSV} 
          disabled={submissions.length === 0}
          className="w-full sm:w-auto min-h-[44px] touch-manipulation"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <Card
            key={submission.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedSubmission(
              selectedSubmission?.id === submission.id ? null : submission
            )}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Submissão #{submission.id.slice(0, 8)}</CardTitle>
                  <CardDescription>
                    {new Date(submission.created_at).toLocaleString('pt-BR')}
                  </CardDescription>
                </div>
                <span className="text-sm text-muted-foreground">
                  {submission.answers.length} respostas
                </span>
              </div>
            </CardHeader>
            {selectedSubmission?.id === submission.id && (
              <CardContent className="space-y-4 pt-0">
                {submission.answers.map((answer) => (
                  <div key={answer.id} className="border-l-2 border-primary pl-4">
                    <p className="font-semibold text-sm text-muted-foreground mb-1">
                      <FormattedText html={answer.questions.text} />
                    </p>
                    {answer.questions.field_type === 'image' && answer.file_url ? (
                      <img
                        src={answer.file_url}
                        alt="Upload"
                        className="max-w-md h-auto rounded border"
                      />
                    ) : (
                      <p className="text-foreground">
                        {answer.value || '(sem resposta)'}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
        {submissions.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Nenhuma submissão ainda.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

