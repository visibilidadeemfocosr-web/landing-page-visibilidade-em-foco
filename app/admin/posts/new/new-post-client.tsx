'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Megaphone, Palette, Calendar, Quote, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { InstagramPostTemplateType } from '@/lib/supabase/types'

const templates: Array<{
  type: InstagramPostTemplateType
  icon: React.ElementType
  title: string
  description: string
  color: string
}> = [
  {
    type: 'chamamento',
    icon: Megaphone,
    title: 'Chamamento/Divulgação',
    description: 'Post para convocar participação ou divulgar informações importantes',
    color: 'from-orange-500 to-red-500',
  },
  {
    type: 'artista',
    icon: Palette,
    title: 'Perfil de Artista',
    description: 'Post automático gerado pela moderação de artistas',
    color: 'from-purple-500 to-pink-500',
  },
  {
    type: 'evento',
    icon: Calendar,
    title: 'Evento',
    description: 'Divulgação de eventos, apresentações e atividades',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    type: 'citacao',
    icon: Quote,
    title: 'Citação',
    description: 'Post com frase inspiradora ou citação relevante',
    color: 'from-green-500 to-teal-500',
  },
  {
    type: 'livre',
    icon: ImageIcon,
    title: 'Post Livre',
    description: 'Upload de imagem personalizada com legenda',
    color: 'from-gray-500 to-slate-500',
  },
]

export default function NewPostClient() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<InstagramPostTemplateType | null>(null)

  const handleSelectTemplate = (type: InstagramPostTemplateType) => {
    // Por enquanto, apenas o template "chamamento" está implementado
    if (type === 'chamamento') {
      router.push(`/admin/posts/create?template=${type}`)
    } else {
      // Futuros templates
      alert('Este template será implementado em breve!')
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/posts')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Novo Post</h1>
            <p className="text-muted-foreground mt-1">
              Escolha um template para começar
            </p>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const Icon = template.icon
            const isDisabled = template.type !== 'chamamento'
            
            return (
              <Card
                key={template.type}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.type ? 'ring-2 ring-primary' : ''
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && handleSelectTemplate(template.type)}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    {template.title}
                    {template.type === 'chamamento' && (
                      <span className="text-xs font-normal bg-primary/10 text-primary px-2 py-0.5 rounded">
                        Novo
                      </span>
                    )}
                    {isDisabled && (
                      <span className="text-xs font-normal bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        Em breve
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={selectedTemplate === template.type ? 'default' : 'outline'}
                    disabled={isDisabled}
                  >
                    {isDisabled ? 'Em breve' : 'Selecionar'}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Box */}
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary">💡</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Dica</p>
                <p className="text-sm text-muted-foreground">
                  Cada template foi criado para um tipo específico de conteúdo. Escolha o que melhor
                  se adequa à mensagem que você quer transmitir. Você poderá personalizar cores,
                  textos e posição da logo no próximo passo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

