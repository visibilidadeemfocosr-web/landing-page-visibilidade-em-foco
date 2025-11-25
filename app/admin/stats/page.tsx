'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto px-6 py-8">Carregando estatísticas...</div>
  }

  if (!stats) {
    return <div className="container mx-auto px-6 py-8">Erro ao carregar estatísticas</div>
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Estatísticas e Relatórios</h2>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Submissões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total_submissions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total_questions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Campo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Object.keys(stats.by_field_type).length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {stats.answers_by_question.map((question: any) => (
          <Card key={question.question_id}>
            <CardHeader>
              <CardTitle>{question.question_text}</CardTitle>
              <CardDescription>Tipo: {question.field_type}</CardDescription>
            </CardHeader>
            <CardContent>
              {question.field_type === 'yesno' && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(question.unique_values).map(([key, value]) => ({
                        name: key,
                        value,
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.keys(question.unique_values).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {question.field_type === 'scale' && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={Object.entries(question.unique_values).map(([key, value]) => ({
                    valor: key,
                    quantidade: value,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="valor" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#ec4899" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {(question.field_type === 'select' || question.field_type === 'radio') && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(question.unique_values)
                      .map(([key, value]) => ({
                        opcao: key.length > 20 ? key.substring(0, 20) + '...' : key,
                        quantidade: value,
                      }))
                      .sort((a, b) => b.quantidade - a.quantidade)
                      .slice(0, 10)}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="opcao" type="category" width={150} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {!['yesno', 'scale', 'select', 'radio'].includes(question.field_type) && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Total de respostas: {question.total_answers}
                  </p>
                  <div className="space-y-2">
                    {Object.entries(question.unique_values)
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .slice(0, 10)
                      .map(([key, value]: any) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-muted rounded">
                          <span className="text-sm">{key || '(vazio)'}</span>
                          <span className="font-semibold">{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.answers_by_question.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Nenhuma estatística disponível ainda. As estatísticas aparecerão quando houver submissões.
          </CardContent>
        </Card>
      )}
    </div>
  )
}

