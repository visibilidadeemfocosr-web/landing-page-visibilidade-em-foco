'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Plus, Trash2, MoveUp, MoveDown, Maximize2, X, Image as ImageIcon, Type, FileText, Target, Sparkles, Quote, Palette, Save, Loader2, Upload, Trash, Instagram } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface HomeData {
  logoPath: string
  mainTitle: string
  highlightedWord: string
  subtitle: string
  description: string
  period: string | null
  heroImage?: {
    url: string
    position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'custom'
    customPosition?: {
      top?: string
      left?: string
      right?: string
      bottom?: string
    }
    size: {
      width: string
      height: string
    }
    opacity: number
  }
  aboutTag: string
  aboutSections: Array<{
    title: string
    paragraphs: string[]
  }>
  quoteBeforeObjectives?: string
  quoteAuthorBeforeObjectives?: string
  showObjectives?: boolean
  objectives: string[]
  impactTag: string
  impactTitle: string
  impactDescription: string
  impacts: Array<{
    number: string
    title: string
    description: string
  }>
  quote: string
  quoteAuthor: string
  footer?: {
    title: string
    description: string
    instagramUrl?: string
    supportTitle: string
    supportLogos: Array<{
      name: string
      imagePath: string
    }>
    copyright: string
    lgpdText: string
  }
}

