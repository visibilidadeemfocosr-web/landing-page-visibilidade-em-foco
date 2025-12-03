'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowLeft, 
  Save, 
  Send,
  Loader2,
  Download,
  Copy,
  Plus,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'
import type { LogoPosition, LogoSize, LogoVariant, DecorativeEffect, InstagramPost, InstagramPostSlide } from '@/lib/supabase/types'
import { Switch } from '@/components/ui/switch'

interface PostData {
  isCarousel: boolean
  slides: InstagramPostSlide[]
  currentSlideIndex: number
  // Configurações globais (aplicam a todos os slides)
  backgroundColor: string
  textColor: string
  logoPosition: LogoPosition
  logoSize: LogoSize
  logoVariant: LogoVariant
  decorativeEffect: DecorativeEffect
  caption: string
}

export function CreatePostClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const template = searchParams.get('template') || 'chamamento'
  const previewRef = useRef<HTMLDivElement>(null)
  
  const [postData, setPostData] = useState<PostData>({
    isCarousel: false,
    slides: [
      {
        order: 1,
        title: 'PARTICIPE DO MAPEAMENTO',
        subtitle: 'Artistas LGBTQIA+ de São Roque',
        description: 'Compartilhe sua história e faça parte deste projeto histórico de visibilidade!',
        ctaText: 'CADASTRE-SE AGORA',
        ctaLink: '',
        periodText: '08/12/2025 até 08/02/2026',
        tagText: 'VFSR • São Roque',
      }
    ],
    currentSlideIndex: 0,
    backgroundColor: '#f8f9fa',
    textColor: '#1f2937',
    logoPosition: 'topo-direita',
    logoSize: 'media',
    logoVariant: 'black',
    decorativeEffect: 'none',
    caption: '',
  })
  
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  // Atualizar campo
  const updateField = <K extends keyof PostData>(field: K, value: PostData[K]) => {
    setPostData(prev => ({ ...prev, [field]: value }))
  }
  
  // Funções de gerenciamento de slides
  const currentSlide = postData.slides[postData.currentSlideIndex]
  
  const updateSlide = <K extends keyof InstagramPostSlide>(field: K, value: InstagramPostSlide[K]) => {
    setPostData(prev => ({
      ...prev,
      slides: prev.slides.map((slide, idx) =>
        idx === prev.currentSlideIndex ? { ...slide, [field]: value } : slide
      )
    }))
  }
  
  const addSlide = () => {
    if (postData.slides.length >= 10) {
      toast.error('Máximo de 10 slides permitidos')
      return
    }
    
    const newSlide: InstagramPostSlide = {
      order: postData.slides.length + 1,
      title: '',
      subtitle: '',
      description: '',
    }
    
    setPostData(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      currentSlideIndex: prev.slides.length
    }))
  }
  
  const removeSlide = (index: number) => {
    if (postData.slides.length <= 1) {
      toast.error('É necessário pelo menos 1 slide')
      return
    }
    
    setPostData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, idx) => idx !== index).map((slide, idx) => ({
        ...slide,
        order: idx + 1
      })),
      currentSlideIndex: Math.min(prev.currentSlideIndex, prev.slides.length - 2)
    }))
  }
  
  const goToSlide = (index: number) => {
    setPostData(prev => ({
      ...prev,
      currentSlideIndex: Math.max(0, Math.min(index, prev.slides.length - 1))
    }))
  }
  
  const toggleCarousel = (enabled: boolean) => {
    if (enabled && postData.slides.length === 1) {
      // Adicionar segundo slide ao ativar carrossel
      const newSlide: InstagramPostSlide = {
        order: 2,
        title: '',
        subtitle: '',
        description: '',
      }
      setPostData(prev => ({
        ...prev,
        isCarousel: true,
        slides: [...prev.slides, newSlide]
      }))
    } else {
      setPostData(prev => ({
        ...prev,
        isCarousel: enabled
      }))
    }
  }
  
  // Gerar legenda automática baseada no Slide 1
  useEffect(() => {
    const slide1 = postData.slides[0]
    const caption = `${slide1.title || ''}

${slide1.subtitle || ''}

${slide1.description || ''}

${slide1.periodText ? `📅 ${slide1.periodText}` : ''}

${slide1.ctaLink ? `🔗 ${slide1.ctaLink}` : ''}

#VisibilidadeEmFoco #LGBTQIA #SaoRoque #ArteLGBT #Diversidade #RepresentaçãoImporta`
    
    updateField('caption', caption.trim())
  }, [postData.slides[0]?.title, postData.slides[0]?.subtitle, postData.slides[0]?.description, postData.slides[0]?.periodText, postData.slides[0]?.ctaLink])
  
  // Salvar como rascunho
  const handleSaveDraft = async () => {
    try {
      setSaving(true)
      
      const response = await fetch('/api/instagram-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_type: template,
          is_carousel: postData.isCarousel,
          slides: postData.slides,
          title: postData.slides[0]?.title,
          subtitle: postData.slides[0]?.subtitle,
          description: postData.slides[0]?.description,
          cta_text: postData.slides[0]?.ctaText,
          cta_link: postData.slides[0]?.ctaLink,
          period_text: postData.slides[0]?.periodText,
          tag_text: postData.slides[0]?.tagText,
          caption: postData.caption,
          content: {
            backgroundColor: postData.backgroundColor,
            textColor: postData.textColor,
            logoPosition: postData.logoPosition,
            logoSize: postData.logoSize,
            logoVariant: postData.logoVariant,
            decorativeEffect: postData.decorativeEffect,
          },
          status: 'draft',
        }),
      })
      
      if (!response.ok) throw new Error('Erro ao salvar rascunho')
      
      const data = await response.json()
      toast.success('Rascunho salvo com sucesso!')
      router.push(`/admin/posts/${data.id}`)
    } catch (error) {
      console.error('Erro ao salvar:', error)
      toast.error('Erro ao salvar rascunho')
    } finally {
      setSaving(false)
    }
  }
  
  // Gerar imagem
  const generateImage = async (): Promise<string> => {
    if (!previewRef.current) throw new Error('Preview não encontrado')
    
    setGenerating(true)
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true,
      })
      
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Erro ao gerar imagem:', error)
      throw error
    } finally {
      setGenerating(false)
    }
  }
  
  // Download da imagem
  const handleDownload = async () => {
    try {
      const dataUrl = await generateImage()
      const link = document.createElement('a')
      link.download = `post-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      toast.success('Imagem baixada com sucesso!')
    } catch (error) {
      toast.error('Erro ao gerar imagem')
    }
  }
  
  // Copiar legenda
  const handleCopyCaption = () => {
    navigator.clipboard.writeText(postData.caption)
    toast.success('Legenda copiada!')
  }
  
  // Publicar no Instagram
  const handlePublish = async () => {
    try {
      setPublishing(true)
      
      // 1. Gerar imagem
      toast.info('Gerando imagem...')
      const imageDataUrl = await generateImage()
      
      // 2. Converter para blob
      const response = await fetch(imageDataUrl)
      const blob = await response.blob()
      
      // 3. Upload para Supabase
      toast.info('Fazendo upload...')
      const fileName = `post-${Date.now()}.png`
      const formData = new FormData()
      formData.append('file', blob, fileName)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadResponse.ok) throw new Error('Erro no upload')
      
      const { url: imageUrl } = await uploadResponse.json()
      
      // 4. Criar post no banco
      toast.info('Criando post...')
      const createResponse = await fetch('/api/instagram-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_type: template,
          is_carousel: postData.isCarousel,
          slides: postData.slides,
          title: postData.slides[0]?.title,
          subtitle: postData.slides[0]?.subtitle,
          description: postData.slides[0]?.description,
          cta_text: postData.slides[0]?.ctaText,
          cta_link: postData.slides[0]?.ctaLink,
          period_text: postData.slides[0]?.periodText,
          tag_text: postData.slides[0]?.tagText,
          caption: postData.caption,
          image_url: imageUrl,
          content: {
            backgroundColor: postData.backgroundColor,
            textColor: postData.textColor,
            logoPosition: postData.logoPosition,
            logoSize: postData.logoSize,
            logoVariant: postData.logoVariant,
            decorativeEffect: postData.decorativeEffect,
          },
          status: 'draft',
        }),
      })
      
      if (!createResponse.ok) throw new Error('Erro ao criar post')
      
      const post = await createResponse.json()
      
      // 5. Publicar no Instagram
      toast.info('Publicando no Instagram...')
      const publishResponse = await fetch(`/api/instagram-posts/${post.id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          caption: postData.caption,
        }),
      })
      
      if (!publishResponse.ok) {
        const error = await publishResponse.json()
        throw new Error(error.error || 'Erro ao publicar')
      }
      
      toast.success('Post publicado com sucesso no Instagram!')
      router.push('/admin/posts')
    } catch (error: any) {
      console.error('Erro ao publicar:', error)
      toast.error(error.message || 'Erro ao publicar post')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/posts/new')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Post de Chamamento</h1>
            <p className="text-muted-foreground mt-1">
              Personalize seu post e publique no Instagram
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={saving || publishing}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Salvar Rascunho
              </>
            )}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={saving || publishing || generating}
          >
            {publishing ? (
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
        </div>
      </div>

      {/* Grid: Preview + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  Preview
                  {postData.isCarousel && (
                    <span className="text-xs font-normal text-muted-foreground">
                      ({postData.currentSlideIndex + 1}/{postData.slides.length})
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={generating}
                >
                  {generating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </>
                  )}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Navegação de Slides no Preview */}
              {postData.isCarousel && postData.slides.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => goToSlide(postData.currentSlideIndex - 1)}
                    disabled={postData.currentSlideIndex === 0}
                  >
                    ← Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {postData.currentSlideIndex + 1} / {postData.slides.length}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => goToSlide(postData.currentSlideIndex + 1)}
                    disabled={postData.currentSlideIndex === postData.slides.length - 1}
                  >
                    Próximo →
                  </Button>
                </div>
              )}
              
              <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                <PostPreview ref={previewRef} slide={currentSlide} globalSettings={postData} />
              </div>
            </CardContent>
          </Card>

          {/* Legenda */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Legenda do Instagram
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCaption}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {postData.isCarousel && postData.slides.length > 1 && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border border-dashed">
                  💡 <strong>Dica:</strong> A legenda é gerada automaticamente com base no <strong>Slide 1</strong>. Você pode editar livremente o texto abaixo.
                </div>
              )}
              <Textarea
                value={postData.caption}
                onChange={(e) => updateField('caption', e.target.value)}
                rows={10}
                className="font-mono text-sm resize-none"
                placeholder="Digite a legenda do post..."
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{postData.caption.length} caracteres (máx: 2.200)</span>
                <span>Hashtags: {(postData.caption.match(/#/g) || []).length}/30</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="space-y-4">
          {/* Conteúdo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Conteúdo
                <div className="flex items-center gap-2 text-sm font-normal">
                  <Label htmlFor="carousel-toggle" className="cursor-pointer">
                    {postData.isCarousel ? '🎠 Carrossel' : '📄 Post Único'}
                  </Label>
                  <Switch
                    id="carousel-toggle"
                    checked={postData.isCarousel}
                    onCheckedChange={toggleCarousel}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Gerenciamento de Slides */}
              {postData.isCarousel && (
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Slides do Carrossel</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSlide}
                      disabled={postData.slides.length >= 10}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Slide
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    {postData.slides.map((slide, idx) => (
                      <div key={idx} className="relative">
                        <Button
                          type="button"
                          variant={idx === postData.currentSlideIndex ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => goToSlide(idx)}
                          className="min-w-[80px]"
                        >
                          Slide {idx + 1}
                        </Button>
                        {postData.slides.length > 1 && (
                          <button
                            type="button"
                            className="absolute -top-3 -right-3 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center justify-center z-10"
                            style={{ width: '8px', height: '8px' }}
                            onClick={() => removeSlide(idx)}
                          >
                            <X style={{ width: '6px', height: '6px' }} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Editando Slide {postData.currentSlideIndex + 1} de {postData.slides.length}
                    {postData.slides.length < 10 && ` • Máximo: 10 slides`}
                  </p>
                </div>
              )}
              
              {/* Campos do Slide Atual */}
              <div className="space-y-2">
                <Label htmlFor="title">Título Principal *</Label>
                <Input
                  id="title"
                  value={currentSlide.title || ''}
                  onChange={(e) => updateSlide('title', e.target.value)}
                  placeholder="Ex: PARTICIPE DO MAPEAMENTO"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtítulo</Label>
                <Input
                  id="subtitle"
                  value={currentSlide.subtitle || ''}
                  onChange={(e) => updateSlide('subtitle', e.target.value)}
                  placeholder="Ex: Artistas LGBTQIA+ de São Roque"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={currentSlide.description || ''}
                  onChange={(e) => updateSlide('description', e.target.value)}
                  rows={3}
                  placeholder="Texto explicativo sobre o chamamento"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaText">Texto do Botão (CTA)</Label>
                <Input
                  id="ctaText"
                  value={currentSlide.ctaText || ''}
                  onChange={(e) => updateSlide('ctaText', e.target.value)}
                  placeholder="Ex: CADASTRE-SE AGORA"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ctaLink">Link do Botão</Label>
                <Input
                  id="ctaLink"
                  type="url"
                  value={currentSlide.ctaLink || ''}
                  onChange={(e) => updateSlide('ctaLink', e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodText">Período</Label>
                <Input
                  id="periodText"
                  value={currentSlide.periodText || ''}
                  onChange={(e) => updateSlide('periodText', e.target.value)}
                  placeholder="Ex: 08/12/2025 até 08/02/2026"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagText">Tag do Projeto (Opcional)</Label>
                <Input
                  id="tagText"
                  value={currentSlide.tagText || ''}
                  onChange={(e) => updateSlide('tagText', e.target.value)}
                  placeholder="Ex: VFSR • São Roque (deixe vazio para não exibir)"
                />
                <p className="text-xs text-muted-foreground">
                  Aparece no canto do post (oposto à logo). Pode ser diferente em cada slide.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Design */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Design</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={postData.backgroundColor}
                      onChange={(e) => updateField('backgroundColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={postData.backgroundColor}
                      onChange={(e) => updateField('backgroundColor', e.target.value)}
                      placeholder="#FF5722"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={postData.textColor}
                      onChange={(e) => updateField('textColor', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={postData.textColor}
                      onChange={(e) => updateField('textColor', e.target.value)}
                      placeholder="#FFFFFF"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Posição da Logo */}
              <div className="space-y-3">
                <Label>Posição da Logo</Label>
                <RadioGroup
                  value={postData.logoPosition}
                  onValueChange={(value) => updateField('logoPosition', value as LogoPosition)}
                >
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'topo-esquerda', label: '↖️ Topo Esq.' },
                      { value: 'topo-centro', label: '⬆️ Topo Centro' },
                      { value: 'topo-direita', label: '↗️ Topo Dir.' },
                      { value: 'centro-esquerda', label: '⬅️ Centro Esq.' },
                      { value: 'centro', label: '⚫ Centro' },
                      { value: 'centro-direita', label: '➡️ Centro Dir.' },
                      { value: 'rodape-esquerda', label: '↙️ Rodapé Esq.' },
                      { value: 'rodape-centro', label: '⬇️ Rodapé Centro' },
                      { value: 'rodape-direita', label: '↘️ Rodapé Dir.' },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <Label htmlFor={option.value} className="text-xs cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Tamanho da Logo */}
              <div className="space-y-3">
                <Label>Tamanho da Logo</Label>
                <RadioGroup
                  value={postData.logoSize}
                  onValueChange={(value) => updateField('logoSize', value as LogoSize)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pequena" id="pequena" />
                    <Label htmlFor="pequena" className="cursor-pointer">Pequena</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="media" id="media" />
                    <Label htmlFor="media" className="cursor-pointer">Média</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="grande" id="grande" />
                    <Label htmlFor="grande" className="cursor-pointer">Grande</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Variante da Logo */}
              <div className="space-y-3">
                <Label>Versão da Logo</Label>
                <RadioGroup
                  value={postData.logoVariant}
                  onValueChange={(value) => updateField('logoVariant', value as LogoVariant)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="black" id="logo-black" />
                    <Label htmlFor="logo-black" className="cursor-pointer flex-1">
                      <div className="font-medium">Preta</div>
                      <div className="text-xs text-muted-foreground">logoN.png</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="color" id="logo-color" />
                    <Label htmlFor="logo-color" className="cursor-pointer flex-1">
                      <div className="font-medium">Colorida</div>
                      <div className="text-xs text-muted-foreground">Sólida</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="gradient" id="logo-gradient" />
                    <Label htmlFor="logo-gradient" className="cursor-pointer flex-1">
                      <div className="font-medium">Gradiente</div>
                      <div className="text-xs text-muted-foreground">Colorida</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="white" id="logo-white" />
                    <Label htmlFor="logo-white" className="cursor-pointer flex-1">
                      <div className="font-medium">Branca</div>
                      <div className="text-xs text-muted-foreground">Fundos escuros</div>
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-muted-foreground">
                  Escolha a versão que melhor combina com a cor de fundo
                </p>
              </div>

              {/* Efeitos Decorativos */}
              <div className="space-y-3">
                <Label>Efeitos Decorativos</Label>
                <RadioGroup
                  value={postData.decorativeEffect}
                  onValueChange={(value) => updateField('decorativeEffect', value as DecorativeEffect)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="none" id="effect-none" />
                    <Label htmlFor="effect-none" className="cursor-pointer flex-1">
                      <div className="font-medium">Nenhum</div>
                      <div className="text-xs text-muted-foreground">Fundo sólido</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="gradient" id="effect-gradient" />
                    <Label htmlFor="effect-gradient" className="cursor-pointer flex-1">
                      <div className="font-medium">Gradiente</div>
                      <div className="text-xs text-muted-foreground">Suave e elegante</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="blobs" id="effect-blobs" />
                    <Label htmlFor="effect-blobs" className="cursor-pointer flex-1">
                      <div className="font-medium">Blobs</div>
                      <div className="text-xs text-muted-foreground">Formas orgânicas</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="grid" id="effect-grid" />
                    <Label htmlFor="effect-grid" className="cursor-pointer flex-1">
                      <div className="font-medium">Grid</div>
                      <div className="text-xs text-muted-foreground">Padrão de pontos</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Componente de Preview
import { forwardRef } from 'react'

interface PostPreviewProps {
  slide: InstagramPostSlide
  globalSettings: PostData
}

const PostPreview = forwardRef<HTMLDivElement, PostPreviewProps>(({ slide, globalSettings }, ref) => {
  const logoSizes = {
    pequena: 60,
    media: 80,
    grande: 120,
  }
  
  const logoSize = logoSizes[globalSettings.logoSize]
  
  // Mapear variante para arquivo da logo
  const getLogoFile = () => {
    switch (globalSettings.logoVariant) {
      case 'black':
        return '/logoN.png'
      case 'color':
        return '/logo-color.png'
      case 'gradient':
        return '/logo-gradient.png'
      case 'white':
        return '/logo-white.png'
      default:
        return '/logoN.png'
    }
  }
  
  // Determinar posição da logo
  const getLogoStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${logoSize}px`,
      height: `${logoSize}px`,
    }
    
    switch (globalSettings.logoPosition) {
      case 'topo-esquerda':
        return { ...baseStyle, top: '20px', left: '20px' }
      case 'topo-centro':
        return { ...baseStyle, top: '20px', left: '50%', transform: 'translateX(-50%)' }
      case 'topo-direita':
        return { ...baseStyle, top: '20px', right: '20px' }
      case 'centro-esquerda':
        return { ...baseStyle, top: '50%', left: '20px', transform: 'translateY(-50%)' }
      case 'centro':
        return { ...baseStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
      case 'centro-direita':
        return { ...baseStyle, top: '50%', right: '20px', transform: 'translateY(-50%)' }
      case 'rodape-esquerda':
        return { ...baseStyle, bottom: '20px', left: '20px' }
      case 'rodape-centro':
        return { ...baseStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)' }
      case 'rodape-direita':
        return { ...baseStyle, bottom: '20px', right: '20px' }
      default:
        return { ...baseStyle, top: '20px', right: '20px' }
    }
  }
  
  // Renderizar efeitos decorativos
  const renderDecorativeEffect = () => {
    switch (globalSettings.decorativeEffect) {
      case 'gradient':
        return (
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${globalSettings.backgroundColor} 0%, ${adjustColor(globalSettings.backgroundColor, -20)} 100%)`,
            }}
          />
        )
      
      case 'blobs':
        return (
          <>
            {/* Blob 1 - Topo Esquerda */}
            <div 
              className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-40 animate-pulse"
              style={{ 
                backgroundColor: '#E0E7FF',
                animationDuration: '4s'
              }}
            />
            
            {/* Blob 2 - Topo Direita */}
            <div 
              className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-35 animate-pulse"
              style={{ 
                backgroundColor: '#FCE7F3',
                animationDuration: '5s',
                animationDelay: '1s'
              }}
            />
            
            {/* Blob 3 - Centro Esquerda */}
            <div 
              className="absolute top-1/3 -left-24 w-64 h-64 rounded-full blur-3xl opacity-30 animate-pulse"
              style={{ 
                backgroundColor: '#DBEAFE',
                animationDuration: '6s',
                animationDelay: '2s'
              }}
            />
            
            {/* Blob 4 - Centro Direita */}
            <div 
              className="absolute top-1/2 -right-24 w-72 h-72 rounded-full blur-3xl opacity-38 animate-pulse"
              style={{ 
                backgroundColor: '#FEF3C7',
                animationDuration: '5.5s',
                animationDelay: '0.5s'
              }}
            />
            
            {/* Blob 5 - Base Esquerda */}
            <div 
              className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full blur-3xl opacity-32 animate-pulse"
              style={{ 
                backgroundColor: '#E9D5FF',
                animationDuration: '7s',
                animationDelay: '1.5s'
              }}
            />
            
            {/* Blob 6 - Base Direita */}
            <div 
              className="absolute -bottom-20 -right-32 w-80 h-80 rounded-full blur-3xl opacity-36 animate-pulse"
              style={{ 
                backgroundColor: '#CCFBF1',
                animationDuration: '6.5s',
                animationDelay: '3s'
              }}
            />
          </>
        )
      
      case 'grid':
        return (
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle, ${globalSettings.textColor} 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        )
      
      default:
        return null
    }
  }
  
  // Função auxiliar para ajustar cor (mais clara ou mais escura)
  const adjustColor = (color: string, amount: number) => {
    const hex = color.replace('#', '')
    const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount))
    const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount))
    const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount))
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }
  
  return (
    <div
      ref={ref}
      className="w-full h-full relative flex flex-col items-center justify-center p-8 pb-20 overflow-hidden"
      style={{
        backgroundColor: globalSettings.backgroundColor,
        color: globalSettings.textColor,
      }}
    >
      {/* Efeitos decorativos de fundo */}
      {renderDecorativeEffect()}
      
      {/* Logo */}
      <div style={{...getLogoStyle(), zIndex: 10}}>
        <img
          src={getLogoFile()}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Conteúdo */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-[90%] relative z-10">
        {/* Título */}
        {slide.title && (
          <h1 
            className="font-black leading-tight"
            style={{ 
              fontSize: slide.title.length > 30 ? '2rem' : '2.5rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            {slide.title}
          </h1>
        )}
        
        {/* Linha decorativa */}
        {slide.title && (
          <div 
            className="w-24 h-1"
            style={{ 
              backgroundColor: globalSettings.textColor,
              opacity: 0.5
            }}
          />
        )}
        
        {/* Subtítulo */}
        {slide.subtitle && (
          <h2 
            className="font-semibold text-xl"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            {slide.subtitle}
          </h2>
        )}
        
        {/* Descrição */}
        {slide.description && (
          <p 
            className="text-lg leading-relaxed max-w-md"
            style={{ 
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            {slide.description}
          </p>
        )}
        
        {/* Período */}
        {slide.periodText && (
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `${globalSettings.textColor}20`,
              border: `2px solid ${globalSettings.textColor}`,
              color: globalSettings.textColor,
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x2="16" y1="2" y2="6"/>
              <line x1="8" x2="8" y1="2" y2="6"/>
              <line x1="3" x2="21" y1="10" y2="10"/>
            </svg>
            <span>{slide.periodText}</span>
          </div>
        )}
        
        {/* CTA Button */}
        {slide.ctaText && (
          <div 
            className="px-8 py-4 rounded-full font-bold text-lg shadow-lg transform hover:scale-105 transition-transform"
            style={{
              backgroundColor: globalSettings.textColor,
              color: globalSettings.backgroundColor,
            }}
          >
            {slide.ctaText}
          </div>
        )}
      </div>
      
      {/* Tag do projeto no canto oposto da logo */}
      {slide.tagText && globalSettings.logoPosition.includes('topo') && (
        <div 
          className="absolute bottom-24 right-6 text-xs font-semibold px-3 py-1 rounded z-20"
          style={{
            backgroundColor: `${globalSettings.textColor}20`,
            color: globalSettings.textColor,
          }}
        >
          {slide.tagText}
        </div>
      )}
      {slide.tagText && globalSettings.logoPosition.includes('rodape') && (
        <div 
          className="absolute top-6 right-6 text-xs font-semibold px-3 py-1 rounded z-20"
          style={{
            backgroundColor: `${globalSettings.textColor}20`,
            color: globalSettings.textColor,
          }}
        >
          {slide.tagText}
        </div>
      )}

      {/* Logos de Apoio e Realização - Rodapé Fixo */}
      <div 
        className="absolute bottom-0 left-0 right-0 py-3 px-4 flex items-center justify-center gap-3 border-t"
        style={{
          backgroundColor: `${globalSettings.textColor}08`,
          borderColor: `${globalSettings.textColor}15`,
          zIndex: 20,
        }}
      >
        <img
          src="/prefeitura.png"
          alt="Prefeitura de São Roque"
          className="h-8 w-auto object-contain opacity-80"
        />
        <img
          src="/pnab.png"
          alt="PNAB"
          className="h-10 w-auto object-contain opacity-80"
        />
      </div>
    </div>
  )
})

PostPreview.displayName = 'PostPreview'

