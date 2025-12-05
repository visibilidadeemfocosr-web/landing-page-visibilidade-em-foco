'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  FileText, 
  HelpCircle, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Send,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Image as ImageIcon,
  Home,
  Shield
} from 'lucide-react'
import Link from 'next/link'

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

interface DashboardStats {
  total_submissions: number
  total_questions: number
  by_field_type: Record<string, number>
  answers_by_question: any[]
  moderation?: {
    pending: number
    approved: number
    rejected: number
    published: number
  }
  posts?: {
    total: number
    published: number
    draft: number
  }
}

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Carregar estatísticas básicas
      const statsResponse = await fetch('/api/admin/stats')
      if (!statsResponse.ok) {
        throw new Error('Erro ao carregar estatísticas')
      }
      const statsData = await statsResponse.json()
      
      // Carregar dados de moderação
      let moderationStats = { pending: 0, approved: 0, rejected: 0, published: 0 }
      try {
        const moderationResponse = await fetch('/api/admin/moderate', {
          credentials: 'include',
        })
        if (moderationResponse.ok) {
          const moderationData = await moderationResponse.json()
          const artists = moderationData.artists || []
          moderationStats = {
            pending: artists.filter((a: any) => a.status === 'pending').length,
            approved: artists.filter((a: any) => a.status === 'approved').length,
            rejected: artists.filter((a: any) => a.status === 'rejected').length,
            published: artists.filter((a: any) => a.status === 'published').length,
          }
        }
      } catch (e) {
        console.error('Erro ao carregar dados de moderação:', e)
      }
      
      // Carregar dados de posts (usando rota de admin)
      let postsStats = { total: 0, published: 0, draft: 0 }
      try {
        const postsResponse = await fetch('/api/admin/instagram-posts', {
          credentials: 'include',
          cache: 'no-store',
        })
        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          // A API retorna um array diretamente
          if (Array.isArray(postsData)) {
            postsStats = {
              total: postsData.length,
              published: postsData.filter((p: any) => p.status === 'published').length,
              draft: postsData.filter((p: any) => p.status === 'draft' || !p.status).length,
            }
          } else if (postsData.error) {
            console.error('Erro na API de posts:', postsData.error)
          }
        } else {
          const errorData = await postsResponse.json().catch(() => ({}))
          console.error('Erro ao buscar posts:', postsResponse.status, errorData)
        }
      } catch (e) {
        console.error('Erro ao carregar dados de posts:', e)
      }
      
      setStats({
        ...statsData,
        moderation: moderationStats,
        posts: postsStats,
      })
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
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total de Submissões',
      value: stats?.total_submissions || 0,
      description: 'Respostas recebidas',
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      href: '/admin/submissions',
    },
    {
      title: 'Perguntas Ativas',
      value: stats?.total_questions || 0,
      description: 'Configuradas no formulário',
      icon: HelpCircle,
      gradient: 'from-purple-500 to-pink-500',
      href: '/admin/questions',
    },
    {
      title: 'Pendentes',
      value: stats?.moderation?.pending || 0,
      description: 'Aguardando moderação',
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      href: '/admin/moderate?status=pending',
    },
    {
      title: 'Publicados',
      value: stats?.moderation?.published || 0,
      description: 'No Instagram',
      icon: Send,
      gradient: 'from-green-500 to-emerald-500',
      href: '/admin/moderate?status=published',
    },
  ]

  const moderationCards = [
    {
      title: 'Aprovados',
      value: stats?.moderation?.approved || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/admin/moderate?status=approved',
    },
    {
      title: 'Rejeitados',
      value: stats?.moderation?.rejected || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/moderate?status=rejected',
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Visão geral do sistema e métricas principais
        </p>
      </div>

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Link key={index} href={card.href}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-0 shadow-md overflow-hidden group">
                <div className={`bg-gradient-to-br ${card.gradient} p-1`}>
                  <CardContent className="bg-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${card.gradient} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br ${card.gradient}`} />
                      </div>
                      <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold text-gray-900 font-heading">
                        {card.value.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{card.title}</p>
                      <p className="text-xs text-gray-500">{card.description}</p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Grid de Conteúdo */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Moderação */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-lg">Status de Moderação</CardTitle>
              </div>
              <Link href="/admin/moderate">
                <Button variant="ghost" size="sm" className="h-8">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {moderationCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <Link key={index} href={card.href}>
                    <div className={`${card.bgColor} rounded-lg p-4 hover:shadow-md transition-all cursor-pointer`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
                      <p className="text-sm text-gray-600">{card.title}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Posts do Instagram */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-500" />
                <CardTitle className="text-lg">Posts Instagram</CardTitle>
              </div>
              <Link href="/admin/posts">
                <Button variant="ghost" size="sm" className="h-8">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stats?.posts?.total || 0}</p>
                <p className="text-sm text-gray-600">Total de posts</p>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Publicados</span>
                  <span className="font-semibold text-green-600">{stats?.posts?.published || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rascunhos</span>
                  <span className="font-semibold text-gray-600">{stats?.posts?.draft || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tipos de Campo e Ações Rápidas */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tipos de Campo */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Perguntas por Tipo</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats?.by_field_type && Object.keys(stats.by_field_type).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(stats.by_field_type)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([type, count]: [string, any]) => {
                    const percentage = ((count / stats.total_questions) * 100).toFixed(0)
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{translateFieldType(type)}</span>
                          <span className="text-gray-600">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Nenhuma pergunta cadastrada</p>
            )}
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/admin/home-preview">
                <Button variant="outline" className="w-full justify-start group" size="lg">
                  <Home className="w-4 h-4 mr-2 group-hover:text-orange-500 transition-colors" />
                  Editar Home
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/admin/questions">
                <Button variant="outline" className="w-full justify-start group" size="lg">
                  <HelpCircle className="w-4 h-4 mr-2 group-hover:text-purple-500 transition-colors" />
                  Gerenciar Perguntas
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/admin/moderate">
                <Button variant="outline" className="w-full justify-start group" size="lg">
                  <Shield className="w-4 h-4 mr-2 group-hover:text-orange-500 transition-colors" />
                  Moderação
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/admin/posts">
                <Button variant="outline" className="w-full justify-start group" size="lg">
                  <ImageIcon className="w-4 h-4 mr-2 group-hover:text-pink-500 transition-colors" />
                  Criar Post
                  <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
