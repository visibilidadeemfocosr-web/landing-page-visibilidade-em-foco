'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  FileText, 
  Calendar, 
  Trash2,
  Edit,
  Eye,
  Loader2,
  Send
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { InstagramPost } from '@/lib/supabase/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function PostsClient() {
  const router = useRouter()
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [publishing, setPublishing] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' 
        ? '/api/instagram-posts'
        : `/api/instagram-posts?status=${filter}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Erro ao buscar posts')
      
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Erro ao buscar posts:', error)
      toast.error('Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/instagram-posts/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Erro ao deletar post')
      
      toast.success('Post deletado com sucesso!')
      fetchPosts()
      setPostToDelete(null)
    } catch (error) {
      console.error('Erro ao deletar post:', error)
      toast.error('Erro ao deletar post')
    } finally {
      setDeleting(false)
    }
  }

  const handlePublish = async (post: InstagramPost) => {
    // Se não tiver imagem, abrir editor automaticamente
    if (!post.image_url) {
      toast.info('Abrindo editor para gerar imagem...')
      router.push(`/admin/posts/${post.id}/edit`)
      return
    }
    
    if (!confirm(`Publicar "${post.title}" no Instagram agora?`)) return
    
    try {
      setPublishing(post.id)
      toast.info('Publicando no Instagram...')
      
      const response = await fetch(`/api/instagram-posts/${post.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: post.image_url,
          caption: post.caption || '',
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao publicar')
      }
      
      toast.success('Post publicado no Instagram com sucesso! 🎉')
      fetchPosts()
    } catch (error: any) {
      console.error('Erro ao publicar:', error)
      toast.error(error.message || 'Erro ao publicar post')
    } finally {
      setPublishing(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      draft: { 
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
        label: 'Rascunho' 
      },
      published: { 
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
        label: 'Publicado' 
      },
    }
    const config = statusConfig[status] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getTemplateName = (type: string) => {
    const templates: Record<string, string> = {
      chamamento: '📢 Chamamento',
      artista: '🎨 Artista',
      evento: '🎭 Evento',
      citacao: '💬 Citação',
      livre: '📸 Livre',
    }
    return templates[type] || type
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true
    return post.status === filter
  })

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Posts Instagram</h1>
            <p className="text-muted-foreground mt-1">
              Crie e gerencie posts para o Instagram
            </p>
          </div>
          <Button onClick={() => router.push('/admin/posts/new')} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Novo Post
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos ({posts.length})
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Rascunhos ({posts.filter(p => p.status === 'draft').length})
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Publicados ({posts.filter(p => p.status === 'published').length})
          </Button>
        </div>

        {/* Lista de Posts */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nenhum post encontrado
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Crie seu primeiro post para começar
              </p>
              <Button onClick={() => router.push('/admin/posts/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {post.title || 'Sem título'}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {getTemplateName(post.template_type)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(post.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Preview da imagem */}
                  {post.image_url && (
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                      <img
                        src={Array.isArray(post.image_url) ? post.image_url[0] : post.image_url}
                        alt={post.title || 'Preview'}
                        className="w-full h-full object-cover"
                      />
                      {post.is_carousel && Array.isArray(post.image_url) && post.image_url.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                          🎠 {post.image_url.length} slides
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Descrição */}
                  {post.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.description}
                    </p>
                  )}
                  
                  {/* Data */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {post.published_at 
                      ? `Publicado em ${formatDate(post.published_at)}`
                      : `Criado em ${formatDate(post.created_at)}`
                    }
                  </div>
                  
                  {/* Ações */}
                  <div className="space-y-2 pt-2">
                    {post.status === 'draft' && (
                      <Button
                        className="w-full"
                        size="sm"
                        onClick={() => handlePublish(post)}
                        disabled={publishing === post.id}
                      >
                        {publishing === post.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publicando...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Publicar no Instagram
                          </>
                        )}
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/admin/posts/${post.id}`)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                        disabled={post.status === 'published'}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPostToDelete(post.id)}
                        disabled={post.status === 'published'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => postToDelete && handleDelete(postToDelete)}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

