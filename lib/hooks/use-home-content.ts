import { useState, useEffect, useRef } from 'react'

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
    instagramUrl: '',
    supportTitle: 'Apoio e Realização',
    supportLogos: [
      { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
      { name: 'PNAB', imagePath: '/pnab.png' }
    ],
    copyright: '© 2025 Visibilidade em Foco. Todos os direitos reservados.',
    lgpdText: 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'
  }
}

// Cache simples no cliente (5 minutos)
let cachedContent: HomeContent | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export function useHomeContent(initialContent?: any) {
  // Se tem conteúdo inicial do servidor, usar ele e mesclar com padrão
  const getInitialContent = (): HomeContent => {
    if (initialContent && Object.keys(initialContent).length > 0) {
      return {
        ...defaultContent,
        ...initialContent,
        heroImage: initialContent.heroImage || defaultContent.heroImage,
        aboutSections: initialContent.aboutSections || defaultContent.aboutSections,
        objectives: initialContent.objectives || defaultContent.objectives,
        impacts: initialContent.impacts || defaultContent.impacts,
        footer: initialContent.footer ? {
          ...defaultContent.footer,
          ...initialContent.footer,
        } : defaultContent.footer,
        period: initialContent.period === null || initialContent.period === '' ? null : (initialContent.period || defaultContent.period),
      }
    }
    return defaultContent
  }

  const [content, setContent] = useState<HomeContent>(getInitialContent())
  const [loading, setLoading] = useState(!initialContent) // Se tem initialContent, não está loading
  const loadingRef = useRef(false)

  useEffect(() => {
    // Se já tem conteúdo inicial do servidor, só fazer revalidação em background
    if (initialContent && Object.keys(initialContent).length > 0) {
      // Atualizar cache com conteúdo inicial
      cachedContent = getInitialContent()
      cacheTimestamp = Date.now()
      
      // Revalidar em background (sem bloquear UI)
      const revalidate = async () => {
        try {
          const response = await fetch('/api/home-content', {
            headers: {
              'Cache-Control': 'max-age=60',
            },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.content && Object.keys(data.content).length > 0) {
              const mergedContent: HomeContent = {
                ...defaultContent,
                ...data.content,
                heroImage: data.content.heroImage || defaultContent.heroImage,
                aboutSections: data.content.aboutSections || defaultContent.aboutSections,
                objectives: data.content.objectives || defaultContent.objectives,
                impacts: data.content.impacts || defaultContent.impacts,
                footer: data.content.footer ? {
                  ...defaultContent.footer,
                  ...data.content.footer,
                } : defaultContent.footer,
              }
              if (data.content.period === null || data.content.period === '') {
                mergedContent.period = null
              }
              cachedContent = mergedContent
              cacheTimestamp = Date.now()
              setContent(mergedContent)
            }
          }
        } catch (error) {
          console.error('Erro ao revalidar conteúdo:', error)
        }
      }
      
      // Revalidar após 1 segundo (não bloqueia renderização inicial)
      setTimeout(revalidate, 1000)
      return
    }

    const loadContent = async () => {
      // Evitar múltiplas requisições simultâneas
      if (loadingRef.current) return
      
      // Verificar cache
      const now = Date.now()
      if (cachedContent && (now - cacheTimestamp) < CACHE_DURATION) {
        setContent(cachedContent)
        setLoading(false)
        return
      }

      loadingRef.current = true
      try {
        // Usar cache do navegador (60 segundos) + cache do CDN
        const response = await fetch('/api/home-content', {
          headers: {
            'Cache-Control': 'max-age=60',
          },
        })
        if (response.ok) {
          const data = await response.json()
          if (data.content && Object.keys(data.content).length > 0) {
            // Mesclar com valores padrão de forma otimizada
            const mergedContent: HomeContent = {
              ...defaultContent,
              ...data.content,
              // Mesclar objetos aninhados manualmente para evitar sobrescrever completamente
              heroImage: data.content.heroImage || defaultContent.heroImage,
              aboutSections: data.content.aboutSections || defaultContent.aboutSections,
              objectives: data.content.objectives || defaultContent.objectives,
              impacts: data.content.impacts || defaultContent.impacts,
              footer: data.content.footer ? {
                ...defaultContent.footer,
                ...data.content.footer,
              } : defaultContent.footer,
            }
            
            // Tratar valores null/vazios especificamente
            if (data.content.period === null || data.content.period === '') {
              mergedContent.period = null
            }
            // Atualizar cache
            cachedContent = mergedContent
            cacheTimestamp = Date.now()
            
            setContent(mergedContent)
          } else {
            // Se não há conteúdo, usar padrão e cachear
            cachedContent = defaultContent
            cacheTimestamp = Date.now()
            setContent(defaultContent)
          }
        } else {
          // Se resposta não ok, usar cache se disponível ou padrão
          if (cachedContent) {
            setContent(cachedContent)
          } else {
            setContent(defaultContent)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdo da home:', error)
        // Em caso de erro, usar cache se disponível ou valores padrão
        if (cachedContent) {
          setContent(cachedContent)
        } else {
          setContent(defaultContent)
        }
      } finally {
        setLoading(false)
        loadingRef.current = false
      }
    }

    loadContent()
  }, [])

  return { content, loading }
}

