import { useState, useEffect } from 'react'

interface HomeContent {
  logoPath?: string
  mainTitle?: string
  highlightedWord?: string
  subtitle?: string
  description?: string
  period?: string | null
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
  aboutTag?: string
  aboutSections?: Array<{
    title: string
    paragraphs: string[]
  }>
  quoteBeforeObjectives?: string
  quoteAuthorBeforeObjectives?: string
  showObjectives?: boolean
  objectives?: string[]
  impactTag?: string
  impactTitle?: string
  impactDescription?: string
  impacts?: Array<{
    number: string
    title: string
    description: string
  }>
  quote?: string
  quoteAuthor?: string
  footer?: {
    title: string
    description: string
    supportTitle: string
    supportLogos: Array<{
      name: string
      imagePath: string
    }>
    copyright: string
    lgpdText: string
  }
}

const defaultContent: HomeContent = {
  logoPath: '/logoN.png',
  mainTitle: 'Mapeamento de Artistas',
  highlightedWord: 'LGBTQIAPN+',
  subtitle: 'do município de São Roque',
  description: 'Um projeto que celebra, documenta e dá visibilidade à produção artística e cultural da comunidade LGBTQIAPN+ no município de São Roque! Participe do mapeamento, pesquisa aberta de',
  period: '08/12/2025 até 08/02/2026',
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
  quoteBeforeObjectives: '',
  quoteAuthorBeforeObjectives: '',
  showObjectives: true,
  objectives: [
    'Dar visibilidade à produção artística LGBTQIAPN+ em São Roque',
    'Criar um arquivo histórico e cultural da comunidade',
    'Fortalecer redes de apoio e colaboração entre artistas',
    'Promover políticas públicas de cultura e diversidade',
    'Combater o apagamento e a marginalização cultural'
  ],
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
  footer: {
    title: 'Visibilidade em Foco',
    description: 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque',
    supportTitle: 'Apoio e Realização',
    supportLogos: [
      { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
      { name: 'PNAB', imagePath: '/pnab.png' }
    ],
    copyright: '© 2025 Visibilidade em Foco. Todos os direitos reservados.',
    lgpdText: 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'
  }
}

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/home-content', {
          cache: 'no-store',
        })
        if (response.ok) {
          const data = await response.json()
          if (data.content && Object.keys(data.content).length > 0) {
            // Mesclar com valores padrão, mas respeitando valores vazios/null do banco
            const mergedContent = { ...defaultContent }
            // Sobrescrever com dados do banco
            Object.keys(data.content).forEach(key => {
              const value = data.content[key]
              // Se o valor é null ou string vazia, não usar o padrão - deixar como está
              if (value === null || value === '') {
                // Para campos opcionais como period, null significa "não mostrar"
                mergedContent[key as keyof HomeContent] = (value === '' ? null : value) as any
              } else if (value !== undefined) {
                // Valor existe e não é vazio, usar ele
                mergedContent[key as keyof HomeContent] = value
              }
            })
            console.log('Conteúdo mesclado na home:', mergedContent)
            console.log('Período específico:', mergedContent.period, 'tipo:', typeof mergedContent.period)
            setContent(mergedContent)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo da home:', error)
        // Em caso de erro, usar valores padrão
        setContent(defaultContent)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  return { content, loading }
}

