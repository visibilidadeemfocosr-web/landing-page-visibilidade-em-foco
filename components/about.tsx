interface HomeContent {
  aboutTag?: string
  aboutSections?: Array<{
    title: string
    paragraphs: string[]
  }>
  quoteBeforeObjectives?: string
  quoteAuthorBeforeObjectives?: string
  showObjectives?: boolean
  objectives?: string[]
}

interface AboutProps {
  content?: HomeContent
}

export function About({ content }: AboutProps) {
  const aboutTag = content?.aboutTag || 'Sobre o Projeto'
  const aboutSections = content?.aboutSections || [
    {
      title: 'Por que mapear artistas LGBTQIAPN+?',
      paragraphs: [
        'O projeto <strong>Visibilidade em Foco</strong> nasce da urgência de reconhecer, documentar e celebrar a existência e a produção artística da comunidade LGBTQIAPN+ no interior de São Paulo.',
        'Historicamente, artistas LGBTQIAPN+ enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda, onde a falta de espaços de representação e o isolamento cultural dificultam o reconhecimento e a circulação de suas produções.',
        'Este mapeamento não é apenas um levantamento de dados — <strong>é um ato político de resistência e afirmação</strong>. Ao registrar essas existências, criamos um arquivo vivo que valida identidades, fortalece redes de apoio e constrói um legado cultural para futuras gerações.'
      ]
    }
  ]
  const quoteBeforeObjectives = content?.quoteBeforeObjectives
  const quoteAuthorBeforeObjectives = content?.quoteAuthorBeforeObjectives || ''
  const objectives = content?.objectives || [
    'Dar visibilidade à produção artística LGBTQIAPN+ em São Roque',
    'Criar um arquivo histórico e cultural da comunidade',
    'Fortalecer redes de apoio e colaboração entre artistas',
    'Promover políticas públicas de cultura e diversidade',
    'Combater o apagamento e a marginalização cultural'
  ]

  return (
    <section id="sobre" className="pt-24 md:pt-32 pb-12 md:pb-16 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Tag de seção */}
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              {aboutTag}
            </span>
          </div>

          {/* Seções */}
          {aboutSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-12' : ''}>
              {/* Título */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
                {section.title}
              </h2>

              {/* Parágrafos */}
              <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, pIndex) => (
                  <div
                    key={pIndex}
                    className="text-pretty prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Quote Before Objectives */}
          {quoteBeforeObjectives && (
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <blockquote className="text-2xl md:text-3xl font-bold text-foreground italic text-balance leading-tight">
                {quoteBeforeObjectives}
              </blockquote>
              {quoteAuthorBeforeObjectives && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {quoteAuthorBeforeObjectives}
                </p>
              )}
            </div>
          )}

          {/* Objetivos */}
          {objectives.length > 0 && content?.showObjectives !== false && (
            <div className="pt-8 border-t border-border mt-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Objetivos do projeto</h3>
              <ul className="space-y-3 text-muted-foreground">
                {objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
