'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Edit, 
  Trash2,
  Loader2,
  Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import type { InstagramPost } from '@/lib/supabase/types'

export default function PostDetailClient() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<InstagramPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/instagram-posts/${postId}`)
      if (!response.ok) throw new Error('Post não encontrado')
      
      const data = await response.json()
      setPost(data)
    } catch (error) {
      console.error('Erro ao buscar post:', error)
      toast.error('Erro ao carregar post')
      router.push('/admin/posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return
    
    try {
      setDeleting(true)
      const response = await fetch(`/api/instagram-posts/${postId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Erro ao deletar post')
      
      toast.success('Post deletado com sucesso!')
      router.push('/admin/posts')
    } catch (error) {
      console.error('Erro ao deletar:', error)
      toast.error('Erro ao deletar post')
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      draft: { 
        className: 'bg-gray-100 text-gray-800', 
        label: 'Rascunho' 
      },
      published: { 
        className: 'bg-blue-100 text-blue-800', 
        label: 'Publicado' 
      },
    }
    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/admin/posts')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{post.title || 'Post sem título'}</h1>
              <div className="flex items-center gap-2 mt-2">
                {getStatusBadge(post.status)}
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {post.published_at 
                    ? `Publicado em ${formatDate(post.published_at)}`
                    : `Criado em ${formatDate(post.created_at)}`
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {post.status === 'draft' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Excluir
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Preview da Imagem */}
        {post.image_url && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <img
                  src={post.image_url}
                  alt={post.title || 'Post preview'}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Template</label>
              <p className="mt-1">
                {post.template_type === 'chamamento' && '📢 Chamamento/Divulgação'}
                {post.template_type === 'artista' && '🎨 Perfil de Artista'}
                {post.template_type === 'evento' && '🎭 Evento'}
                {post.template_type === 'citacao' && '💬 Citação'}
                {post.template_type === 'livre' && '📸 Post Livre'}
              </p>
            </div>

            {post.subtitle && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Subtítulo</label>
                <p className="mt-1">{post.subtitle}</p>
              </div>
            )}

            {post.description && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="mt-1">{post.description}</p>
              </div>
            )}

            {post.caption && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Legenda</label>
                <p className="mt-1 whitespace-pre-wrap font-mono text-sm">{post.caption}</p>
              </div>
            )}

            {post.is_carousel && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                <p className="mt-1">🎠 Carrossel com {post.slides?.length || 0} slides</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/posts')}
          >
            Voltar para Posts
          </Button>
        </div>
      </div>
    </div>
  )
}

