'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { RichTextEditor } from '@/components/rich-text-editor'
import { Plus, Trash2, MoveUp, MoveDown, Maximize2, X, Image as ImageIcon, Type, FileText, Target, Sparkles, Quote, Palette } from 'lucide-react'
import Image from 'next/image'

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

  const [homeData, setHomeData] = useState({
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
    
    // Objectives
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
    quoteAuthor: '— Equipe Visibilidade em Foco'
  })

  const updateField = (field: string, value: string) => {
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
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -top-20 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/25 to-rose-200/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
              className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: `${homeData.description} <span class="font-bold text-orange-500">${homeData.period}</span>` }}
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
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Moderno */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
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
                    value={homeData.period}
                    onChange={(e) => updateField('period', e.target.value)}
                  />
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
                  <div className="relative space-y-4 text-center bg-gradient-to-br from-white via-gray-50 to-slate-50 p-6 rounded-lg min-h-[400px]">
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
                      className="text-sm text-gray-600 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: `${homeData.description} <span class="font-bold text-orange-500">${homeData.period}</span>` }}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

