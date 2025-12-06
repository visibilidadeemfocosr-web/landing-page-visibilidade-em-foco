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
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
              {impactTag}
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
              {impactTitle}
            </h2>
            <div
              className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: impactDescription }}
            />
          </div>

          {/* Grid de impactos */}
          <div className="grid md:grid-cols-2 gap-8">
            {impacts.map((impact) => (
              <div
                key={impact.number}
                className="bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-6">
                  <span className="text-5xl font-bold text-orange-500/20">
                    {impact.number}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {impact.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {impact.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-bold text-foreground italic text-balance leading-tight">
              {quote}
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              {quoteAuthor}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
