'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

// Função para traduzir tipos de campo para português
const translateFieldType = (type: string): string => {
  const translations: Record<string, string> = {
    text: 'Texto',
    textarea: 'Área de Texto',
    number: 'Número',
    select: 'Seleção',
    radio: 'Radio Button',
    checkbox: 'Checkbox',
    yesno: 'Sim/Não',
    scale: 'Escala',
    image: 'Upload de Imagem',
    cep: 'CEP',
    social_media: 'Redes Sociais',
  }
  return translations[type] || type
}

export default function AdminDashboardClient() {
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
    return (
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total de Submissões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.total_submissions || 0}</p>
            <CardDescription className="mt-2">
              Respostas recebidas
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.total_questions || 0}</p>
            <CardDescription className="mt-2">
              Configuradas no formulário
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Campo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats?.by_field_type ? Object.keys(stats.by_field_type).length : 0}</p>
            <CardDescription className="mt-2">
              Diferentes tipos utilizados
            </CardDescription>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Perguntas por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.by_field_type ? (
              <div className="space-y-2">
                {Object.entries(stats.by_field_type).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm">{translateFieldType(type)}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma pergunta cadastrada</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a href="/admin/questions" className="block text-sm text-primary hover:underline">
              → Gerenciar Perguntas
            </a>
            <a href="/admin/submissions" className="block text-sm text-primary hover:underline">
              → Ver Submissões
            </a>
            <a href="/admin/stats" className="block text-sm text-primary hover:underline">
              → Ver Estatísticas Detalhadas
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

