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
import type { LogoPosition, LogoSize, LogoVariant, DecorativeEffect, InstagramPost, InstagramPostSlide, DecorativeElement, ElementPosition, ElementSize, ElementLayer } from '@/lib/supabase/types'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { decorativeElementsMap, decorativeElementsLabels } from '@/components/decorative-elements'

interface PostData {
  isCarousel: boolean
  slides: InstagramPostSlide[]
  currentSlideIndex: number
  // Configurações globais (aplicam a todos os slides)
  backgroundColor: string
  textColor: string
  titleColor: string
  subtitleColor: string
  descriptionColor: string
  logoPosition: LogoPosition
  logoSize: LogoSize
  logoVariant: LogoVariant
  decorativeEffect: DecorativeEffect
  caption: string
}

interface CreatePostClientProps {
  editPostId?: string
}

export function CreatePostClient({ editPostId }: CreatePostClientProps = {}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [template, setTemplate] = useState(searchParams.get('template') || 'chamamento')
  const previewRef = useRef<HTMLDivElement>(null)
  const [initialLoading, setInitialLoading] = useState(!!editPostId)
  
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
        decorativeElement: 'none',
        elementPosition: 'topo-direita',
        elementSize: 'medio',
        elementOpacity: 30,
        elementLayer: 'background',
      }
    ],
    currentSlideIndex: 0,
    backgroundColor: '#f8f9fa',
    textColor: '#1f2937',
    titleColor: '#1f2937',
    subtitleColor: '#4b5563',
    descriptionColor: '#6b7280',
    logoPosition: 'topo-direita',
    logoSize: 'media',
    logoVariant: 'black',
    decorativeEffect: 'none',
    caption: '',
  })
  
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  // Carregar dados do post se estiver em modo de edição
  useEffect(() => {
    if (editPostId) {
      loadPostData()
    }
  }, [editPostId])
  
  const loadPostData = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/instagram-posts/${editPostId}`)
      if (!response.ok) throw new Error('Post não encontrado')
      
      const post: InstagramPost = await response.json()
      
      setTemplate(post.template_type)
      setPostData({
        isCarousel: post.is_carousel || false,
        slides: post.slides || [{
          order: 1,
          title: post.title || '',
          subtitle: post.subtitle || '',
          description: post.description || '',
          ctaText: post.cta_text,
          ctaLink: post.cta_link,
          periodText: post.period_text,
          tagText: post.tag_text,
          decorativeElement: 'none',
          elementPosition: 'topo-direita',
          elementSize: 'medio',
          elementOpacity: 30,
          elementLayer: 'background',
        }],
        currentSlideIndex: 0,
        backgroundColor: post.content?.backgroundColor || '#f8f9fa',
        textColor: post.content?.textColor || '#1f2937',
        titleColor: post.content?.titleColor || '#1f2937',
        subtitleColor: post.content?.subtitleColor || '#4b5563',
        descriptionColor: post.content?.descriptionColor || '#6b7280',
        logoPosition: post.content?.logoPosition || 'topo-direita',
        logoSize: post.content?.logoSize || 'media',
        logoVariant: post.content?.logoVariant || 'black',
        decorativeEffect: post.content?.decorativeEffect || 'none',
        caption: post.caption || '',
      })
    } catch (error) {
      console.error('Erro ao carregar post:', error)
      toast.error('Erro ao carregar post')
      router.push('/admin/posts')
    } finally {
      setInitialLoading(false)
    }
  }
  
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
  
  // Salvar como rascunho (criar ou atualizar) com tentativa de geração de imagem
  const handleSaveDraft = async () => {
    try {
      setSaving(true)
      
      let imageUrl: string | string[] | null = null
      
      // Tentar gerar e fazer upload da imagem (opcional)
      // Para carrossel, só gera do slide atual ao salvar rascunho (usa Publicar para gerar todos)
      try {
        toast.info('Gerando imagem...')
        const imageDataUrl = await generateImage()
        
        if (imageDataUrl) {
          // Converter para blob
          const response = await fetch(imageDataUrl)
          const blob = await response.blob()
          
          // Upload para Supabase
          toast.info('Fazendo upload...')
          const fileName = `post-${Date.now()}.png`
          const formData = new FormData()
          formData.append('file', blob, fileName)
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json()
            // Se for carrossel, salvar como array (mesmo que seja 1 imagem por enquanto)
            imageUrl = postData.isCarousel ? [uploadData.url] : uploadData.url
          }
        }
      } catch (imageError) {
        console.warn('Não foi possível gerar imagem automaticamente:', imageError)
        // Continua salvando mesmo sem imagem
      }
      
      // Salvar post (com ou sem imagem)
      toast.info('Salvando post...')
      const url = editPostId ? `/api/instagram-posts/${editPostId}` : '/api/instagram-posts'
      const method = editPostId ? 'PUT' : 'POST'
      
      const saveResponse = await fetch(url, {
        method,
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
            titleColor: postData.titleColor,
            subtitleColor: postData.subtitleColor,
            descriptionColor: postData.descriptionColor,
            logoPosition: postData.logoPosition,
            logoSize: postData.logoSize,
            logoVariant: postData.logoVariant,
            decorativeEffect: postData.decorativeEffect,
          },
          status: 'draft',
        }),
      })
      
      if (!saveResponse.ok) throw new Error('Erro ao salvar rascunho')
      
      const data = await saveResponse.json()
      const successMessage = editPostId ? 'Post atualizado com sucesso!' : 'Rascunho salvo com sucesso!'
      
      if (!imageUrl) {
        toast.success(`${successMessage} Use o botão "Baixar" para gerar a imagem.`)
      } else {
        toast.success(successMessage)
      }
      
      router.push(`/admin/posts/${editPostId || data.id}`)
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      const errorMessage = error?.message || 'Erro ao salvar rascunho'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }
  
  // Gerar HTML do preview para enviar ao servidor
  const getPreviewHTML = (): string => {
    if (!previewRef.current) return ''
    return previewRef.current.outerHTML
  }
  
  // Gerar imagem
  const generateImage = async (): Promise<string | null> => {
    if (!previewRef.current) return null
    
    setGenerating(true)
    
    // USAR API SERVER-SIDE (Puppeteer) ao invés de html2canvas
    try {
      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  ${previewRef.current.outerHTML}
</body>
</html>`
      
      const response = await fetch('/api/admin/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, width: 1080, height: 1080 })
      })
      
      if (!response.ok) {
        throw new Error('Erro na API de geração')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      
      setGenerating(false)
      return url
    } catch (error) {
      console.error('Erro ao gerar com puppeteer, tentando html2canvas:', error)
      // Fallback para html2canvas se puppeteer falhar
    }
    
    setGenerating(true)
    
    // Suprimir erros oklch
    const originalError = console.error
    const originalWarn = console.warn
    
    console.error = (...args: any[]) => {
      const msg = String(args.join(' ')).toLowerCase()
      if (msg.includes('oklch') || msg.includes('unsupported color') || msg.includes('attempting to parse')) {
        return
      }
      originalError(...args)
    }
    
    console.warn = () => {}
    
    try {
      // Tentar gerar com html2canvas
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: postData.backgroundColor,
        logging: false,
        useCORS: true,
        allowTaint: true, // Permite renderizar mesmo com CORS
        foreignObjectRendering: false,
        ignoreElements: (element) => {
          return element.hasAttribute('data-sonner-toast') || element.hasAttribute('data-sonner-toaster')
        },
        onclone: (clonedDoc, element) => {
          // Ocultar toasts
          const toasts = clonedDoc.querySelectorAll('[data-sonner-toast], [data-sonner-toaster]')
          toasts.forEach((el) => (el as HTMLElement).style.display = 'none')
          
          // Copiar estilos computados como inline
          const allElements = clonedDoc.querySelectorAll('*')
          const originalElements = previewRef.current?.querySelectorAll('*') || []
          
          allElements.forEach((el, index) => {
            const htmlEl = el as HTMLElement
            const originalEl = originalElements[index]
            
            if (originalEl) {
              // Se elemento tem data-center-text, NÃO sobrescrever estilos!
              if (htmlEl.getAttribute('data-center-text') === 'true') {
                // Apenas copiar cores, não layout
                const cs = window.getComputedStyle(originalEl)
                htmlEl.style.color = cs.color
                htmlEl.style.backgroundColor = cs.backgroundColor
                htmlEl.style.background = cs.background
                htmlEl.style.borderColor = cs.borderColor
                return
              }
              
              const cs = window.getComputedStyle(originalEl)
              
              // PRESERVAR estilos inline ANTES de copiar
              const inlineDisplay = htmlEl.style.display
              const inlineAlignItems = htmlEl.style.alignItems
              const inlineJustifyContent = htmlEl.style.justifyContent
              const inlinePadding = htmlEl.style.padding
              const inlinePaddingTop = htmlEl.style.paddingTop
              const inlinePaddingBottom = htmlEl.style.paddingBottom
              
              // Copiar cssText completo
              try {
                htmlEl.style.cssText = cs.cssText
              } catch (e) {
                htmlEl.style.color = cs.color
                htmlEl.style.backgroundColor = cs.backgroundColor
                htmlEl.style.background = cs.background
                htmlEl.style.transform = cs.transform
                htmlEl.style.filter = cs.filter
                htmlEl.style.opacity = cs.opacity
                htmlEl.style.position = cs.position
                htmlEl.style.display = cs.display
              }
              
              // RESTAURAR estilos inline críticos para centralização
              if (inlineDisplay) htmlEl.style.display = inlineDisplay
              if (inlineAlignItems) htmlEl.style.alignItems = inlineAlignItems
              if (inlineJustifyContent) htmlEl.style.justifyContent = inlineJustifyContent
              if (inlinePadding) htmlEl.style.padding = inlinePadding
              if (inlinePaddingTop) htmlEl.style.paddingTop = inlinePaddingTop
              if (inlinePaddingBottom) htmlEl.style.paddingBottom = inlinePaddingBottom
            }
          })
        }
      })
      
      // Restaurar console
      console.error = originalError
      console.warn = originalWarn
      
      // Se canvas foi gerado, retorna
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        setGenerating(false)
        return canvas.toDataURL('image/png')
      }
      
      setGenerating(false)
      return null
    } catch (error: any) {
      // Restaurar console
      console.error = originalError
      console.warn = originalWarn
      
      // Se for erro oklch, não mostrar mas retornar null
      const errorMsg = String(error?.message || '').toLowerCase()
      if (errorMsg.includes('oklch') || errorMsg.includes('unsupported')) {
        // Erro oklch - silencioso mas não conseguimos gerar
        setGenerating(false)
        return null
      }
      
      // Erro real
      console.error('Erro ao gerar imagem:', error)
      setGenerating(false)
      return null
    }
  }
  
  // Download da imagem
  const handleDownload = async () => {
    try {
      const dataUrl = await generateImage()
      if (!dataUrl) {
        toast.error('Não foi possível gerar a imagem')
        return
      }
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
      
      const imageUrls: string[] = []
      
      // Se for carrossel, gerar imagem de CADA slide
      if (postData.isCarousel && postData.slides.length > 1) {
        toast.info(`Gerando ${postData.slides.length} imagens do carrossel...`)
        
        const currentIndex = postData.currentSlideIndex
        
        for (let i = 0; i < postData.slides.length; i++) {
          toast.info(`Gerando slide ${i + 1} de ${postData.slides.length}...`)
          
          // Mudar para o slide atual
          setPostData(prev => ({ ...prev, currentSlideIndex: i }))
          
          // Aguardar React atualizar o preview
          await new Promise(resolve => setTimeout(resolve, 800))
          
          // Gerar imagem do slide
          const imageDataUrl = await generateImage()
          if (!imageDataUrl) {
            throw new Error(`Erro ao gerar imagem do slide ${i + 1}`)
          }
          
          // Converter para blob
          const response = await fetch(imageDataUrl)
          const blob = await response.blob()
          
          // Upload para Supabase
          const fileName = `post-carousel-${Date.now()}-slide-${i + 1}.png`
          const formData = new FormData()
          formData.append('file', blob, fileName)
          
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (!uploadResponse.ok) throw new Error(`Erro no upload do slide ${i + 1}`)
          
          const { url } = await uploadResponse.json()
          imageUrls.push(url)
        }
        
        // Restaurar slide original
        setPostData(prev => ({ ...prev, currentSlideIndex: currentIndex }))
        
        toast.info('Criando carrossel...')
      } else {
        // Post único
        toast.info('Gerando imagem...')
        const imageDataUrl = await generateImage()
        
        if (!imageDataUrl) {
          toast.error('Use o botão "Baixar" para gerar a imagem e depois publique pela lista de posts.')
          return
        }
        
        // Converter para blob
        const response = await fetch(imageDataUrl)
        const blob = await response.blob()
        
        // Upload para Supabase
        toast.info('Fazendo upload...')
        const fileName = `post-${Date.now()}.png`
        const formData = new FormData()
        formData.append('file', blob, fileName)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (!uploadResponse.ok) throw new Error('Erro no upload')
        
        const { url } = await uploadResponse.json()
        imageUrls.push(url)
      }
      
      const imageUrl = imageUrls[0]
      
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
          image_url: postData.isCarousel ? imageUrls : imageUrl,
          content: {
            backgroundColor: postData.backgroundColor,
            textColor: postData.textColor,
            titleColor: postData.titleColor,
            subtitleColor: postData.subtitleColor,
            descriptionColor: postData.descriptionColor,
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
          imageUrl: postData.isCarousel ? imageUrls : imageUrl,
          isCarousel: postData.isCarousel,
          caption: postData.caption,
        }),
      })
      
      if (!publishResponse.ok) {
        const error = await publishResponse.json()
        throw new Error(error.error || 'Erro ao publicar')
      }
      
      const publishResult = await publishResponse.json()
      toast.success('Post publicado com sucesso no Instagram! 🎉')
      
      // Abrir post no Instagram se tiver permalink
      if (publishResult.permalink) {
        window.open(publishResult.permalink, '_blank')
      }
      
      router.push('/admin/posts')
    } catch (error: any) {
      console.error('Erro ao publicar:', error)
      toast.error(error.message || 'Erro ao publicar post')
    } finally {
      setPublishing(false)
    }
  }

  // Loading inicial ao carregar post para edição
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
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
            <h1 className="text-3xl font-bold">
              {editPostId ? 'Editar Post' : 'Criar Post de Chamamento'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {editPostId ? 'Modifique seu post e salve as alterações' : 'Personalize seu post e publique no Instagram'}
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
                {editPostId ? 'Salvar Alterações' : 'Salvar Rascunho'}
              </>
            )}
          </Button>
          {!editPostId && (
            <Button
              onClick={handlePublish}
              disabled={saving || publishing || generating}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  📤 Publicando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  📸 Publicar no Instagram
                </>
              )}
            </Button>
          )}
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
          <Card className="border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center justify-between">
                📝 Conteúdo do Slide
                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border">
                  <Label htmlFor="carousel-toggle" className="cursor-pointer font-semibold text-base">
                    {postData.isCarousel ? '🎠 Carrossel' : '📄 Post Único'}
                  </Label>
                  <Switch
                    id="carousel-toggle"
                    checked={postData.isCarousel}
                    onCheckedChange={toggleCarousel}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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

          {/* Elementos Decorativos */}
          <Card className="border-2 border-purple-200">
            <CardHeader className="bg-purple-50">
              <CardTitle className="text-lg">🎨 Elementos Decorativos</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Adicione elementos LGBT e artísticos modernos ao slide
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Seleção do Elemento */}
              <div className="space-y-2">
                <Label htmlFor="decorativeElement" className="text-sm font-semibold">Selecionar Elemento</Label>
                <Select
                  value={currentSlide.decorativeElement || 'none'}
                  onValueChange={(value) => updateSlide('decorativeElement', value as DecorativeElement)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Escolha um elemento decorativo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(decorativeElementsLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upload de Imagem Custom */}
              {currentSlide.decorativeElement === 'custom' && (
                <div className="space-y-2">
                  <Label htmlFor="customElementUpload">Upload da Imagem</Label>
                  <Input
                    id="customElementUpload"
                    type="file"
                    accept="image/png,image/svg+xml"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      // Validar tamanho (max 2MB)
                      if (file.size > 2 * 1024 * 1024) {
                        toast.error('Arquivo muito grande! Máximo: 2MB')
                        return
                      }
                      
                      // Validar tipo
                      if (!['image/png', 'image/svg+xml'].includes(file.type)) {
                        toast.error('Formato inválido! Use PNG ou SVG')
                        return
                      }
                      
                      try {
                        toast.info('Fazendo upload...')
                        
                        // Upload para Supabase
                        const formData = new FormData()
                        formData.append('file', file)
                        
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: formData,
                        })
                        
                        if (!response.ok) throw new Error('Erro no upload')
                        
                        const { url } = await response.json()
                        updateSlide('customElementUrl', url)
                        toast.success('Imagem enviada com sucesso!')
                      } catch (error) {
                        console.error('Erro ao fazer upload:', error)
                        toast.error('Erro ao enviar imagem')
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    PNG ou SVG, máximo 2MB. A imagem será redimensionada automaticamente.
                  </p>
                  {currentSlide.customElementUrl && (
                    <div className="mt-2 p-2 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 bg-white rounded border flex items-center justify-center overflow-hidden">
                          <img 
                            src={currentSlide.customElementUrl} 
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 text-xs text-muted-foreground truncate">
                          {currentSlide.customElementUrl.split('/').pop()}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => updateSlide('customElementUrl', undefined)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentSlide.decorativeElement && currentSlide.decorativeElement !== 'none' && (
                <>
                  {/* Separador */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-purple-50 px-2 text-purple-600 font-medium">Configurações do Elemento</span>
                    </div>
                  </div>

                  {/* Posição do Elemento */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">📍 Posição</Label>
                    <RadioGroup
                      value={currentSlide.elementPosition || 'topo-direita'}
                      onValueChange={(value) => updateSlide('elementPosition', value as ElementPosition)}
                    >
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'topo-esquerda', label: '↖️' },
                          { value: 'topo-centro', label: '⬆️' },
                          { value: 'topo-direita', label: '↗️' },
                          { value: 'centro-esquerda', label: '⬅️' },
                          { value: 'centro', label: '⚫' },
                          { value: 'centro-direita', label: '➡️' },
                          { value: 'base-esquerda', label: '↙️' },
                          { value: 'base-centro', label: '⬇️' },
                          { value: 'base-direita', label: '↘️' },
                        ].map((option) => (
                          <div key={option.value} className="flex items-center space-x-2 border rounded-lg p-2 hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value={option.value} id={`pos-${option.value}`} />
                            <Label htmlFor={`pos-${option.value}`} className="text-2xl cursor-pointer flex-1 text-center">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Tamanho */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">📏 Tamanho</Label>
                    <RadioGroup
                      value={currentSlide.elementSize || 'medio'}
                      onValueChange={(value) => updateSlide('elementSize', value as ElementSize)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pequeno" id="size-pequeno" />
                        <Label htmlFor="size-pequeno" className="cursor-pointer">Pequeno</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medio" id="size-medio" />
                        <Label htmlFor="size-medio" className="cursor-pointer">Médio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grande" id="size-grande" />
                        <Label htmlFor="size-grande" className="cursor-pointer">Grande</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Opacidade */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">🌫️ Opacidade</Label>
                      <span className="text-sm text-muted-foreground">{currentSlide.elementOpacity || 30}%</span>
                    </div>
                    <Slider
                      value={[currentSlide.elementOpacity || 30]}
                      onValueChange={([value]) => updateSlide('elementOpacity', value)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Camada */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold">📊 Camada</Label>
                    <RadioGroup
                      value={currentSlide.elementLayer || 'background'}
                      onValueChange={(value) => updateSlide('elementLayer', value as ElementLayer)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="background" id="layer-bg" />
                        <Label htmlFor="layer-bg" className="cursor-pointer">Atrás do texto</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="foreground" id="layer-fg" />
                        <Label htmlFor="layer-fg" className="cursor-pointer">Na frente do texto</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Design */}
          <Card className="border-2 border-blue-200">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-lg">🎨 Design e Cores</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Personalize as cores e aparência visual do post
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Cores */}
              <div className="space-y-4">
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
                        placeholder="#F8F9FA"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="titleColor">Cor do Título</Label>
                    <div className="flex gap-2">
                      <Input
                        id="titleColor"
                        type="color"
                        value={postData.titleColor}
                        onChange={(e) => updateField('titleColor', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={postData.titleColor}
                        onChange={(e) => updateField('titleColor', e.target.value)}
                        placeholder="#1F2937"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subtitleColor">Cor do Subtítulo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="subtitleColor"
                        type="color"
                        value={postData.subtitleColor}
                        onChange={(e) => updateField('subtitleColor', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={postData.subtitleColor}
                        onChange={(e) => updateField('subtitleColor', e.target.value)}
                        placeholder="#4B5563"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descriptionColor">Cor da Descrição</Label>
                    <div className="flex gap-2">
                      <Input
                        id="descriptionColor"
                        type="color"
                        value={postData.descriptionColor}
                        onChange={(e) => updateField('descriptionColor', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={postData.descriptionColor}
                        onChange={(e) => updateField('descriptionColor', e.target.value)}
                        placeholder="#6B7280"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor de Elementos (CTA, Ícones, Tag)</Label>
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
                      placeholder="#1F2937"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cor para botões, ícones, bordas e tag do projeto
                  </p>
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
  
  // Tamanhos dos elementos decorativos
  const elementSizes = {
    pequeno: 100,
    medio: 180,
    grande: 280,
  }
  
  // Determinar posição e estilo do elemento decorativo
  const getElementStyle = (): React.CSSProperties => {
    if (!slide.decorativeElement || slide.decorativeElement === 'none') return {}
    
    const size = elementSizes[slide.elementSize || 'medio']
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
    }
    
    switch (slide.elementPosition) {
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
      case 'base-esquerda':
        return { ...baseStyle, bottom: '80px', left: '20px' }
      case 'base-centro':
        return { ...baseStyle, bottom: '80px', left: '50%', transform: 'translateX(-50%)' }
      case 'base-direita':
        return { ...baseStyle, bottom: '80px', right: '20px' }
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
      data-post-preview="true"
      className="w-full h-full relative flex flex-col items-center justify-center p-8 pb-20 overflow-hidden"
      style={{
        backgroundColor: globalSettings.backgroundColor,
        color: globalSettings.textColor,
      }}
    >
      {/* Efeitos decorativos de fundo */}
      {renderDecorativeEffect()}
      
      {/* Elemento Decorativo (Background) */}
      {slide.decorativeElement && slide.decorativeElement !== 'none' && slide.elementLayer === 'background' && (() => {
        const size = elementSizes[slide.elementSize || 'medio']
        
        // Se for custom e tiver URL
        if (slide.decorativeElement === 'custom' && slide.customElementUrl) {
          return (
            <div style={{...getElementStyle(), zIndex: 5, opacity: (slide.elementOpacity || 30) / 100}}>
              <img 
                src={slide.customElementUrl} 
                alt="Elemento decorativo custom"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )
        }
        
        // Elementos pré-definidos
        const ElementComponent = decorativeElementsMap[slide.decorativeElement]
        if (!ElementComponent) return null
        
        return (
          <div style={{...getElementStyle(), zIndex: 5}}>
            <ElementComponent 
              size={size} 
              opacity={(slide.elementOpacity || 30) / 100}
            />
          </div>
        )
      })()}
      
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
              color: globalSettings.titleColor,
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
              backgroundColor: globalSettings.titleColor,
              opacity: 0.5
            }}
          />
        )}
        
        {/* Subtítulo */}
        {slide.subtitle && (
          <h2 
            className="font-semibold text-xl"
            style={{ 
              color: globalSettings.subtitleColor,
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
              color: globalSettings.descriptionColor,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
            }}
          >
            {slide.description}
          </p>
        )}
        
        {/* Período */}
        {slide.periodText && (
          <div 
            className="whitespace-nowrap"
            data-center-text="true"
            style={{
              backgroundColor: `${globalSettings.textColor}20`,
              border: `2px solid ${globalSettings.textColor}`,
              color: globalSettings.textColor,
              display: 'inline-flex',
              alignItems: 'center',
              paddingLeft: '16px',
              paddingRight: '16px',
              paddingTop: '8px',
              paddingBottom: '8px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 500,
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
              style={{ flexShrink: 0, marginRight: '8px' }}
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
            className="whitespace-nowrap"
            data-center-text="true"
            style={{
              backgroundColor: globalSettings.textColor,
              color: globalSettings.backgroundColor,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '32px',
              paddingRight: '32px',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: 700,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }}
          >
            {slide.ctaText}
          </div>
        )}
      </div>
      
      {/* Tag do projeto no canto oposto da logo */}
      {slide.tagText && globalSettings.logoPosition.includes('topo') && (
        <div 
          className="absolute bottom-6 right-6 z-20 whitespace-nowrap"
          data-center-text="true"
          style={{
            backgroundColor: `${globalSettings.textColor}20`,
            color: globalSettings.textColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {slide.tagText}
        </div>
      )}
      {slide.tagText && globalSettings.logoPosition.includes('rodape') && (
        <div 
          className="absolute top-6 right-6 z-20 whitespace-nowrap"
          data-center-text="true"
          style={{
            backgroundColor: `${globalSettings.textColor}20`,
            color: globalSettings.textColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {slide.tagText}
        </div>
      )}

      {/* Elemento Decorativo (Foreground) */}
      {slide.decorativeElement && slide.decorativeElement !== 'none' && slide.elementLayer === 'foreground' && (() => {
        const size = elementSizes[slide.elementSize || 'medio']
        
        // Se for custom e tiver URL
        if (slide.decorativeElement === 'custom' && slide.customElementUrl) {
          return (
            <div style={{...getElementStyle(), zIndex: 15, opacity: (slide.elementOpacity || 30) / 100}}>
              <img 
                src={slide.customElementUrl} 
                alt="Elemento decorativo custom"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )
        }
        
        // Elementos pré-definidos
        const ElementComponent = decorativeElementsMap[slide.decorativeElement]
        if (!ElementComponent) return null
        
        return (
          <div style={{...getElementStyle(), zIndex: 15}}>
            <ElementComponent 
              size={size} 
              opacity={(slide.elementOpacity || 30) / 100}
            />
          </div>
        )
      })()}

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

