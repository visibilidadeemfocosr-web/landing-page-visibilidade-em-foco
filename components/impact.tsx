interface HomeContent {
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
}

interface ImpactProps {
  content?: HomeContent
}

export function Impact({ content }: ImpactProps) {
  const impactTag = content?.impactTag || 'Impacto Social'
  const impactTitle = content?.impactTitle || 'A importância de existir e resistir'
  const impactDescription = content?.impactDescription || 'Mais do que um levantamento de dados, este projeto é sobre <strong>dar voz</strong>, <strong>criar memória</strong> e <strong>transformar realidades</strong>.'
  const impacts = content?.impacts || [
    {
      number: "01",
      title: "Reconhecimento",
      description: "Valida a existência e o trabalho de artistas LGBTQIAPN+, criando espaço de representatividade e pertencimento."
    },
    {
      number: "02",
      title: "Memória",
      description: "Documenta trajetórias e produções artísticas, construindo um acervo histórico para a comunidade."
    },
    {
      number: "03",
      title: "Conexão",
      description: "Fortalece redes de apoio mútuo, colaboração e troca entre artistas da região."
    },
    {
      number: "04",
      title: "Transformação",
      description: "Promove mudanças culturais e sociais através da arte e da visibilidade LGBTQIAPN+."
    }
  ]
  const quote = content?.quote || '"É nossa voz, nossa expressão e nosso talento que nos colocam no mundo — e a arte é parte essencial disso."'
  const quoteAuthor = content?.quoteAuthor || '— Equipe Visibilidade em Foco'

  return (
    <section className="pt-12 md:pt-16 pb-16 sm:pb-24 md:pb-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-500">
              {impactTag}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 sm:mt-4 mb-4 sm:mb-6 text-balance">
              {impactTitle}
            </h2>
            <div
              className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto text-pretty prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: impactDescription }}
            />
          </div>

          {/* Grid de impactos */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {impacts.map((impact) => (
              <div
                key={impact.number}
                className="bg-card border border-border rounded-2xl p-5 sm:p-6 md:p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <span className="text-4xl sm:text-5xl font-bold text-orange-500/20 flex-shrink-0">
                    {impact.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                      {impact.title}
                    </h3>
                    <div 
                      className="text-sm sm:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: impact.description }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-10 sm:mt-12 md:mt-16 text-center max-w-3xl mx-auto px-2">
            <blockquote className="text-lg sm:text-xl md:text-2xl font-bold text-foreground italic text-balance leading-tight">
              {quote}
            </blockquote>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              {quoteAuthor}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
