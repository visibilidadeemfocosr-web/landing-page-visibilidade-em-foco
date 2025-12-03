'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Instagram, Facebook, Linkedin, Download, Edit2, Check, X, ChevronRight, Copy, Camera, FileText } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import html2canvas from 'html2canvas'

interface ArtistData {
  submission_id?: string
  name?: string
  main_artistic_language?: string
  other_artistic_languages?: string
  bio?: string
  original_bio?: string
  instagram?: string
  facebook?: string
  linkedin?: string
  photo?: string | null
}

export default function AdminModeratePreviewClient() {
  const [loading, setLoading] = useState(false)
  const [submissionId, setSubmissionId] = useState<string | null>(null)
  
  // Dados de exemplo ou dados reais
  const [previewData, setPreviewData] = useState({
    name: 'Nome do Artista',
    mainArtisticLanguage: 'Artes Visuais',
    otherArtisticLanguages: 'Música, Teatro',
    bio: 'Poderia nos contar, em uma breve biografia, um pouco sobre a sua trajetória artística e sobre o trabalho que você desenvolve atualmente? Esta é uma biografia de exemplo que mostra como o texto ficaria no post do Instagram. O artista pode compartilhar sua história, suas inspirações e o trabalho que desenvolve.',
    instagram: '@artista_instagram',
    facebook: 'facebook.com/artista',
    linkedin: 'linkedin.com/in/artista',
    photo: 'https://via.placeholder.com/400x400?text=Foto+do+Artista',
    isEditing: false,
    status: 'pending' as string,
    moderator_notes: null as string | null
  })

  // Carregar dados se houver submission_id na URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('submission_id')
    if (id) {
      setSubmissionId(id)
      loadArtistData(id)
    }
  }, [])

  const loadArtistData = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/moderate')
      if (!response.ok) throw new Error('Erro ao carregar dados')
      const data = await response.json()
      const artist = data.artists?.find((a: ArtistData) => a.submission_id === id)
      if (artist) {
        setPreviewData({
          name: artist.name || 'Nome do Artista',
          mainArtisticLanguage: artist.main_artistic_language || '',
          otherArtisticLanguages: artist.other_artistic_languages || '',
          bio: artist.bio || artist.original_bio || '',
          instagram: artist.instagram || '',
          facebook: artist.facebook || '',
          linkedin: artist.linkedin || '',
          photo: artist.photo || 'https://via.placeholder.com/400x400?text=Foto+do+Artista',
          isEditing: false,
          status: (artist as any).status || 'pending',
          moderator_notes: (artist as any).moderator_notes || null
        })
        setEditedBio(artist.bio || artist.original_bio || '')
      }
    } catch (error: any) {
      toast.error('Erro ao carregar dados do artista: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const [editedBio, setEditedBio] = useState(previewData.bio)
  const [isEditingSocialMedia, setIsEditingSocialMedia] = useState(false)
  const [editedSocialMedia, setEditedSocialMedia] = useState({
    instagram: previewData.instagram || '',
    facebook: previewData.facebook || '',
    linkedin: previewData.linkedin || ''
  })
  const [activePost, setActivePost] = useState<'first' | 'second'>('first')

  // Função helper para pegar apenas a primeira parte antes do parêntese
  const getShortLanguage = (language: string | undefined): string => {
    if (!language) return ''
    // Pega apenas a parte antes do primeiro parêntese
    const match = language.match(/^([^(]+)/)
    return match ? match[1].trim() : language
  }

  // Função para gerar a legenda do Instagram
  const generateInstagramCaption = () => {
    const bio = previewData.isEditing ? editedBio : previewData.bio
    const lines: string[] = []
    
    // Nome do artista
    lines.push(previewData.name)
    lines.push('')
    
    // Linguagens artísticas
    if (previewData.mainArtisticLanguage) {
      lines.push(`Linguagem Principal: ${getShortLanguage(previewData.mainArtisticLanguage)}`)
    }
    if (previewData.otherArtisticLanguages) {
      lines.push(`Outras Linguagens: ${previewData.otherArtisticLanguages}`)
    }
    if (previewData.mainArtisticLanguage || previewData.otherArtisticLanguages) {
      lines.push('')
    }
    
    // Bio
    lines.push(bio)
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━')
    lines.push('')
    lines.push('Entre em contato:')
    lines.push('')
    
    // Redes sociais
    if (previewData.instagram) {
      const instagramHandle = previewData.instagram.startsWith('@') 
        ? previewData.instagram 
        : `@${previewData.instagram.replace('https://instagram.com/', '').replace('instagram.com/', '')}`
      lines.push(`Instagram: ${instagramHandle}`)
    }
    if (previewData.facebook) {
      const facebookLink = previewData.facebook.startsWith('http') 
        ? previewData.facebook 
        : `https://${previewData.facebook}`
      lines.push(`Facebook: ${facebookLink}`)
    }
    if (previewData.linkedin) {
      const linkedinLink = previewData.linkedin.startsWith('http') 
        ? previewData.linkedin 
        : `https://${previewData.linkedin}`
      lines.push(`LinkedIn: ${linkedinLink}`)
    }
    
    lines.push('')
    lines.push('━━━━━━━━━━━━━━━━━━━━')
    lines.push('')
    lines.push('#VisibilidadeEmFoco #SãoRoque #ArteLGBTQIA+')
    
    return lines.join('\n')
  }

  const handleCopyCaption = () => {
    const caption = generateInstagramCaption()
    navigator.clipboard.writeText(caption)
    toast.success('Legenda copiada para a área de transferência!')
  }

  // Função para publicar no Instagram
  const handlePublishToInstagram = async () => {
    if (!submissionId) {
      toast.error('ID da submissão não encontrado')
      return
    }

    setLoading(true)
    
    try {
      // 1. Gerar e fazer upload das duas imagens do carousel
      toast.info('📸 Gerando imagens...')
      
      // Gerar Post 1
      const post1Response = await fetch('/api/admin/generate-post-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: previewData.name,
          mainArtisticLanguage: previewData.mainArtisticLanguage,
          otherArtisticLanguages: previewData.otherArtisticLanguages,
          bio: previewData.bio,
          photo: previewData.photo,
          instagram: previewData.instagram,
          facebook: previewData.facebook,
          linkedin: previewData.linkedin,
          postType: 'first',
        }),
      })

      if (!post1Response.ok) {
        throw new Error('Erro ao gerar Post 1')
      }

      const post1Data = await post1Response.json()
      
      toast.info('📸 Gerando Post 2...')
      
      // Gerar Post 2
      const post2Response = await fetch('/api/admin/generate-post-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: previewData.name,
          mainArtisticLanguage: previewData.mainArtisticLanguage,
          otherArtisticLanguages: previewData.otherArtisticLanguages,
          bio: previewData.bio,
          photo: previewData.photo,
          instagram: previewData.instagram,
          facebook: previewData.facebook,
          linkedin: previewData.linkedin,
          postType: 'second',
        }),
      })

      if (!post2Response.ok) {
        throw new Error('Erro ao gerar Post 2')
      }

      const post2Data = await post2Response.json()
      
      toast.info('☁️ Fazendo upload para o Supabase...')
      
      // 2. Fazer upload das imagens para o Supabase Storage
      const uploadResponse = await fetch('/api/admin/upload-instagram-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post1Image: post1Data.image,
          post2Image: post2Data.image,
          artistName: previewData.name,
        }),
      })

      if (!uploadResponse.ok) {
        throw new Error('Erro ao fazer upload das imagens')
      }

      const uploadData = await uploadResponse.json()
      const imageUrls = [uploadData.post1Url, uploadData.post2Url]
      
      toast.info('📱 Publicando no Instagram...')
      
      // 3. Publicar no Instagram
      const caption = generateInstagramCaption()
      
      const publishResponse = await fetch('/api/instagram/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imageUrls,
          caption: caption,
          isCarousel: true,
        }),
      })

      if (!publishResponse.ok) {
        const errorData = await publishResponse.json()
        throw new Error(errorData.details || 'Erro ao publicar no Instagram')
      }

      const publishData = await publishResponse.json()
      
      // 4. Atualizar status na moderação
      const moderateResponse = await fetch('/api/admin/moderate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_id: submissionId,
          status: 'published',
          instagram_post_id: publishData.data.id,
        }),
      })

      if (!moderateResponse.ok) {
        console.warn('Erro ao atualizar status na moderação')
      }

      toast.success('✅ Post publicado no Instagram com sucesso!')
      
      // 5. Abrir o post no Instagram
      if (publishData.data?.permalink) {
        setTimeout(() => {
          window.open(publishData.data.permalink, '_blank')
        }, 1000)
      }
    } catch (error: any) {
      console.error('Erro ao publicar no Instagram:', error)
      toast.error('❌ Erro ao publicar: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPreview = async () => {
    // Usar a nova API que renderiza exatamente como a preview
    try {
      toast.info('Gerando imagem...')
      
      const response = await fetch('/api/admin/generate-post-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submissionId || undefined,
          postType: activePost,
          name: previewData.name,
          mainArtisticLanguage: previewData.mainArtisticLanguage,
          otherArtisticLanguages: previewData.otherArtisticLanguages,
          bio: previewData.isEditing ? editedBio : previewData.bio,
          photo: previewData.photo,
          instagram: previewData.instagram,
          facebook: previewData.facebook,
          linkedin: previewData.linkedin
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao gerar imagem')
      }

      const data = await response.json()
      
      if (!data.success || !data.image) {
        throw new Error('Resposta inválida do servidor')
      }

      const fileName = `post-instagram-${previewData.name.replace(/\s+/g, '-').toLowerCase()}-${activePost === 'first' ? 'apresentacao' : 'biografia'}.png`
      
      // Criar link de download
      const link = document.createElement('a')
      link.href = data.image
      link.download = fileName
      link.style.display = 'none'
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
      }, 100)

      // Mostrar modal com a imagem
      const overlay = document.createElement('div')
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      `
      
      const modal = document.createElement('div')
      modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        position: relative;
        text-align: center;
      `
      
      // Criar botão de fechar
      const closeButton = document.createElement('button')
      closeButton.textContent = '✕'
      closeButton.style.cssText = 'position:absolute;top:10px;right:10px;background:#f0f0f0;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;'
      closeButton.onclick = () => {
        document.body.removeChild(overlay)
      }
      
      // Criar título
      const title = document.createElement('h2')
      title.textContent = 'Imagem Gerada'
      title.style.cssText = 'margin:0 0 20px 0;color:#333;font-size:24px;'
      
      // Criar imagem
      const img = document.createElement('img')
      img.src = data.image
      img.alt = fileName
      img.style.cssText = 'max-width:100%;height:auto;border:1px solid #ddd;border-radius:8px;margin:20px 0;display:block;'
      
      // Criar parágrafo
      const paragraph = document.createElement('p')
      paragraph.innerHTML = '<strong>Para salvar:</strong><br>Clique com o botão direito na imagem e selecione "Salvar imagem como..."'
      paragraph.style.cssText = 'color:#666;margin:20px 0;line-height:1.6;'
      
      // Criar link de download
      const downloadLink = document.createElement('a')
      downloadLink.href = data.image
      downloadLink.download = fileName
      downloadLink.textContent = '📥 Baixar Novamente'
      downloadLink.style.cssText = 'display:inline-block;background:#1a4b8c;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:20px;'
      
      // Adicionar elementos ao modal
      modal.appendChild(closeButton)
      modal.appendChild(title)
      modal.appendChild(img)
      modal.appendChild(paragraph)
      modal.appendChild(downloadLink)
      
      overlay.appendChild(modal)
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay)
        }
      }
      
      document.body.appendChild(overlay)
      toast.success('Imagem gerada com sucesso!')
      return
    } catch (apiError: any) {
      console.error('Erro na API:', apiError)
      toast.error('Erro ao gerar imagem: ' + (apiError.message || 'Erro desconhecido'))
      // Fallback para método antigo se a API falhar
    }

    // Método antigo como fallback (removido para simplificar)
    return
  }

  const handleDownloadPreviewOld = async () => {
    const previewElement = document.getElementById('instagram-preview')
    if (!previewElement) {
      toast.error('Elemento de preview não encontrado')
      return
    }

    toast.info('Gerando imagem...')
    
    // Tentar primeiro com html2canvas (mais rápido)
    let canvas: HTMLCanvasElement | null = null
    let useServer = false
    
    try {
      // Suprimir erros de oklch
      const originalError = console.error
      const originalWarn = console.warn
      
      console.error = (...args: any[]) => {
        const msg = String(args.join(' ')).toLowerCase()
        if (msg.includes('oklch') || msg.includes('color function')) {
          return
        }
        originalError.apply(console, args)
      }
      
      console.warn = (...args: any[]) => {
        const msg = String(args.join(' ')).toLowerCase()
        if (msg.includes('oklch') || msg.includes('color function')) {
          return
        }
        originalWarn.apply(console, args)
      }
      
      // Aguardar um pouco para garantir que todas as imagens sejam carregadas
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Tentar gerar com html2canvas - mesmo com erro de oklch, pode funcionar
      try {
        canvas = await html2canvas(previewElement, {
          backgroundColor: '#1a4b8c',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: false,
          foreignObjectRendering: false,
          removeContainer: false,
          windowWidth: 1080,
          windowHeight: 1080,
          onclone: (clonedDoc, element) => {
            // Garantir que o elemento clonado mantenha todos os estilos
            const clonedElement = element as HTMLElement
            if (clonedElement) {
              // Forçar renderização do fundo com gradiente
              clonedElement.style.background = 'linear-gradient(to bottom right, #1a4b8c, #2d1b69, #4a1942)'
              clonedElement.style.backgroundColor = '#1a4b8c'
              clonedElement.style.position = 'relative'
              clonedElement.style.overflow = 'hidden'
              clonedElement.style.width = '1080px'
              clonedElement.style.height = '1080px'
            }
            
            // Ocultar toasts e modais
            const toasts = clonedDoc.querySelectorAll('[data-sonner-toast], [data-sonner-toaster]')
            toasts.forEach((el) => {
              ;(el as HTMLElement).style.display = 'none'
            })
            
            // Garantir que o grid pattern seja visível
            const gridPattern = clonedDoc.querySelector('[class*="bg-[linear-gradient"]')
            if (gridPattern) {
              const gridEl = gridPattern as HTMLElement
              gridEl.style.position = 'absolute'
              gridEl.style.top = '0'
              gridEl.style.left = '0'
              gridEl.style.right = '0'
              gridEl.style.bottom = '0'
              gridEl.style.width = '100%'
              gridEl.style.height = '100%'
              gridEl.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)'
              gridEl.style.backgroundSize = '50px 50px'
              gridEl.style.zIndex = '0'
            }
            
            // Garantir que os blobs sejam visíveis
            const blobs = clonedDoc.querySelectorAll('[class*="blur-3xl"]')
            blobs.forEach((blob, index) => {
              const blobEl = blob as HTMLElement
              blobEl.style.position = 'absolute'
              blobEl.style.borderRadius = '50%'
              blobEl.style.filter = 'blur(80px)'
              blobEl.style.zIndex = '0'
              blobEl.style.opacity = '0.2'
              
              if (index === 0) {
                // Blob superior esquerdo
                blobEl.style.top = '-80px'
                blobEl.style.left = '-80px'
                blobEl.style.width = '256px'
                blobEl.style.height = '256px'
                blobEl.style.background = 'linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))'
              } else if (index === 1) {
                // Blob inferior direito
                blobEl.style.bottom = '-80px'
                blobEl.style.right = '-80px'
                blobEl.style.width = '256px'
                blobEl.style.height = '256px'
                blobEl.style.background = 'linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2))'
              }
            })
            
            // Garantir que logo e tag VFSR sejam visíveis - usar seletores mais específicos
            const allAbsoluteDivs = clonedDoc.querySelectorAll('div[class*="absolute"]')
            allAbsoluteDivs.forEach((div) => {
              const divEl = div as HTMLElement
              const classes = divEl.className || ''
              
              // Logo no canto superior esquerdo
              if (classes.includes('top-4') && classes.includes('left-4') && classes.includes('w-20')) {
                divEl.style.position = 'absolute'
                divEl.style.top = '16px'
                divEl.style.left = '16px'
                divEl.style.zIndex = '10'
                divEl.style.display = 'block'
                divEl.style.visibility = 'visible'
                divEl.style.opacity = '1'
              }
              
              // Tag VFSR no canto superior direito
              if (classes.includes('top-4') && classes.includes('right-4') && (classes.includes('rounded-full') || classes.includes('VFSR'))) {
                divEl.style.position = 'absolute'
                divEl.style.top = '16px'
                divEl.style.right = '16px'
                divEl.style.zIndex = '10'
                divEl.style.display = 'block'
                divEl.style.visibility = 'visible'
                divEl.style.opacity = '1'
              }
            })
            
            // Garantir que todos os elementos com z-index sejam visíveis
            const allZIndexElements = clonedDoc.querySelectorAll('[class*="z-"]')
            allZIndexElements.forEach((el) => {
              const htmlEl = el as HTMLElement
              htmlEl.style.display = 'block'
              htmlEl.style.visibility = 'visible'
              htmlEl.style.opacity = '1'
            })
            
            // Garantir que imagens sejam carregadas e substituir placeholders
            const allImages = clonedDoc.querySelectorAll('img')
            allImages.forEach((img) => {
              const htmlImg = img as HTMLImageElement
              
              // Substituir placeholders que falharam
              if (htmlImg.src && htmlImg.src.includes('via.placeholder.com')) {
                const placeholder = document.createElement('canvas')
                placeholder.width = 400
                placeholder.height = 400
                const ctx = placeholder.getContext('2d')
                if (ctx) {
                  ctx.fillStyle = '#1a4b8c'
                  ctx.fillRect(0, 0, 400, 400)
                  ctx.fillStyle = '#ffffff'
                  ctx.font = '20px Arial'
                  ctx.textAlign = 'center'
                  ctx.textBaseline = 'middle'
                  ctx.fillText('Foto do Artista', 200, 200)
                  htmlImg.src = placeholder.toDataURL()
                }
              }
              
              // Forçar carregamento de imagens que ainda não carregaram
              if (htmlImg.src && !htmlImg.complete && !htmlImg.src.includes('data:')) {
                const newImg = document.createElement('img')
                newImg.crossOrigin = 'anonymous'
                newImg.src = htmlImg.src
                newImg.onload = () => {
                  htmlImg.src = newImg.src
                }
                newImg.onerror = () => {
                  // Fallback para placeholder
                  const placeholder = document.createElement('canvas')
                  placeholder.width = 400
                  placeholder.height = 400
                  const ctx = placeholder.getContext('2d')
                  if (ctx) {
                    ctx.fillStyle = '#1a4b8c'
                    ctx.fillRect(0, 0, 400, 400)
                    ctx.fillStyle = '#ffffff'
                    ctx.font = '20px Arial'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText('Foto do Artista', 200, 200)
                    htmlImg.src = placeholder.toDataURL()
                  }
                }
              }
            })
          }
        })
        
        // Verificar se o canvas foi gerado
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          console.error = originalError
          console.warn = originalWarn
          // Sucesso! Continuar com o download
        } else {
          throw new Error('Canvas vazio')
        }
      } catch (html2canvasError: any) {
        console.error = originalError
        console.warn = originalWarn
        
        const errorMsg = String(html2canvasError?.message || html2canvasError || '')
        if (errorMsg.toLowerCase().includes('oklch')) {
          // Erro de oklch - tentar no servidor
          useServer = true
        } else {
          throw html2canvasError
        }
      }
    } catch (error: any) {
      // Se html2canvas falhou, tentar no servidor
      useServer = true
    }
    
    // Se precisar usar servidor ou html2canvas falhou
    if (useServer || !canvas) {
      try {
        toast.info('Gerando imagem no servidor...')
        
        // Capturar HTML completo com estilos inline para garantir que tudo seja renderizado
        const previewHTML = previewElement.outerHTML
        
        // Capturar estilos computados do elemento principal
        const computedStyles = window.getComputedStyle(previewElement)
        const backgroundStyle = computedStyles.background || computedStyles.backgroundColor || 'linear-gradient(to bottom right, #1a4b8c, #2d1b69, #4a1942)'
        
        // Capturar estilos de todos os elementos filhos importantes
        const gridElement = previewElement.querySelector('[class*="bg-[linear-gradient"]')
        const blob1 = previewElement.querySelector('div:nth-of-type(2)') // Primeiro blob
        const blob2 = previewElement.querySelector('div:nth-of-type(3)') // Segundo blob
        
        const htmlWithStyles = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>
                * { 
                  margin: 0; 
                  padding: 0; 
                  box-sizing: border-box; 
                }
                html, body { 
                  width: 1080px; 
                  height: 1080px; 
                  margin: 0;
                  padding: 0;
                  overflow: hidden;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                /* Estilos para o elemento principal */
                #instagram-preview {
                  width: 1080px !important;
                  height: 1080px !important;
                  background: linear-gradient(to bottom right, #1a4b8c 0%, #2d1b69 50%, #4a1942 100%) !important;
                  position: relative !important;
                  overflow: hidden !important;
                  border-radius: 8px !important;
                }
                /* Grid pattern - garantir que seja visível */
                #instagram-preview > div:first-of-type {
                  position: absolute !important;
                  top: 0 !important;
                  left: 0 !important;
                  right: 0 !important;
                  bottom: 0 !important;
                  width: 100% !important;
                  height: 100% !important;
                  background-image: 
                    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px) !important;
                  background-size: 50px 50px !important;
                  z-index: 0 !important;
                  pointer-events: none !important;
                }
                /* Blob superior esquerdo */
                #instagram-preview > div:nth-of-type(2) {
                  position: absolute !important;
                  top: -80px !important;
                  left: -80px !important;
                  width: 256px !important;
                  height: 256px !important;
                  background: linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2)) !important;
                  border-radius: 50% !important;
                  filter: blur(80px) !important;
                  z-index: 0 !important;
                  pointer-events: none !important;
                }
                /* Blob inferior direito */
                #instagram-preview > div:nth-of-type(3) {
                  position: absolute !important;
                  bottom: -80px !important;
                  right: -80px !important;
                  width: 256px !important;
                  height: 256px !important;
                  background: linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2)) !important;
                  border-radius: 50% !important;
                  filter: blur(80px) !important;
                  z-index: 0 !important;
                  pointer-events: none !important;
                }
                /* Logo e Tag VFSR - garantir posicionamento com seletores mais específicos */
                #instagram-preview > div[class*="absolute"] {
                  position: absolute !important;
                }
                /* Logo no canto superior esquerdo */
                #instagram-preview > div[class*="absolute"][class*="top-4"][class*="left-4"][class*="w-20"] {
                  top: 16px !important;
                  left: 16px !important;
                  z-index: 10 !important;
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                /* Tag VFSR no canto superior direito */
                #instagram-preview > div[class*="absolute"][class*="top-4"][class*="right-4"] {
                  top: 16px !important;
                  right: 16px !important;
                  z-index: 10 !important;
                  display: block !important;
                  visibility: visible !important;
                  opacity: 1 !important;
                }
                /* Conteúdo principal deve estar acima */
                #instagram-preview > div[class*="relative"] {
                  position: relative !important;
                  z-index: 1 !important;
                }
                /* Foto circular com borda decorativa */
                #instagram-preview img {
                  border-radius: 50% !important;
                  border: 4px solid rgba(255,255,255,0.3) !important;
                  object-fit: cover !important;
                }
                /* Container da foto */
                #instagram-preview div[class*="rounded-full"][class*="overflow-hidden"] {
                  border-radius: 50% !important;
                  overflow: hidden !important;
                  border: 4px solid rgba(255,255,255,0.3) !important;
                }
                /* Ícone de arraste */
                [class*="animate-bounce"] {
                  animation: none !important; /* Remover animação para captura estática */
                }
                /* Garantir que todos os elementos de texto sejam visíveis */
                #instagram-preview * {
                  color: inherit !important;
                  font-family: inherit !important;
                }
                /* Garantir que SVG/icons sejam visíveis */
                #instagram-preview svg {
                  display: inline-block !important;
                  visibility: visible !important;
                }
              </style>
            </head>
            <body style="background: linear-gradient(to bottom right, #1a4b8c, #2d1b69, #4a1942); width: 1080px; height: 1080px; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center;">
              ${previewHTML}
            </body>
          </html>
        `
        
        const response = await fetch('/api/admin/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html: htmlWithStyles,
            width: 1080,
            height: 1080,
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.image) {
            // Converter base64 para canvas usando HTMLImageElement nativo
            const img = document.createElement('img')
            img.src = data.image
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve()
              img.onerror = () => reject(new Error('Erro ao carregar imagem'))
            })
            
            canvas = document.createElement('canvas')
            canvas.width = 1080
            canvas.height = 1080
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.drawImage(img, 0, 0)
            }
          } else {
            throw new Error('Resposta inválida do servidor')
          }
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erro ao gerar imagem no servidor')
        }
      } catch (serverError: any) {
        console.error('Erro ao gerar no servidor:', serverError)
        toast.error('Erro ao gerar imagem. Use a captura de tela do navegador como alternativa.')
        return
      }
    }
    
    // Se chegou aqui, temos um canvas válido
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      toast.error('Não foi possível gerar a imagem')
      return
    }
    
    // Converter para data URL e fazer download
    const fileName = `post-instagram-${previewData.name.replace(/\s+/g, '-').toLowerCase()}-${activePost === 'first' ? 'apresentacao' : 'biografia'}.png`
    const dataUrl = canvas.toDataURL('image/png', 1.0)
    
    // Criar link de download
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
    
    // Mostrar modal com a imagem
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    
    const modal = document.createElement('div')
    modal.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 30px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      position: relative;
      text-align: center;
    `
    
    modal.innerHTML = `
      <button onclick="this.closest('div[style*=\"position:fixed\"]').remove()" style="position:absolute;top:10px;right:10px;background:#f0f0f0;border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:18px;">✕</button>
      <h2 style="margin:0 0 20px 0;color:#333;font-size:24px;">Imagem Gerada</h2>
      <img src="${dataUrl}" alt="${fileName}" style="max-width:100%;height:auto;border:1px solid #ddd;border-radius:8px;margin:20px 0;display:block;" />
      <p style="color:#666;margin:20px 0;line-height:1.6;">
        <strong>Para salvar:</strong><br>
        Clique com o botão direito na imagem e selecione "Salvar imagem como..."
      </p>
      <a href="${dataUrl}" download="${fileName}" style="display:inline-block;background:#1a4b8c;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;margin-top:20px;">📥 Baixar Novamente</a>
    `
    
    overlay.appendChild(modal)
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        document.body.removeChild(overlay)
      }
    }
    
    document.body.appendChild(overlay)
    toast.success('Imagem gerada com sucesso!')
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Preview - Posts do Instagram (Carousel)</h1>
        <p className="text-muted-foreground">
          Visualize como ficarão os posts do Instagram em formato carousel (2 imagens)
        </p>
      </div>

      {/* Tabs para alternar entre os posts */}
      <div className="flex gap-2 mb-6 p-4 bg-muted/50 rounded-lg border">
        <Button
          variant={activePost === 'first' ? 'default' : 'outline'}
          onClick={() => setActivePost('first')}
          className="flex-1"
          size="lg"
        >
          <Camera className="w-4 h-4 mr-2" />
          Post 1: Apresentação
        </Button>
        <Button
          variant={activePost === 'second' ? 'default' : 'outline'}
          onClick={() => setActivePost('second')}
          className="flex-1"
          size="lg"
        >
          <FileText className="w-4 h-4 mr-2" />
          Post 2: Biografia + Redes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview do Post */}
        <Card>
          <CardHeader>
            <CardTitle>
              {activePost === 'first' ? 'Post 1: Apresentação (1080x1080px)' : 'Post 2: Biografia + Redes (1080x1080px)'}
            </CardTitle>
            <CardDescription>
              {activePost === 'first' 
                ? 'Primeira imagem do carousel - chama atenção com foto e linguagens'
                : 'Segunda imagem do carousel - biografia completa e redes sociais'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              id="instagram-preview"
              className="relative w-full aspect-square bg-gradient-to-br from-white via-gray-50 to-slate-50 rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Grid pattern de fundo */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
              
              {/* Blobs decorativos */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-200/25 to-purple-200/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-pink-200/25 to-orange-200/15 rounded-full blur-3xl" />
              
              {/* Conteúdo do post */}
              <div className="relative z-0 h-full flex flex-col p-8">
                {/* Logo no canto superior esquerdo */}
                <div className="absolute top-4 left-4 w-20 h-20 z-[1]">
                  <Image
                    src="/logoN.png?v=2"
                    alt="Visibilidade em Foco"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain drop-shadow-2xl"
                    unoptimized
                    onError={(e) => {
                      // Fallback se a imagem não carregar
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = '<span class="text-gray-900 font-bold text-lg">VF</span>'
                      }
                    }}
                  />
                </div>

                {/* Tag VFSR no canto superior direito */}
                <div className="absolute top-4 right-4 z-[1]">
                  <div className="bg-orange-500 rounded-full px-4 py-2 shadow-lg border-2 border-orange-500/30">
                    <span className="text-white font-bold text-sm tracking-wider">VFSR</span>
                  </div>
                </div>

                {/* Conteúdo principal - Post 1 ou Post 2 */}
                {activePost === 'first' ? (
                  /* POST 1: Apresentação (Foto, Nome, Linguagens + Ícone de Arraste) */
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-16">
                    {/* Foto do artista */}
                    <div className="relative">
                      <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white/10">
                        <img
                          src={previewData.photo}
                          alt={previewData.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Foto'
                          }}
                        />
                      </div>
                      {/* Decoração ao redor da foto */}
                      <div className="absolute -inset-4 rounded-full border-2 border-pink-500/30 animate-pulse" />
                    </div>

                    {/* Nome do artista */}
                    <div className="text-center">
                      <h2 className="text-4xl font-bold mb-2 text-gray-900">{previewData.name}</h2>
                      <div className="w-32 h-1 bg-orange-500 mx-auto rounded-full mb-2" />
                    </div>

                    {/* Linguagens Artísticas */}
                    <div className="text-center space-y-2">
                      {previewData.mainArtisticLanguage && (
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-orange-500/10 backdrop-blur-sm rounded-full border border-orange-500/30">
                          <span className="text-base font-semibold text-orange-500">Principal:</span>
                          <span className="text-base font-medium text-gray-900">{getShortLanguage(previewData.mainArtisticLanguage)}</span>
                        </div>
                      )}
                      {previewData.otherArtisticLanguages && (
                        <div className="inline-flex items-center gap-2 px-5 py-3 bg-gray-200/50 backdrop-blur-sm rounded-full border border-gray-300/50">
                          <span className="text-base font-semibold text-gray-600">Outras:</span>
                          <span className="text-base font-medium text-gray-900">{previewData.otherArtisticLanguages}</span>
                        </div>
                      )}
                      
                      {/* Ícone de arraste para ver mais - abaixo das tags */}
                      <div className="flex flex-col items-center gap-2 pt-4 animate-bounce">
                        <div className="bg-orange-500/10 backdrop-blur-sm rounded-full p-3 border-2 border-orange-500/30">
                          <ChevronRight className="w-6 h-6 text-orange-500" />
                        </div>
                        <span className="text-xs text-gray-600 font-medium">Arraste para ver mais</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* POST 2: Biografia + Redes Sociais */
                  <div className="flex-1 flex flex-col items-center justify-center space-y-6 mt-16">
                    {/* Nome do artista (menor, no topo) */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2 text-gray-900">{previewData.name}</h2>
                      <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
                    </div>

                    {/* Bio */}
                    <div className="max-w-lg text-center space-y-4 px-4">
                      <p className="text-lg leading-relaxed text-gray-700">
                        {previewData.isEditing ? editedBio : previewData.bio}
                      </p>
                    </div>

                    {/* Redes sociais */}
                    <div className="flex flex-col items-center gap-3 pt-4">
                      <p className="text-sm text-gray-600 mb-2">Entre em contato:</p>
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {previewData.instagram && (
                          <a
                            href={`https://instagram.com/${previewData.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-full backdrop-blur-sm border-2 border-orange-500/20 transition-all"
                          >
                            <Instagram className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-900">{previewData.instagram}</span>
                          </a>
                        )}
                        {previewData.facebook && (
                          <a
                            href={previewData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-full backdrop-blur-sm border-2 border-orange-500/20 transition-all"
                          >
                            <Facebook className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-900">Facebook</span>
                          </a>
                        )}
                        {previewData.linkedin && (
                          <a
                            href={previewData.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-3 bg-orange-500/10 hover:bg-orange-500/20 rounded-full backdrop-blur-sm border-2 border-orange-500/20 transition-all"
                          >
                            <Linkedin className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium text-gray-900">LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Rodapé com hashtag - apenas no Post 2 */}
                {activePost === 'second' && (
                  <div className="text-center pb-4">
                    <p className="text-sm text-white/60">#VisibilidadeEmFoco #SãoRoque #ArteLGBTQIA+</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Painel de Edição */}
        <Card>
          <CardHeader>
            <CardTitle>Editar Conteúdo</CardTitle>
            <CardDescription>
              Ajuste os dados para ver como ficará o post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Artista</Label>
              <Input
                id="name"
                value={previewData.name}
                onChange={(e) => setPreviewData({ ...previewData, name: e.target.value })}
                placeholder="Nome do Artista"
              />
            </div>

            {/* Linguagens Artísticas */}
            <div className="space-y-4">
              <Label>Linguagens Artísticas</Label>
              
              <div className="space-y-2">
                <Label htmlFor="mainArtisticLanguage" className="text-sm text-muted-foreground">
                  Linguagem Artística Principal *
                </Label>
                <Input
                  id="mainArtisticLanguage"
                  value={previewData.mainArtisticLanguage}
                  onChange={(e) => setPreviewData({ ...previewData, mainArtisticLanguage: e.target.value })}
                  placeholder="Ex: Artes Visuais, Música, Teatro..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherArtisticLanguages" className="text-sm text-muted-foreground">
                  Outras Linguagens Artísticas
                </Label>
                <Input
                  id="otherArtisticLanguages"
                  value={previewData.otherArtisticLanguages}
                  onChange={(e) => setPreviewData({ ...previewData, otherArtisticLanguages: e.target.value })}
                  placeholder="Ex: Música, Teatro, Dança (separadas por vírgula)"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="bio">Biografia</Label>
                {previewData.isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        if (!submissionId) {
                          toast.error('ID de submissão não encontrado')
                          return
                        }
                        
                        try {
                          const response = await fetch('/api/admin/moderate', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              submission_id: submissionId,
                              status: previewData.status || 'pending',
                              edited_bio: editedBio,
                              moderator_notes: previewData.moderator_notes || null
                            }),
                          })

                          if (!response.ok) {
                            const errorData = await response.json()
                            throw new Error(errorData.error || 'Erro ao salvar biografia')
                          }

                          setPreviewData({ ...previewData, bio: editedBio, isEditing: false })
                          toast.success('Biografia salva com sucesso!')
                        } catch (error: any) {
                          console.error('Erro ao salvar biografia:', error)
                          toast.error('Erro ao salvar biografia: ' + (error.message || 'Erro desconhecido'))
                        }
                      }}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditedBio(previewData.bio)
                        setPreviewData({ ...previewData, isEditing: false })
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditedBio(previewData.bio)
                      setPreviewData({ ...previewData, isEditing: true })
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
              {previewData.isEditing ? (
                <Textarea
                  id="bio"
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Biografia do artista..."
                  rows={6}
                />
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm">
                  {previewData.bio}
                </div>
              )}
            </div>

            {/* Redes Sociais */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Redes Sociais</Label>
                {isEditingSocialMedia ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={async () => {
                        if (!submissionId) {
                          toast.error('ID de submissão não encontrado')
                          return
                        }
                        
                        try {
                          // Formatar as redes sociais no formato esperado
                          const socialMediaParts: string[] = []
                          if (editedSocialMedia.instagram) {
                            socialMediaParts.push(`Instagram: ${editedSocialMedia.instagram}`)
                          }
                          if (editedSocialMedia.facebook) {
                            socialMediaParts.push(`Facebook: ${editedSocialMedia.facebook}`)
                          }
                          if (editedSocialMedia.linkedin) {
                            socialMediaParts.push(`LinkedIn: ${editedSocialMedia.linkedin}`)
                          }
                          const socialMediaValue = socialMediaParts.join(' | ')

                          const response = await fetch('/api/admin/moderate', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              submission_id: submissionId,
                              status: previewData.status || 'pending',
                              edited_instagram: editedSocialMedia.instagram || null,
                              edited_facebook: editedSocialMedia.facebook || null,
                              edited_linkedin: editedSocialMedia.linkedin || null,
                              moderator_notes: previewData.moderator_notes || null
                            }),
                          })

                          if (!response.ok) {
                            const errorData = await response.json()
                            throw new Error(errorData.error || 'Erro ao salvar redes sociais')
                          }

                          setPreviewData({ 
                            ...previewData, 
                            instagram: editedSocialMedia.instagram,
                            facebook: editedSocialMedia.facebook,
                            linkedin: editedSocialMedia.linkedin
                          })
                          setIsEditingSocialMedia(false)
                          toast.success('Redes sociais salvas com sucesso!')
                        } catch (error: any) {
                          console.error('Erro ao salvar redes sociais:', error)
                          toast.error('Erro ao salvar redes sociais: ' + (error.message || 'Erro desconhecido'))
                        }
                      }}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Salvar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditedSocialMedia({
                          instagram: previewData.instagram || '',
                          facebook: previewData.facebook || '',
                          linkedin: previewData.linkedin || ''
                        })
                        setIsEditingSocialMedia(false)
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditedSocialMedia({
                        instagram: previewData.instagram || '',
                        facebook: previewData.facebook || '',
                        linkedin: previewData.linkedin || ''
                      })
                      setIsEditingSocialMedia(true)
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm text-muted-foreground">
                  Instagram
                </Label>
                <Input
                  id="instagram"
                  value={isEditingSocialMedia ? editedSocialMedia.instagram : previewData.instagram}
                  onChange={(e) => {
                    if (isEditingSocialMedia) {
                      setEditedSocialMedia({ ...editedSocialMedia, instagram: e.target.value })
                    } else {
                      setPreviewData({ ...previewData, instagram: e.target.value })
                    }
                  }}
                  disabled={!isEditingSocialMedia}
                  placeholder="@usuario"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook" className="text-sm text-muted-foreground">
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={isEditingSocialMedia ? editedSocialMedia.facebook : previewData.facebook}
                  onChange={(e) => {
                    if (isEditingSocialMedia) {
                      setEditedSocialMedia({ ...editedSocialMedia, facebook: e.target.value })
                    } else {
                      setPreviewData({ ...previewData, facebook: e.target.value })
                    }
                  }}
                  disabled={!isEditingSocialMedia}
                  placeholder="Link do Facebook"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm text-muted-foreground">
                  LinkedIn
                </Label>
                <Input
                  id="linkedin"
                  value={isEditingSocialMedia ? editedSocialMedia.linkedin : previewData.linkedin}
                  onChange={(e) => {
                    if (isEditingSocialMedia) {
                      setEditedSocialMedia({ ...editedSocialMedia, linkedin: e.target.value })
                    } else {
                      setPreviewData({ ...previewData, linkedin: e.target.value })
                    }
                  }}
                  disabled={!isEditingSocialMedia}
                  placeholder="Link do LinkedIn"
                />
              </div>
            </div>

            {/* Foto */}
            <div className="space-y-2">
              <Label htmlFor="photo">URL da Foto</Label>
              <Input
                id="photo"
                value={previewData.photo}
                onChange={(e) => setPreviewData({ ...previewData, photo: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {/* Legenda do Instagram */}
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Legenda do Instagram</Label>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCaption}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={generateInstagramCaption()}
                  readOnly
                  rows={12}
                  className="font-mono text-sm bg-muted resize-none"
                  onClick={(e) => {
                    // Selecionar todo o texto ao clicar
                    e.currentTarget.select()
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Esta legenda será usada ao publicar no Instagram. Os links podem ser copiados pelos usuários.
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-4 border-t space-y-2">
              <Button 
                className="w-full" 
                variant="outline"
                onClick={handleDownloadPreview}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Preview (PNG)
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Baixa a imagem do post atual (Post {activePost === 'first' ? '1' : '2'}) em formato PNG 1080x1080px
              </p>
              
              {/* Botão de publicar no Instagram */}
              <Button 
                className="w-full" 
                variant="default"
                onClick={handlePublishToInstagram}
                disabled={loading || !submissionId}
              >
                <Instagram className="w-4 h-4 mr-2" />
                {loading ? 'Publicando...' : 'Publicar no Instagram'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                📱 Publica automaticamente o carousel (2 posts) no Instagram
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações adicionais */}
      <Card>
        <CardHeader>
          <CardTitle>Observações sobre o Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground mb-2">Formato Carousel (2 posts):</p>
          <p>• <strong>Post 1:</strong> Foto grande, nome, linguagens artísticas + ícone de arraste (chama atenção)</p>
          <p>• <strong>Post 2:</strong> Bio completa + redes sociais para contato (conteúdo detalhado)</p>
          <p className="mt-4 font-semibold text-foreground mb-2">Elementos de Design:</p>
          <p>• O design mantém a identidade visual da landing page (gradiente azul/roxo, grid pattern)</p>
          <p>• Logo no canto superior esquerdo + Tag "VFSR" no canto superior direito</p>
          <p>• Foto do artista em formato circular com borda decorativa (Post 1)</p>
          <p>• Ícone de arraste animado no canto inferior direito (Post 1)</p>
          <p>• Bio centralizada e legível (Post 2)</p>
          <p>• Redes sociais como botões com ícones (Post 2)</p>
          <p>• Tamanho otimizado para Instagram (1080x1080px cada post)</p>
          <p className="mt-4 text-xs text-muted-foreground italic">
            💡 Dica: O formato carousel aumenta o engajamento, pois as pessoas interagem mais com posts que têm múltiplas imagens
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

