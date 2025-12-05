'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HomePreviewClient() {
  const [homeData, setHomeData] = useState({
    // Hero Section
    mainTitle: 'Mapeamento de Artistas',
    highlightedWord: 'LGBTQIAPN+',
    subtitle: 'do município de São Roque',
    description: 'Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de',
    period: '08/12/2025 até 08/02/2026',
    
    // About Section
    aboutTag: 'Sobre o Projeto',
    aboutTitle: 'Por que mapear artistas LGBTQIAPN+?',
    aboutParagraph1: 'O projeto Visibilidade em Foco nasce da urgência de reconhecer, documentar e celebrar a existência e a produção artística da comunidade LGBTQIAPN+ no interior de São Paulo.',
    aboutParagraph2: 'Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda, onde a falta de espaços de representação e o isolamento cultural dificultam o reconhecimento e a circulação de suas produções.',
    aboutParagraph3: 'Este mapeamento não é apenas um levantamento de dados — é um ato político de resistência e afirmação. Ao registrar essas existências, criamos um arquivo vivo que valida identidades, fortalece redes de apoio e constrói um legado cultural para futuras gerações.',
    
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

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...homeData.objectives]
    newObjectives[index] = value
    setHomeData({ ...homeData, objectives: newObjectives })
  }

  const updateImpact = (index: number, field: string, value: string) => {
    const newImpacts = [...homeData.impacts]
    newImpacts[index] = { ...newImpacts[index], [field]: value }
    setHomeData({ ...homeData, impacts: newImpacts })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Preview da Home - Editor</h1>
          <p className="text-muted-foreground">
            Edite os textos e veja as mudanças em tempo real
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor - Lado Esquerdo */}
          <div className="space-y-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Seção Hero (Topo)</CardTitle>
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
                  <Textarea
                    value={homeData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
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
            <Card>
              <CardHeader>
                <CardTitle>Seção Sobre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tag</Label>
                  <Input
                    value={homeData.aboutTag}
                    onChange={(e) => updateField('aboutTag', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Título</Label>
                  <Input
                    value={homeData.aboutTitle}
                    onChange={(e) => updateField('aboutTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Parágrafo 1</Label>
                  <Textarea
                    value={homeData.aboutParagraph1}
                    onChange={(e) => updateField('aboutParagraph1', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Parágrafo 2</Label>
                  <Textarea
                    value={homeData.aboutParagraph2}
                    onChange={(e) => updateField('aboutParagraph2', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Parágrafo 3</Label>
                  <Textarea
                    value={homeData.aboutParagraph3}
                    onChange={(e) => updateField('aboutParagraph3', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Objectives */}
            <Card>
              <CardHeader>
                <CardTitle>Objetivos do Projeto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {homeData.objectives.map((obj, index) => (
                  <div key={index}>
                    <Label>Objetivo {index + 1}</Label>
                    <Input
                      value={obj}
                      onChange={(e) => updateObjective(index, e.target.value)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Impact Section */}
            <Card>
              <CardHeader>
                <CardTitle>Seção Impacto</CardTitle>
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
                  <Textarea
                    value={homeData.impactDescription}
                    onChange={(e) => updateField('impactDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Impact Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Cards de Impacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {homeData.impacts.map((impact, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-sm text-gray-600">Card {index + 1}</div>
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={impact.title}
                        onChange={(e) => updateImpact(index, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={impact.description}
                        onChange={(e) => updateImpact(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quote */}
            <Card>
              <CardHeader>
                <CardTitle>Citação Final</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Preview em Tempo Real</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 bg-white p-6 rounded-lg border">
                  {/* Hero Preview */}
                  <div className="space-y-4 text-center">
                    <div className="w-20 h-20 mx-auto mb-4">
                      <Image 
                        src="/logoN.png"
                        alt="Logo"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                      />
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
                    <p className="text-sm text-gray-600">
                      {homeData.description} <span className="font-bold text-orange-500">{homeData.period}</span>
                    </p>
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
                  <div className="space-y-4">
                    <span className="text-xs font-semibold uppercase text-orange-500">
                      {homeData.aboutTag}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {homeData.aboutTitle}
                    </h2>
                    <div className="space-y-3 text-sm text-gray-600">
                      <p>{homeData.aboutParagraph1}</p>
                      <p>{homeData.aboutParagraph2}</p>
                      <p>{homeData.aboutParagraph3}</p>
                    </div>
                    
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
                    <p className="text-sm text-gray-600 text-center">
                      {homeData.impactDescription}
                    </p>
                    
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
                              <p className="text-xs text-gray-600">
                                {impact.description}
                              </p>
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

