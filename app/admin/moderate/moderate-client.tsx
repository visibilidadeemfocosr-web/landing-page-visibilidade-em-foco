'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  CheckCircle2, 
  XCircle, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  Instagram,
  Facebook,
  Linkedin,
  Eye,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Artist {
  submission_id: string
  name: string
  bio: string
  original_bio: string
  photo: string | null
  main_artistic_language: string
  other_artistic_languages: string
  instagram: string
  facebook: string
  linkedin: string
  status: 'pending' | 'approved' | 'rejected' | 'published'
  moderator_notes: string | null
}

export default function AdminModerateClient() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBio, setEditingBio] = useState<string | null>(null)
  const [editedBio, setEditedBio] = useState<string>('')
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadArtists()
  }, [])

  const loadArtists = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/moderate')
      if (!response.ok) throw new Error('Erro ao carregar artistas')
      const data = await response.json()
      setArtists(data.artists || [])
    } catch (error: any) {
      toast.error('Erro ao carregar artistas: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected', editedBioText?: string) => {
    setSaving(submissionId)
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          status: newStatus,
          edited_bio: editedBioText || undefined,
        }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')

      toast.success(`Artista ${newStatus === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`)
      await loadArtists()
      setEditingBio(null)
      setSelectedArtist(null)
    } catch (error: any) {
      toast.error('Erro ao atualizar status: ' + error.message)
    } finally {
      setSaving(null)
    }
  }

  const handleEditBio = (artist: Artist) => {
    setEditingBio(artist.submission_id)
    setEditedBio(artist.bio || artist.original_bio)
    setSelectedArtist(artist)
  }

  const handleSaveBio = async (submissionId: string) => {
    setSaving(submissionId)
    try {
      const response = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          status: artists.find(a => a.submission_id === submissionId)?.status || 'pending',
          edited_bio: editedBio,
        }),
      })

      if (!response.ok) throw new Error('Erro ao salvar bio')

      toast.success('Biografia salva com sucesso!')
      await loadArtists()
      setEditingBio(null)
      setSelectedArtist(null)
    } catch (error: any) {
      toast.error('Erro ao salvar bio: ' + error.message)
    } finally {
      setSaving(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingBio(null)
    setEditedBio('')
    setSelectedArtist(null)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; label: string }> = {
      pending: { 
        className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', 
        label: 'Pendente' 
      },
      approved: { 
        className: 'bg-green-100 text-green-800 hover:bg-green-200', 
        label: 'Aprovado' 
      },
      rejected: { 
        className: 'bg-red-100 text-red-800 hover:bg-red-200', 
        label: 'Rejeitado' 
      },
      published: { 
        className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', 
        label: 'Publicado' 
      },
    }
    const config = statusConfig[status] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const generateInstagramCaption = (artist: Artist) => {
    const lines: string[] = []
    lines.push(artist.name)
    lines.push('')
    
    if (artist.main_artistic_language) {
      lines.push(`Linguagem Principal: ${artist.main_artistic_language}`)
    }
    if (artist.other_artistic_languages) {
      lines.push(`Outras Linguagens: ${artist.other_artistic_languages}`)
    }
    if (artist.main_artistic_language || artist.other_artistic_languages) {
      lines.push('')
    }
    
    lines.push(artist.bio || artist.original_bio)
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━')
    lines.push('')
    lines.push('Entre em contato:')
    lines.push('')
    
    if (artist.instagram) {
      lines.push(`Instagram: ${artist.instagram}`)
    }
    if (artist.facebook) {
      lines.push(`Facebook: ${artist.facebook}`)
    }
    if (artist.linkedin) {
      lines.push(`LinkedIn: ${artist.linkedin}`)
    }
    
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━')
    lines.push('')
    lines.push('#VisibilidadeEmFoco #SãoRoque #ArteLGBTQIA+')
    
    return lines.join('\n')
  }

  const handleCopyCaption = (artist: Artist) => {
    const caption = generateInstagramCaption(artist)
    navigator.clipboard.writeText(caption)
    toast.success('Legenda copiada para a área de transferência!')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  const pendingArtists = artists.filter(a => a.status === 'pending')
  const approvedArtists = artists.filter(a => a.status === 'approved')
  const rejectedArtists = artists.filter(a => a.status === 'rejected')
  const publishedArtists = artists.filter(a => a.status === 'published')

  // Filtrar artistas por status
  const filteredArtists = statusFilter === 'all' 
    ? artists 
    : artists.filter(artist => artist.status === statusFilter)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Moderação de Artistas</h1>
        <p className="text-muted-foreground">
          Gerencie os artistas que desejam fazer parte da rede social
        </p>
      </div>

      {/* Filtros por Status */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
          size="sm"
        >
          Todos ({artists.length})
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('pending')}
          size="sm"
        >
          Pendentes ({pendingArtists.length})
        </Button>
        <Button
          variant={statusFilter === 'approved' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('approved')}
          size="sm"
        >
          Aprovados ({approvedArtists.length})
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('rejected')}
          size="sm"
        >
          Rejeitados ({rejectedArtists.length})
        </Button>
        <Button
          variant={statusFilter === 'published' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('published')}
          size="sm"
        >
          Publicados ({publishedArtists.length})
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{pendingArtists.length}</div>
            <p className="text-sm text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{approvedArtists.length}</div>
            <p className="text-sm text-muted-foreground">Aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{rejectedArtists.length}</div>
            <p className="text-sm text-muted-foreground">Rejeitados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{publishedArtists.length}</div>
            <p className="text-sm text-muted-foreground">Publicados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Artistas */}
      <div className="space-y-4">
        {filteredArtists.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              {statusFilter === 'all' 
                ? 'Nenhum artista encontrado' 
                : `Nenhum artista ${
                    statusFilter === 'pending' ? 'pendente' : 
                    statusFilter === 'approved' ? 'aprovado' : 
                    statusFilter === 'rejected' ? 'rejeitado' : 'publicado'
                  } encontrado`}
            </CardContent>
          </Card>
        ) : (
          filteredArtists.map((artist) => (
            <Card key={artist.submission_id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {artist.photo && (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
                        <img
                          src={artist.photo}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-xl">{artist.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {getStatusBadge(artist.status)}
                        {artist.main_artistic_language && (
                          <Badge variant="outline" className="max-w-full whitespace-normal text-left">{artist.main_artistic_language}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/moderate-preview?submission_id=${artist.submission_id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCaption(artist)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Legenda
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Linguagens Artísticas */}
                {(artist.main_artistic_language || artist.other_artistic_languages) && (
                  <div className="flex flex-wrap gap-2">
                    {artist.main_artistic_language && (
                      <Badge variant="default">Principal: {artist.main_artistic_language}</Badge>
                    )}
                    {artist.other_artistic_languages && (
                      <Badge variant="outline">Outras: {artist.other_artistic_languages}</Badge>
                    )}
                  </div>
                )}

                {/* Bio */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Biografia</Label>
                    {editingBio !== artist.submission_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBio(artist)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                  {editingBio === artist.submission_id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveBio(artist.submission_id)}
                          disabled={saving === artist.submission_id}
                        >
                          {saving === artist.submission_id ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {artist.bio || artist.original_bio || 'Sem biografia'}
                    </p>
                  )}
                </div>

                {/* Redes Sociais */}
                {(artist.instagram || artist.facebook || artist.linkedin) && (
                  <div className="flex flex-wrap gap-2">
                    {artist.instagram && (
                      <Badge variant="outline" className="gap-1">
                        <Instagram className="w-3 h-3" />
                        {artist.instagram}
                      </Badge>
                    )}
                    {artist.facebook && (
                      <Badge variant="outline" className="gap-1">
                        <Facebook className="w-3 h-3" />
                        Facebook
                      </Badge>
                    )}
                    {artist.linkedin && (
                      <Badge variant="outline" className="gap-1">
                        <Linkedin className="w-3 h-3" />
                        LinkedIn
                      </Badge>
                    )}
                  </div>
                )}

                {/* Ações */}
                {artist.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => handleStatusChange(artist.submission_id, 'approved', artist.bio || artist.original_bio)}
                      disabled={saving === artist.submission_id}
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      {saving === artist.submission_id ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                      )}
                      Aprovar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusChange(artist.submission_id, 'rejected')}
                      disabled={saving === artist.submission_id}
                      size="lg"
                      className="flex-1 bg-red-600 hover:bg-red-700 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                      {saving === artist.submission_id ? (
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-2" />
                      )}
                      Rejeitar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