export default function HomePreviewClient() {
  // Lista de logos disponíveis na pasta public
  const availableLogos = [
    { name: 'Logo Principal', path: '/logoN.png' },
    { name: 'Logo Padrão', path: '/logo.png' },
    { name: 'Logo Colorido', path: '/logo-color.png' },
    { name: 'Logo Fist', path: '/logo-fist.png' },
    { name: 'Logo Gradiente', path: '/logo-gradient.png' },
    { name: 'Logo Transparente', path: '/logo-transparent.jpg' },
    { name: 'Logo Opção 1', path: '/logo-option-1.jpg' },
    { name: 'Logo Opção 2', path: '/logo-option-2.jpg' },
    { name: 'Logo Opção 3', path: '/logo-option-3.jpg' },
    { name: 'Logo Opção 4', path: '/logo-option-4.jpg' },
    { name: 'Placeholder Logo', path: '/placeholder-logo.png' },
    { name: 'Placeholder Logo SVG', path: '/placeholder-logo.svg' },
  ]

  const [homeData, setHomeData] = useState<HomeData>({
    // Logo Section
    logoPath: '/logoN.png',
    
    // Hero Section
    mainTitle: 'Mapeamento de Artistas',
    highlightedWord: 'LGBTQIAPN+',
    subtitle: 'do município de São Roque',
    description: 'Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de',
    period: '08/12/2025 até 08/02/2026',
    
    // About Section
    aboutTag: 'Sobre o Projeto',
    aboutSections: [
      {
        title: 'Por que mapear artistas LGBTQIAPN+?',
        paragraphs: [
          'O projeto Visibilidade em Foco nasce da urgência de reconhecer, documentar e celebrar a existência e a produção artística da comunidade LGBTQIAPN+ no interior de São Paulo.',
          'Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda, onde a falta de espaços de representação e o isolamento cultural dificultam o reconhecimento e a circulação de suas produções.',
          'Este mapeamento não é apenas um levantamento de dados — é um ato político de resistência e afirmação. Ao registrar essas existências, criamos um arquivo vivo que valida identidades, fortalece redes de apoio e constrói um legado cultural para futuras gerações.'
        ]
      }
    ],
    
    // Quote before Objectives
    quoteBeforeObjectives: '',
    quoteAuthorBeforeObjectives: '',
    
    // Objectives
    showObjectives: true,
    objectives: [
      'Dar visibilidade à produção artística LGBTQIAPN+ em São Roque',
      'Criar um arquivo histórico e cultural da comunidade',
      'Fortalecer redes de apoio e colaboração entre artistas',
      'Promover políticas públicas de cultura e diversidade',
      'Combater o apagamento e a marginalização cultural'
    ],
    
    // Impact Section
    impactTag: 'Impacto Social',
    impactTitle: 'A importância de existir e resistir',
    impactDescription: 'Mais do que um levantamento de dados, este projeto é sobre dar voz, criar memória e transformar realidades.',
    
    impacts: [
      {
        number: '01',
        title: 'Reconhecimento',
        description: 'Valida a existência e o trabalho de artistas LGBTQIAPN+, criando espaço de representatividade e pertencimento.'
      },
      {
        number: '02',
        title: 'Memória',
        description: 'Documenta trajetórias e produções artísticas, construindo um acervo histórico para a comunidade.'
      },
      {
        number: '03',
        title: 'Conexão',
        description: 'Fortalece redes de apoio mútuo, colaboração e troca entre artistas da região.'
      },
      {
        number: '04',
        title: 'Transformação',
        description: 'Promove mudanças culturais e sociais através da arte e da visibilidade LGBTQIAPN+.'
      }
    ],
    
    quote: '"É nossa voz, nossa expressão e nosso talento que nos colocam no mundo — e a arte é parte essencial disso."',
    quoteAuthor: '— Equipe Visibilidade em Foco',
    
    // Footer
    footer: {
      title: 'Visibilidade em Foco',
      description: 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque',
      instagramUrl: '',
      supportTitle: 'Apoio e Realização',
      supportLogos: [
        { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
        { name: 'PNAB', imagePath: '/pnab.png' }
      ],
      copyright: '© 2025 Visibilidade em Foco. Todos os direitos reservados.',
      lgpdText: 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'
    }
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Carregar dados do banco ao montar
  useEffect(() => {
    loadHomeContent()
  }, [])

  const loadHomeContent = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/home-content', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      if (response.ok) {
        const data = await response.json()
        // Sempre atualizar, mesmo se o conteúdo estiver vazio
        if (data.content && Object.keys(data.content).length > 0) {
          // Limpar campos vazios explicitamente (converter '' para null para campos opcionais)
          const cleanedContent = { ...data.content }
          // Se period for string vazia, definir como null
          if (cleanedContent.period === '') {
            cleanedContent.period = null
          }
          // Garantir que todos os campos do tipo HomeData existam
          // IMPORTANTE: Se um campo existe no banco (mesmo que vazio), usar ele. Só usar padrão se for undefined.
          const mergedContent: HomeData = {
            logoPath: cleanedContent.logoPath !== undefined ? cleanedContent.logoPath : '/logoN.png',
            mainTitle: cleanedContent.mainTitle !== undefined ? cleanedContent.mainTitle : 'Mapeamento de Artistas',
            highlightedWord: cleanedContent.highlightedWord !== undefined ? cleanedContent.highlightedWord : 'LGBTQIAPN+',
            subtitle: cleanedContent.subtitle !== undefined ? cleanedContent.subtitle : 'do município de São Roque',
            description: cleanedContent.description !== undefined ? cleanedContent.description : 'Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de',
            period: cleanedContent.period !== undefined ? (cleanedContent.period === '' ? null : cleanedContent.period) : null,
            heroImage: cleanedContent.heroImage !== undefined ? cleanedContent.heroImage : undefined,
            aboutTag: cleanedContent.aboutTag !== undefined ? cleanedContent.aboutTag : 'Sobre o Projeto',
            aboutSections: cleanedContent.aboutSections !== undefined ? cleanedContent.aboutSections : [],
            quoteBeforeObjectives: cleanedContent.quoteBeforeObjectives !== undefined ? cleanedContent.quoteBeforeObjectives : '',
            quoteAuthorBeforeObjectives: cleanedContent.quoteAuthorBeforeObjectives !== undefined ? cleanedContent.quoteAuthorBeforeObjectives : '',
            showObjectives: cleanedContent.showObjectives !== undefined ? cleanedContent.showObjectives : true,
            objectives: cleanedContent.objectives !== undefined ? cleanedContent.objectives : [],
            impactTag: cleanedContent.impactTag !== undefined ? cleanedContent.impactTag : 'Impacto Social',
            impactTitle: cleanedContent.impactTitle !== undefined ? cleanedContent.impactTitle : 'A importância de existir e resistir',
            impactDescription: cleanedContent.impactDescription !== undefined ? cleanedContent.impactDescription : '',
            impacts: cleanedContent.impacts !== undefined ? cleanedContent.impacts : [],
            quote: cleanedContent.quote !== undefined ? cleanedContent.quote : '',
            quoteAuthor: cleanedContent.quoteAuthor !== undefined ? cleanedContent.quoteAuthor : '',
            footer: cleanedContent.footer !== undefined ? {
              ...cleanedContent.footer,
              instagramUrl: cleanedContent.footer.instagramUrl !== undefined ? cleanedContent.footer.instagramUrl : ''
            } : {
              title: 'Visibilidade em Foco',
              description: 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque',
              instagramUrl: '',
              supportTitle: 'Apoio e Realização',
              supportLogos: [
                { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
                { name: 'PNAB', imagePath: '/pnab.png' }
              ],
              copyright: '© 2025 Visibilidade em Foco. Todos os direitos reservados.',
              lgpdText: 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'
            },
          }
          setHomeData(mergedContent)
          console.log('Conteúdo carregado do banco:', mergedContent)
          console.log('Descrição específica:', mergedContent.description, 'existe no banco?', cleanedContent.description !== undefined, 'valor original:', cleanedContent.description)
          console.log('Citação antes dos objetivos:', mergedContent.quoteBeforeObjectives, 'existe no banco?', cleanedContent.quoteBeforeObjectives !== undefined)
          console.log('Autor da citação:', mergedContent.quoteAuthorBeforeObjectives, 'existe no banco?', cleanedContent.quoteAuthorBeforeObjectives !== undefined)
        } else {
          console.log('Nenhum conteúdo encontrado no banco, mantendo valores padrão')
        }
      } else {
        console.error('Erro na resposta:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
      toast.error('Erro ao carregar conteúdo do banco')
    } finally {
      setLoading(false)
    }
  }

  const saveHomeContent = async () => {
    try {
      setSaving(true)
      // Limpar campos vazios antes de salvar (converter '' para null)
      const contentToSave = { ...homeData }
      // Se period for string vazia, definir como null
      if (contentToSave.period === '') {
        contentToSave.period = null
      }
      
      console.log('Salvando conteúdo:', contentToSave)
      console.log('Descrição sendo salva:', contentToSave.description, 'tipo:', typeof contentToSave.description, 'tamanho:', contentToSave.description?.length)
      console.log('Citação antes dos objetivos:', contentToSave.quoteBeforeObjectives)
      console.log('Autor da citação:', contentToSave.quoteAuthorBeforeObjectives)
      
      const response = await fetch('/api/admin/home-content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({ content: contentToSave }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Conteúdo salvo com sucesso:', result)
        toast.success('Conteúdo salvo com sucesso!')
        setHasChanges(false)
        // Aguardar um pouco antes de recarregar para garantir que o banco foi atualizado
        setTimeout(async () => {
          await loadHomeContent()
        }, 500)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar')
      }
    } catch (error: any) {
      console.error('Erro ao salvar conteúdo:', error)
      toast.error(error.message || 'Erro ao salvar conteúdo')
    } finally {
      setSaving(false)
    }
  }

  // Marcar como alterado quando houver mudanças
  useEffect(() => {
    if (!loading) {
      setHasChanges(true)
    }
  }, [homeData, loading])

  const updateField = (field: string, value: string | null | boolean) => {
    setHomeData({ ...homeData, [field]: value })
  }

  const updateAboutSectionTitle = (sectionIndex: number, value: string) => {
    const newSections = [...homeData.aboutSections]
    newSections[sectionIndex] = { ...newSections[sectionIndex], title: value }
    setHomeData({ ...homeData, aboutSections: newSections })
  }

  const updateParagraph = (sectionIndex: number, paragraphIndex: number, value: string) => {
    const newSections = [...homeData.aboutSections]
    newSections[sectionIndex].paragraphs[paragraphIndex] = value
    setHomeData({ ...homeData, aboutSections: newSections })
  }

  const addParagraph = (sectionIndex: number) => {
    const newSections = [...homeData.aboutSections]
    newSections[sectionIndex].paragraphs.push('Novo parágrafo...')
    setHomeData({ ...homeData, aboutSections: newSections })
  }

  const removeParagraph = (sectionIndex: number, paragraphIndex: number) => {
    const newSections = [...homeData.aboutSections]
    newSections[sectionIndex].paragraphs = newSections[sectionIndex].paragraphs.filter((_, i) => i !== paragraphIndex)
    setHomeData({ ...homeData, aboutSections: newSections })
  }

  const moveParagraph = (sectionIndex: number, paragraphIndex: number, direction: 'up' | 'down') => {
    const newSections = [...homeData.aboutSections]
    const paragraphs = [...newSections[sectionIndex].paragraphs]
    const newIndex = direction === 'up' ? paragraphIndex - 1 : paragraphIndex + 1
    if (newIndex >= 0 && newIndex < paragraphs.length) {
      [paragraphs[paragraphIndex], paragraphs[newIndex]] = [paragraphs[newIndex], paragraphs[paragraphIndex]]
      newSections[sectionIndex].paragraphs = paragraphs
      setHomeData({ ...homeData, aboutSections: newSections })
    }
  }

  const addAboutSection = () => {
    setHomeData({ 
      ...homeData, 
      aboutSections: [...homeData.aboutSections, {
        title: 'Novo Título da Seção',
        paragraphs: ['Novo parágrafo...']
      }]
    })
  }

  const removeAboutSection = (sectionIndex: number) => {
    const newSections = homeData.aboutSections.filter((_, i) => i !== sectionIndex)
    setHomeData({ ...homeData, aboutSections: newSections })
  }

  const moveAboutSection = (sectionIndex: number, direction: 'up' | 'down') => {
    const newSections = [...homeData.aboutSections]
    const newIndex = direction === 'up' ? sectionIndex - 1 : sectionIndex + 1
    if (newIndex >= 0 && newIndex < newSections.length) {
      [newSections[sectionIndex], newSections[newIndex]] = [newSections[newIndex], newSections[sectionIndex]]
      setHomeData({ ...homeData, aboutSections: newSections })
    }
  }

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...homeData.objectives]
    newObjectives[index] = value
    setHomeData({ ...homeData, objectives: newObjectives })
  }

  const addObjective = () => {
    setHomeData({ 
      ...homeData, 
      objectives: [...homeData.objectives, 'Novo objetivo...'] 
    })
  }

  const removeObjective = (index: number) => {
    const newObjectives = homeData.objectives.filter((_, i) => i !== index)
    setHomeData({ ...homeData, objectives: newObjectives })
  }

  const updateImpact = (index: number, field: string, value: string) => {
    const newImpacts = [...homeData.impacts]
    newImpacts[index] = { ...newImpacts[index], [field]: value }
    setHomeData({ ...homeData, impacts: newImpacts })
  }

  const addImpactCard = () => {
    const newNumber = String(homeData.impacts.length + 1).padStart(2, '0')
    setHomeData({
      ...homeData,
      impacts: [...homeData.impacts, {
        number: newNumber,
        title: 'Novo Impacto',
        description: 'Descrição do impacto...'
      }]
    })
  }

  const removeImpactCard = (index: number) => {
    const newImpacts = homeData.impacts.filter((_, i) => i !== index)
    // Renumerar
    const renumbered = newImpacts.map((impact, i) => ({
      ...impact,
      number: String(i + 1).padStart(2, '0')
    }))
    setHomeData({ ...homeData, impacts: renumbered })
  }

  const updateFooterField = (field: string, value: string) => {
    setHomeData({
      ...homeData,
      footer: {
        ...homeData.footer!,
        [field]: value,
      },
    })
    setHasChanges(true)
  }

  const addSupportLogo = () => {
    setHomeData({
      ...homeData,
      footer: {
        ...homeData.footer!,
        supportLogos: [...homeData.footer!.supportLogos, { name: 'Novo Logo', imagePath: '' }],
      },
    })
    setHasChanges(true)
  }

  const removeSupportLogo = (index: number) => {
    const newLogos = homeData.footer!.supportLogos.filter((_, i) => i !== index)
    setHomeData({
      ...homeData,
      footer: {
        ...homeData.footer!,
        supportLogos: newLogos,
      },
    })
    setHasChanges(true)
  }

  const updateSupportLogo = (index: number, field: 'name' | 'imagePath', value: string) => {
    const newLogos = [...homeData.footer!.supportLogos]
    newLogos[index] = { ...newLogos[index], [field]: value }
    setHomeData({
      ...homeData,
      footer: {
        ...homeData.footer!,
        supportLogos: newLogos,
      },
    })
    setHasChanges(true)
  }

  const [fullScreenOpen, setFullScreenOpen] = useState(false)

  // Componente de Preview Completo (reutilizável)
  const FullPreview = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-gray-50 to-slate-50">
        {/* Logo no canto superior esquerdo - igual à home principal */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
          <div className="w-32 h-32 md:w-40 md:h-40">
            <Image 
              src={homeData.logoPath}
              alt="Visibilidade em Foco"
              width={160}
              height={160}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {/* Blobs decorativos sutis sobre fundo branco */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/25 to-rose-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-200/28 to-indigo-200/28 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-20 right-40 w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute -bottom-32 -left-20 w-[450px] h-[450px] bg-gradient-to-br from-violet-200/25 to-purple-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Hero Image */}
          {homeData.heroImage?.url && (
            <div
              className="absolute z-0"
              style={{
                ...(homeData.heroImage.position === 'top-left' && { top: 0, left: 0 }),
                ...(homeData.heroImage.position === 'top-center' && { top: 0, left: '50%', transform: 'translateX(-50%)' }),
                ...(homeData.heroImage.position === 'top-right' && { top: 0, right: 0 }),
                ...(homeData.heroImage.position === 'center-left' && { top: '50%', left: 0, transform: 'translateY(-50%)' }),
                ...(homeData.heroImage.position === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
                ...(homeData.heroImage.position === 'center-right' && { top: '50%', right: 0, transform: 'translateY(-50%)' }),
                ...(homeData.heroImage.position === 'bottom-left' && { bottom: 0, left: 0 }),
                ...(homeData.heroImage.position === 'bottom-center' && { bottom: 0, left: '50%', transform: 'translateX(-50%)' }),
                ...(homeData.heroImage.position === 'bottom-right' && { bottom: 0, right: 0 }),
                ...(homeData.heroImage.position === 'custom' && homeData.heroImage.customPosition),
                width: homeData.heroImage.size.width,
                height: homeData.heroImage.size.height,
                opacity: homeData.heroImage.opacity / 100,
              }}
            >
              <img
                src={homeData.heroImage.url}
                alt="Hero background"
                className="w-full h-full object-cover"
                style={{
                  width: homeData.heroImage.size.width,
                  height: homeData.heroImage.size.height,
                }}
              />
            </div>
          )}

          {/* Grid pattern sutil para fundo claro */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.95] tracking-tight text-balance">
              {homeData.mainTitle}{' '}
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #E40303 0%, #FF8C00 20%, #FFED00 40%, #008026 60%, #24408E 80%, #732982 100%)'
                }}
              >
                {homeData.highlightedWord}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed tracking-wide font-bold">
              {homeData.subtitle}
            </p>
            <div 
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-heading prose prose-sm max-w-none [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p]:whitespace-pre-line"
              dangerouslySetInnerHTML={{ 
                __html: homeData.period && homeData.period !== null && homeData.period.trim() !== '' 
                  ? `${homeData.description} <span class="font-bold text-orange-500">${homeData.period}</span>` 
                  : homeData.description 
              }}
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8 py-6 text-lg">
                PARTICIPE
              </Button>
              <Button variant="outline" className="border-2 border-gray-900 rounded-full px-8 py-6 text-lg">
                SAIBA MAIS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase text-orange-500 tracking-wider">
                {homeData.aboutTag}
              </span>
            </div>
            
            {homeData.aboutSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                {sectionIndex > 0 && <div className="border-t pt-12" />}
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                  {section.title}
                </h2>
                <div className="space-y-4 text-lg text-gray-600 leading-relaxed prose prose-lg max-w-none">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <div 
                      key={paragraphIndex}
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </div>
              </div>
            ))}
            
            {/* Quote Before Objectives */}
            {homeData.quoteBeforeObjectives && (
              <div className="mt-12 text-center max-w-3xl mx-auto">
                <blockquote className="text-xl md:text-2xl font-bold text-gray-900 italic text-balance leading-tight">
                  {homeData.quoteBeforeObjectives}
                </blockquote>
                {homeData.quoteAuthorBeforeObjectives && (
                  <p className="mt-3 text-sm text-gray-600">
                    {homeData.quoteAuthorBeforeObjectives}
                  </p>
                )}
              </div>
            )}
            
            {homeData.showObjectives !== false && (
              <div className="pt-12 border-t mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Objetivos do projeto</h3>
                <ul className="space-y-4 text-lg text-gray-600 max-w-2xl mx-auto">
                  {homeData.objectives.map((obj, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-orange-500 font-bold text-xl mt-1">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase text-orange-500 tracking-wider">
                {homeData.impactTag}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4">
                {homeData.impactTitle}
              </h2>
              <div 
                className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: homeData.impactDescription }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {homeData.impacts.map((impact) => (
                <div key={impact.number} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex gap-4">
                    <span className="text-4xl font-bold text-orange-500/20 flex-shrink-0">
                      {impact.number}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {impact.title}
                      </h3>
                      <div 
                        className="text-gray-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: impact.description }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-12 text-center">
              <blockquote className="text-2xl font-bold text-gray-900 italic max-w-3xl mx-auto">
                {homeData.quote}
              </blockquote>
              <p className="text-sm text-gray-600 mt-4">
                {homeData.quoteAuthor}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 text-gray-800 py-12 relative overflow-hidden border-t border-gray-200">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Título e descrição */}
            <div className="text-center space-y-4 mb-8">
              <h3 className="text-2xl font-bold text-orange-500 font-heading">
                {homeData.footer?.title || 'Visibilidade em Foco'}
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {homeData.footer?.description || 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque'}
              </p>
            </div>

            {/* Seção Siga-nos no Instagram */}
            {homeData.footer?.instagramUrl && (() => {
              // Normalizar URL do Instagram
              const normalizeUrl = (url: string) => {
                url = url.trim()
                if (url.startsWith('http://') || url.startsWith('https://')) return url
                if (url.startsWith('instagram.com/') || url.startsWith('www.instagram.com/')) return `https://${url}`
                if (url.startsWith('@')) return `https://instagram.com/${url.substring(1)}`
                return `https://instagram.com/${url}`
              }
              const normalizedUrl = normalizeUrl(homeData.footer!.instagramUrl!)
              return (
                <div className="text-center mb-8">
                  <p className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                    Siga-nos no Instagram
                  </p>
                  <a
                    href={normalizedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Instagram className="w-6 h-6" />
                    <span>@visibilidadeemfoco</span>
                  </a>
                </div>
              )
            })()}

            {/* Seção de Apoio/Realização */}
            {homeData.footer?.supportLogos && homeData.footer.supportLogos.length > 0 && (
              <div className="py-6 border-y border-gray-300">
                <p className="text-center text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                  {homeData.footer.supportTitle || 'Apoio e Realização'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6">
                  {homeData.footer.supportLogos.map((logo, index) => (
                    logo.imagePath && (
                      <div key={index} className="h-12 md:h-16 flex items-center">
                        <Image 
                          src={logo.imagePath}
                          alt={logo.name}
                          width={120}
                          height={60}
                          className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                          unoptimized
                        />
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
            
            {/* Copyright e links */}
            <div className="pt-6 text-center space-y-2">
              <p className="text-xs text-gray-600">
                {homeData.footer?.copyright || '© 2025 Visibilidade em Foco. Todos os direitos reservados.'}
              </p>
              <p className="text-xs text-gray-500">
                <a 
                  href="/admin" 
                  className="hover:text-gray-700 transition-colors underline underline-offset-2"
                >
                  Área Administrativa
                </a>
              </p>
              {homeData.footer?.lgpdText && (
                <p className="text-xs text-gray-600">
                  {homeData.footer.lgpdText}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Moderno */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">Editor da Home</h1>
                <p className="text-gray-600 mt-1">
                  Edite os textos e veja as mudanças em tempo real
                </p>
              </div>
            </div>
            <Button
              onClick={saveHomeContent}
              disabled={saving || loading || !hasChanges}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando conteúdo...
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor - Lado Esquerdo */}
          <div className="space-y-6">
            {/* Logo Section */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Logo</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Selecione o Logo</Label>
                  <Select
                    value={homeData.logoPath}
                    onValueChange={(value) => updateField('logoPath', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um logo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLogos.map((logo) => (
                        <SelectItem key={logo.path} value={logo.path}>
                          {logo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                  <Label className="text-xs text-gray-600 mb-2 block">Preview do Logo:</Label>
                  <div className="w-32 h-32 mx-auto flex items-center justify-center bg-white rounded-lg p-2 border">
                    <Image
                      src={homeData.logoPath}
                      alt="Logo Preview"
                      width={120}
                      height={120}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hero Section */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                    <Type className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Seção Hero (Topo)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título Principal</Label>
                  <Input
                    value={homeData.mainTitle}
                    onChange={(e) => updateField('mainTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Palavra Destacada (colorida)</Label>
                  <Input
                    value={homeData.highlightedWord}
                    onChange={(e) => updateField('highlightedWord', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={homeData.subtitle}
                    onChange={(e) => updateField('subtitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <RichTextEditor
                    content={homeData.description}
                    onChange={(content) => updateField('description', content)}
                    placeholder="Digite a descrição do projeto..."
                  />
                </div>
                <div>
                  <Label>Período</Label>
                  <Input
                    value={homeData.period || ''}
                    onChange={(e) => updateField('period', e.target.value || null)}
                  />
                </div>
                
                {/* Hero Image Section */}
                <div className="border-t pt-4 mt-4">
                  <Label className="text-base font-semibold mb-3 block">Imagem de Fundo do Hero</Label>
                  
                  {homeData.heroImage?.url ? (
                    <div className="space-y-4">
                      {/* Preview Interativo da Imagem */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Preview Interativo - Arraste a imagem para posicionar</Label>
                        <div 
                          className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 cursor-move"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            const container = e.currentTarget
                            const containerRect = container.getBoundingClientRect()
                            
                            // Converter posição atual para coordenadas se não for custom
                            let currentLeft = 50
                            let currentTop = 50
                            
                            if (homeData.heroImage?.position === 'custom' && homeData.heroImage.customPosition) {
                              const left = homeData.heroImage.customPosition.left
                              const top = homeData.heroImage.customPosition.top
                              currentLeft = left ? parseFloat(left.replace('%', '').replace('px', '')) : 50
                              currentTop = top ? parseFloat(top.replace('%', '').replace('px', '')) : 50
                            } else {
                              // Converter posição pré-definida para coordenadas
                              const positions: Record<string, { left: number; top: number }> = {
                                'top-left': { left: 0, top: 0 },
                                'top-center': { left: 50, top: 0 },
                                'top-right': { left: 100, top: 0 },
                                'center-left': { left: 0, top: 50 },
                                'center': { left: 50, top: 50 },
                                'center-right': { left: 100, top: 50 },
                                'bottom-left': { left: 0, top: 100 },
                                'bottom-center': { left: 50, top: 100 },
                                'bottom-right': { left: 100, top: 100 },
                              }
                              const pos = positions[homeData.heroImage?.position || 'center']
                              if (pos) {
                                currentLeft = pos.left
                                currentTop = pos.top
                              }
                            }
                            
                            const startX = e.clientX
                            const startY = e.clientY
                            
                            const handleMouseMove = (moveEvent: MouseEvent) => {
                              const deltaX = moveEvent.clientX - startX
                              const deltaY = moveEvent.clientY - startY
                              
                              const percentX = (deltaX / containerRect.width) * 100
                              const percentY = (deltaY / containerRect.height) * 100
                              
                              const newLeft = Math.max(0, Math.min(100, currentLeft + percentX))
                              const newTop = Math.max(0, Math.min(100, currentTop + percentY))
                              
                              setHomeData({
                                ...homeData,
                                heroImage: {
                                  ...homeData.heroImage!,
                                  position: 'custom',
                                  customPosition: {
                                    left: `${newLeft}%`,
                                    top: `${newTop}%`,
                                  },
                                },
                              })
                            }
                            
                            const handleMouseUp = () => {
                              document.removeEventListener('mousemove', handleMouseMove)
                              document.removeEventListener('mouseup', handleMouseUp)
                            }
                            
                            document.addEventListener('mousemove', handleMouseMove)
                            document.addEventListener('mouseup', handleMouseUp)
                          }}
                        >
                          <img
                            src={homeData.heroImage.url}
                            alt="Hero preview"
                            className="absolute cursor-move select-none"
                            style={{
                              opacity: homeData.heroImage.opacity / 100,
                              width: homeData.heroImage.size.width,
                              height: homeData.heroImage.size.height,
                              ...(homeData.heroImage.position === 'custom' && homeData.heroImage.customPosition
                                ? {
                                    left: homeData.heroImage.customPosition.left || '50%',
                                    top: homeData.heroImage.customPosition.top || '50%',
                                    right: homeData.heroImage.customPosition.right,
                                    bottom: homeData.heroImage.customPosition.bottom,
                                    transform: 'translate(-50%, -50%)',
                                  }
                                : {
                                    ...(homeData.heroImage.position === 'top-left' && { top: 0, left: 0, transform: 'none' }),
                                    ...(homeData.heroImage.position === 'top-center' && { top: 0, left: '50%', transform: 'translateX(-50%)' }),
                                    ...(homeData.heroImage.position === 'top-right' && { top: 0, right: 0, transform: 'none' }),
                                    ...(homeData.heroImage.position === 'center-left' && { top: '50%', left: 0, transform: 'translateY(-50%)' }),
                                    ...(homeData.heroImage.position === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
                                    ...(homeData.heroImage.position === 'center-right' && { top: '50%', right: 0, transform: 'translateY(-50%)' }),
                                    ...(homeData.heroImage.position === 'bottom-left' && { bottom: 0, left: 0, transform: 'none' }),
                                    ...(homeData.heroImage.position === 'bottom-center' && { bottom: 0, left: '50%', transform: 'translateX(-50%)' }),
                                    ...(homeData.heroImage.position === 'bottom-right' && { bottom: 0, right: 0, transform: 'none' }),
                                  }),
                              pointerEvents: 'none',
                            }}
                            draggable={false}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                              setHomeData({
                                ...homeData,
                                heroImage: undefined,
                              })
                            }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-xs text-gray-500">
                            💡 Clique e arraste a imagem no preview acima para posicioná-la
                          </p>
                          {homeData.heroImage.position === 'custom' && homeData.heroImage.customPosition && (
                            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              {homeData.heroImage.customPosition.left && `Esquerda: ${homeData.heroImage.customPosition.left} `}
                              {homeData.heroImage.customPosition.top && `Topo: ${homeData.heroImage.customPosition.top} `}
                              {homeData.heroImage.customPosition.right && `Direita: ${homeData.heroImage.customPosition.right} `}
                              {homeData.heroImage.customPosition.bottom && `Inferior: ${homeData.heroImage.customPosition.bottom}`}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Posicionamento */}
                      <div>
                        <Label>Posicionamento</Label>
                        <Select
                          value={homeData.heroImage.position}
                          onValueChange={(value: any) => {
                            setHomeData({
                              ...homeData,
                              heroImage: {
                                ...homeData.heroImage!,
                                position: value,
                                // Inicializar customPosition se for personalizado
                                customPosition: value === 'custom' 
                                  ? (homeData.heroImage?.customPosition || { right: '0', top: '50%' })
                                  : homeData.heroImage?.customPosition,
                              },
                            })
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="center">Centro (padrão)</SelectItem>
                            <SelectItem value="center-left">Esquerda (centro vertical)</SelectItem>
                            <SelectItem value="center-right">Direita (centro vertical)</SelectItem>
                            <SelectItem value="top-left">Superior Esquerda</SelectItem>
                            <SelectItem value="top-center">Superior Centro</SelectItem>
                            <SelectItem value="top-right">Superior Direita</SelectItem>
                            <SelectItem value="bottom-left">Inferior Esquerda</SelectItem>
                            <SelectItem value="bottom-center">Inferior Centro</SelectItem>
                            <SelectItem value="bottom-right">Inferior Direita</SelectItem>
                            <SelectItem value="custom">Personalizado (posição exata)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Campos de posicionamento personalizado */}
                      {homeData.heroImage.position === 'custom' && (
                        <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <Label className="text-sm font-semibold">Posição Personalizada</Label>
                          <p className="text-xs text-gray-600 mb-3">
                            Defina a posição exata da imagem usando pixels (px) ou porcentagem (%). 
                            Deixe vazio para não definir.
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Topo</Label>
                              <Input
                                type="text"
                                value={homeData.heroImage.customPosition?.top || ''}
                                onChange={(e) => {
                                  setHomeData({
                                    ...homeData,
                                    heroImage: {
                                      ...homeData.heroImage!,
                                      customPosition: {
                                        ...homeData.heroImage!.customPosition,
                                        top: e.target.value || undefined,
                                      },
                                    },
                                  })
                                }}
                                placeholder="ex: 20px, 10%"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Esquerda</Label>
                              <Input
                                type="text"
                                value={homeData.heroImage.customPosition?.left || ''}
                                onChange={(e) => {
                                  setHomeData({
                                    ...homeData,
                                    heroImage: {
                                      ...homeData.heroImage!,
                                      customPosition: {
                                        ...homeData.heroImage!.customPosition,
                                        left: e.target.value || undefined,
                                      },
                                    },
                                  })
                                }}
                                placeholder="ex: 20px, 10%"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Direita</Label>
                              <Input
                                type="text"
                                value={homeData.heroImage.customPosition?.right || ''}
                                onChange={(e) => {
                                  setHomeData({
                                    ...homeData,
                                    heroImage: {
                                      ...homeData.heroImage!,
                                      customPosition: {
                                        ...homeData.heroImage!.customPosition,
                                        right: e.target.value || undefined,
                                      },
                                    },
                                  })
                                }}
                                placeholder="ex: 20px, 10%"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Inferior</Label>
                              <Input
                                type="text"
                                value={homeData.heroImage.customPosition?.bottom || ''}
                                onChange={(e) => {
                                  setHomeData({
                                    ...homeData,
                                    heroImage: {
                                      ...homeData.heroImage!,
                                      customPosition: {
                                        ...homeData.heroImage!.customPosition,
                                        bottom: e.target.value || undefined,
                                      },
                                    },
                                  })
                                }}
                                placeholder="ex: 20px, 10%"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Tamanho */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Largura</Label>
                          <Input
                            type="text"
                            value={homeData.heroImage.size.width}
                            onChange={(e) => {
                              setHomeData({
                                ...homeData,
                                heroImage: {
                                  ...homeData.heroImage!,
                                  size: {
                                    ...homeData.heroImage!.size,
                                    width: e.target.value,
                                  },
                                },
                              })
                            }}
                            placeholder="ex: 100%, 500px, auto"
                          />
                        </div>
                        <div>
                          <Label>Altura</Label>
                          <Input
                            type="text"
                            value={homeData.heroImage.size.height}
                            onChange={(e) => {
                              setHomeData({
                                ...homeData,
                                heroImage: {
                                  ...homeData.heroImage!,
                                  size: {
                                    ...homeData.heroImage!.size,
                                    height: e.target.value,
                                  },
                                },
                              })
                            }}
                            placeholder="ex: 100%, 500px, auto"
                          />
                        </div>
                      </div>
                      
                      {/* Opacidade */}
                      <div>
                        <Label>Opacidade: {homeData.heroImage.opacity}%</Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={homeData.heroImage.opacity}
                          onChange={(e) => {
                            setHomeData({
                              ...homeData,
                              heroImage: {
                                ...homeData.heroImage!,
                                opacity: parseInt(e.target.value),
                              },
                            })
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="hero-image-upload" className="cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Clique para fazer upload de uma imagem</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP até 5MB</p>
                        </div>
                      </Label>
                      <input
                        id="hero-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            
                            const response = await fetch('/api/admin/upload-hero-image', {
                              method: 'POST',
                              body: formData,
                            })
                            
                            if (response.ok) {
                              const data = await response.json()
                              setHomeData({
                                ...homeData,
                                heroImage: {
                                  url: data.url,
                                  position: 'center',
                                  size: {
                                    width: '100%',
                                    height: '100%',
                                  },
                                  opacity: 100,
                                },
                              })
                              toast.success('Imagem enviada com sucesso!')
                            } else {
                              const error = await response.json()
                              toast.error(error.error || 'Erro ao fazer upload')
                            }
                          } catch (error: any) {
                            console.error('Erro ao fazer upload:', error)
                            toast.error('Erro ao fazer upload da imagem')
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Seção Sobre</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addAboutSection}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Seção
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Tag</Label>
                  <Input
                    value={homeData.aboutTag}
                    onChange={(e) => updateField('aboutTag', e.target.value)}
                  />
                </div>
                
                {homeData.aboutSections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">Seção {sectionIndex + 1}</Label>
                      <div className="flex gap-1">
                        {sectionIndex > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveAboutSection(sectionIndex, 'up')}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoveUp className="w-4 h-4 text-gray-600" />
                          </Button>
                        )}
                        {sectionIndex < homeData.aboutSections.length - 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveAboutSection(sectionIndex, 'down')}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <MoveDown className="w-4 h-4 text-gray-600" />
                          </Button>
                        )}
                        {homeData.aboutSections.length > 1 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAboutSection(sectionIndex)}
                            className="h-8 w-8 p-0 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Título da Seção</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateAboutSectionTitle(sectionIndex, e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Parágrafos</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addParagraph(sectionIndex)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar Parágrafo
                        </Button>
                      </div>
                      
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <div key={paragraphIndex} className="space-y-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Parágrafo {paragraphIndex + 1}</Label>
                            <div className="flex gap-1">
                              {paragraphIndex > 0 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => moveParagraph(sectionIndex, paragraphIndex, 'up')}
                                  className="h-7 w-7 p-0 hover:bg-gray-100"
                                >
                                  <MoveUp className="w-3 h-3 text-gray-600" />
                                </Button>
                              )}
                              {paragraphIndex < section.paragraphs.length - 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => moveParagraph(sectionIndex, paragraphIndex, 'down')}
                                  className="h-7 w-7 p-0 hover:bg-gray-100"
                                >
                                  <MoveDown className="w-3 h-3 text-gray-600" />
                                </Button>
                              )}
                              {section.paragraphs.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeParagraph(sectionIndex, paragraphIndex)}
                                  className="h-7 w-7 p-0 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <RichTextEditor
                            content={paragraph}
                            onChange={(content) => updateParagraph(sectionIndex, paragraphIndex, content)}
                            placeholder="Digite o parágrafo..."
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quote Before Objectives */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Citação (Antes dos Objetivos)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Citação</Label>
                  <Textarea
                    value={homeData.quoteBeforeObjectives || ''}
                    onChange={(e) => updateField('quoteBeforeObjectives', e.target.value)}
                    placeholder="Digite a citação..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Autor da Citação</Label>
                  <Input
                    value={homeData.quoteAuthorBeforeObjectives || ''}
                    onChange={(e) => updateField('quoteAuthorBeforeObjectives', e.target.value)}
                    placeholder="ex: — Equipe Visibilidade em Foco"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Objetivos do Projeto</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                      <input
                        type="checkbox"
                        id="show-objectives"
                        checked={homeData.showObjectives !== false}
                        onChange={(e) => updateField('showObjectives', e.target.checked)}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <Label htmlFor="show-objectives" className="text-sm font-medium cursor-pointer">
                        Exibir na home
                      </Label>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addObjective}
                      className="bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {homeData.objectives.map((obj, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1"
                    />
                    {homeData.objectives.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeObjective(index)}
                        className="h-8 w-8 p-0 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Impact Section */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Seção Impacto</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tag</Label>
                  <Input
                    value={homeData.impactTag}
                    onChange={(e) => updateField('impactTag', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Título</Label>
                  <Input
                    value={homeData.impactTitle}
                    onChange={(e) => updateField('impactTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <RichTextEditor
                    content={homeData.impactDescription}
                    onChange={(content) => updateField('impactDescription', content)}
                    placeholder="Digite a descrição do impacto..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Impact Cards */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Cards de Impacto</CardTitle>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={addImpactCard}
                    className="bg-white hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Card
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {homeData.impacts.map((impact, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm text-gray-600">Card {impact.number}</div>
                      {homeData.impacts.length > 1 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeImpactCard(index)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={impact.title}
                        onChange={(e) => updateImpact(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <RichTextEditor
                        content={impact.description}
                        onChange={(content) => updateImpact(index, 'description', content)}
                        placeholder="Digite a descrição do impacto..."
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quote */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Citação Final</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Texto da Citação</Label>
                  <Textarea
                    value={homeData.quote}
                    onChange={(e) => updateField('quote', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Autor</Label>
                  <Input
                    value={homeData.quoteAuthor}
                    onChange={(e) => updateField('quoteAuthor', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Footer Section */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg">Rodapé (Footer)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={homeData.footer?.title || ''}
                    onChange={(e) => updateFooterField('title', e.target.value)}
                    placeholder="Visibilidade em Foco"
                  />
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={homeData.footer?.description || ''}
                    onChange={(e) => updateFooterField('description', e.target.value)}
                    placeholder="Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque"
                  />
                </div>
                <div>
                  <Label>URL do Instagram</Label>
                  <Input
                    value={homeData.footer?.instagramUrl || ''}
                    onChange={(e) => updateFooterField('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/visibilidadeemfoco"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Link completo do perfil do Instagram (ex: https://instagram.com/visibilidadeemfoco)
                  </p>
                </div>
                <div>
                  <Label>Título da Seção de Apoio</Label>
                  <Input
                    value={homeData.footer?.supportTitle || ''}
                    onChange={(e) => updateFooterField('supportTitle', e.target.value)}
                    placeholder="Apoio e Realização"
                  />
                </div>
                
                {/* Logos de Apoio */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Logos de Apoio/Realização</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addSupportLogo}
                      className="bg-white hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Logo
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {homeData.footer?.supportLogos.map((logo, index) => (
                      <Card key={index} className="p-3 bg-gray-50">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={logo.name}
                              onChange={(e) => updateSupportLogo(index, 'name', e.target.value)}
                              placeholder="Nome do logo (ex: Prefeitura de São Roque)"
                            />
                            <Input
                              value={logo.imagePath}
                              onChange={(e) => updateSupportLogo(index, 'imagePath', e.target.value)}
                              placeholder="Caminho da imagem (ex: /prefeitura.png)"
                            />
                          </div>
                          {homeData.footer!.supportLogos.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSupportLogo(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Copyright</Label>
                  <Input
                    value={homeData.footer?.copyright || ''}
                    onChange={(e) => updateFooterField('copyright', e.target.value)}
                    placeholder="© 2025 Visibilidade em Foco. Todos os direitos reservados."
                  />
                </div>
                <div>
                  <Label>Texto LGPD</Label>
                  <Input
                    value={homeData.footer?.lgpdText || ''}
                    onChange={(e) => updateFooterField('lgpdText', e.target.value)}
                    placeholder="Este projeto respeita a privacidade e os dados pessoais conforme a LGPD."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview - Lado Direito */}
          <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] overflow-y-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-pink-500">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Preview em Tempo Real</CardTitle>
                  </div>
                  <Dialog open={fullScreenOpen} onOpenChange={setFullScreenOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 shadow-sm">
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Ver em Tela Cheia
                      </Button>
                    </DialogTrigger>
                    <DialogContent 
                      className="max-w-[100vw] w-screen h-screen p-0 m-0 rounded-none translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]"
                      showCloseButton={false}
                    >
                      <DialogHeader>
                        <DialogTitle className="sr-only">Preview da Home em Tela Cheia</DialogTitle>
                      </DialogHeader>
                      <div className="relative w-full h-full overflow-auto">
                        <div className="fixed top-4 right-4 z-50">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setFullScreenOpen(false)}
                            className="bg-white/90 hover:bg-white shadow-lg"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Fechar
                          </Button>
                        </div>
                        <FullPreview />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-8 bg-white p-6 rounded-lg">
                  {/* Hero Preview */}
                  <div className="relative space-y-4 text-center bg-gradient-to-br from-white via-gray-50 to-slate-50 p-6 rounded-lg min-h-[400px] overflow-hidden">
                    {/* Hero Image Background */}
                    {homeData.heroImage?.url && (
                      <div
                        className="absolute inset-0 z-0"
                        style={{
                          ...(homeData.heroImage.position === 'top-left' && { top: 0, left: 0 }),
                          ...(homeData.heroImage.position === 'top-center' && { top: 0, left: '50%', transform: 'translateX(-50%)' }),
                          ...(homeData.heroImage.position === 'top-right' && { top: 0, right: 0 }),
                          ...(homeData.heroImage.position === 'center-left' && { top: '50%', left: 0, transform: 'translateY(-50%)' }),
                          ...(homeData.heroImage.position === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
                          ...(homeData.heroImage.position === 'center-right' && { top: '50%', right: 0, transform: 'translateY(-50%)' }),
                          ...(homeData.heroImage.position === 'bottom-left' && { bottom: 0, left: 0 }),
                          ...(homeData.heroImage.position === 'bottom-center' && { bottom: 0, left: '50%', transform: 'translateX(-50%)' }),
                          ...(homeData.heroImage.position === 'bottom-right' && { bottom: 0, right: 0 }),
                          ...(homeData.heroImage.position === 'custom' && homeData.heroImage.customPosition),
                          width: homeData.heroImage.size.width,
                          height: homeData.heroImage.size.height,
                          opacity: homeData.heroImage.opacity / 100,
                        }}
                      >
                        <img
                          src={homeData.heroImage.url}
                          alt="Hero background"
                          className="w-full h-full object-cover"
                          style={{
                            width: homeData.heroImage.size.width,
                            height: homeData.heroImage.size.height,
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Logo no canto superior esquerdo - igual à home principal */}
                    <div className="absolute top-2 left-2 z-20">
                      <div className="w-16 h-16 md:w-20 md:h-20">
                        <Image 
                          src={homeData.logoPath}
                          alt="Visibilidade em Foco"
                          width={80}
                          height={80}
                          className="w-full h-full object-contain drop-shadow-lg"
                        />
                      </div>
                    </div>
                    <div className="relative z-10 space-y-4">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {homeData.mainTitle}{' '}
                        <span 
                          className="bg-clip-text text-transparent"
                          style={{
                            backgroundImage: 'linear-gradient(to right, #E40303 0%, #FF8C00 20%, #FFED00 40%, #008026 60%, #24408E 80%, #732982 100%)'
                          }}
                        >
                          {homeData.highlightedWord}
                        </span>
                      </h1>
                      <p className="text-xl font-bold text-gray-700">
                        {homeData.subtitle}
                      </p>
                      <div 
                        className="text-sm text-gray-600 prose prose-sm max-w-none [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p]:whitespace-pre-line"
                        dangerouslySetInnerHTML={{ 
                          __html: homeData.period && homeData.period !== null && homeData.period.trim() !== '' 
                            ? `${homeData.description} <span class="font-bold text-orange-500">${homeData.period}</span>` 
                            : homeData.description 
                        }}
                      />
                      <div className="flex gap-3 justify-center pt-4">
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full">
                        PARTICIPE
                      </Button>
                      <Button variant="outline" className="border-2 border-gray-900 rounded-full">
                        SAIBA MAIS
                      </Button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-8" />

                  {/* About Preview */}
                  <div className="space-y-8">
                    <span className="text-xs font-semibold uppercase text-orange-500">
                      {homeData.aboutTag}
                    </span>
                    
                    {homeData.aboutSections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="space-y-4">
                        {sectionIndex > 0 && <div className="border-t pt-6" />}
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                        <div className="space-y-3 text-sm text-gray-600 prose prose-sm max-w-none">
                          {section.paragraphs.map((paragraph, paragraphIndex) => (
                            <div 
                              key={paragraphIndex}
                              dangerouslySetInnerHTML={{ __html: paragraph }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    {/* Quote Before Objectives */}
                    {homeData.quoteBeforeObjectives && (
                      <div className="mt-8 text-center max-w-2xl mx-auto">
                        <blockquote className="text-lg md:text-xl font-bold text-gray-900 italic text-balance leading-tight">
                          {homeData.quoteBeforeObjectives}
                        </blockquote>
                        {homeData.quoteAuthorBeforeObjectives && (
                          <p className="mt-2 text-xs text-gray-600">
                            {homeData.quoteAuthorBeforeObjectives}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {homeData.showObjectives !== false && (
                      <div className="pt-4 border-t mt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Objetivos do projeto</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                          {homeData.objectives.map((obj, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500 font-bold">•</span>
                              <span>{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-8" />

                  {/* Impact Preview */}
                  <div className="space-y-4">
                    <span className="text-xs font-semibold uppercase text-orange-500">
                      {homeData.impactTag}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 text-center">
                      {homeData.impactTitle}
                    </h2>
                    <div 
                      className="text-sm text-gray-600 text-center prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: homeData.impactDescription }}
                    />
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {homeData.impacts.map((impact) => (
                        <div key={impact.number} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex gap-3">
                            <span className="text-2xl font-bold text-orange-500/20">
                              {impact.number}
                            </span>
                            <div>
                              <h3 className="text-sm font-bold text-gray-900 mb-1">
                                {impact.title}
                              </h3>
                              <div 
                                className="text-xs text-gray-600 prose prose-xs max-w-none"
                                dangerouslySetInnerHTML={{ __html: impact.description }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-6 text-center">
                      <blockquote className="text-lg font-bold text-gray-900 italic">
                        {homeData.quote}
                      </blockquote>
                      <p className="text-xs text-gray-600 mt-2">
                        {homeData.quoteAuthor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Preview */}
                <footer className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 text-gray-800 py-8 relative overflow-hidden border-t border-gray-200">
                  <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-6xl mx-auto">
                      {/* Título e descrição */}
                      <div className="text-center space-y-3 mb-6">
                        <h3 className="text-xl font-bold text-orange-500 font-heading">
                          {homeData.footer?.title || 'Visibilidade em Foco'}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-sm">
                          {homeData.footer?.description || 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque'}
                        </p>
                      </div>

                      {/* Seção Siga-nos no Instagram */}
                      {homeData.footer?.instagramUrl && (() => {
                        // Normalizar URL do Instagram
                        const normalizeUrl = (url: string) => {
                          url = url.trim()
                          if (url.startsWith('http://') || url.startsWith('https://')) return url
                          if (url.startsWith('instagram.com/') || url.startsWith('www.instagram.com/')) return `https://${url}`
                          if (url.startsWith('@')) return `https://instagram.com/${url.substring(1)}`
                          return `https://instagram.com/${url}`
                        }
                        const normalizedUrl = normalizeUrl(homeData.footer!.instagramUrl!)
                        return (
                          <div className="text-center mb-6">
                            <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                              Siga-nos no Instagram
                            </p>
                            <a
                              href={normalizedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                              <Instagram className="w-5 h-5" />
                              <span>@visibilidadeemfoco</span>
                            </a>
                          </div>
                        )
                      })()}

                      {/* Seção de Apoio/Realização */}
                      {homeData.footer?.supportLogos && homeData.footer.supportLogos.length > 0 && (
                        <div className="py-4 border-y border-gray-300">
                          <p className="text-center text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">
                            {homeData.footer.supportTitle || 'Apoio e Realização'}
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-4">
                            {homeData.footer.supportLogos.map((logo, index) => (
                              logo.imagePath && (
                                <div key={index} className="h-10 md:h-12 flex items-center">
                                  <Image 
                                    src={logo.imagePath}
                                    alt={logo.name}
                                    width={100}
                                    height={50}
                                    className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                                    unoptimized
                                  />
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Copyright e links */}
                      <div className="pt-4 text-center space-y-1">
                        <p className="text-xs text-gray-600">
                          {homeData.footer?.copyright || '© 2025 Visibilidade em Foco. Todos os direitos reservados.'}
                        </p>
                        <p className="text-xs text-gray-500">
                          <a 
                            href="/admin" 
                            className="hover:text-gray-700 transition-colors underline underline-offset-2"
                          >
                            Área Administrativa
                          </a>
                        </p>
                        {homeData.footer?.lgpdText && (
                          <p className="text-xs text-gray-600">
                            {homeData.footer.lgpdText}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </footer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

