'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

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

export default function AdminSubmissionsPage() {
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

  const exportToCSV = () => {
    if (submissions.length === 0) return

    // Criar cabeçalho
    const allQuestions = new Set<string>()
    submissions.forEach(sub => {
      sub.answers.forEach(ans => {
        allQuestions.add(ans.questions.text)
      })
    })

    const headers = ['ID', 'Data de Criação', ...Array.from(allQuestions)]
    
    // Criar linhas
    const rows = submissions.map(sub => {
      const row: any = {
        'ID': sub.id,
        'Data de Criação': new Date(sub.created_at).toLocaleString('pt-BR'),
      }
      
      sub.answers.forEach(ans => {
        row[ans.questions.text] = ans.file_url || ans.value || ''
      })
      
      return row
    })

    // Converter para CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => headers.map(header => {
        const value = row[header] || ''
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(','))
    ].join('\n')

    // Download
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
                      {answer.questions.text}
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

