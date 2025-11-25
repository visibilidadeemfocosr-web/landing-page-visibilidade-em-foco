export function About() {
  return (
    <section id="sobre" className="py-24 md:py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Tag de seção */}
          <div className="inline-block mb-6">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sobre o Projeto
            </span>
          </div>

          {/* Título */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 text-balance leading-tight">
            Por que mapear artistas LGBTS?
          </h2>

          {/* Conteúdo */}
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p className="text-pretty">
              O projeto <strong className="text-foreground">Visibilidade em Foco</strong> nasce da urgência de reconhecer, documentar e celebrar a existência e a produção artística da comunidade LGBTS no interior de São Paulo.
            </p>

            <p className="text-pretty">
              Historicamente, artistas LGBTS enfrentam o apagamento de suas trajetórias e a invisibilização de suas obras. Em cidades do interior, essa realidade é ainda mais profunda, onde a falta de espaços de representação e o isolamento cultural dificultam o reconhecimento e a circulação de suas produções.
            </p>

            <p className="text-pretty">
              Este mapeamento não é apenas um levantamento de dados — <strong className="text-foreground">é um ato político de resistência e afirmação</strong>. Ao registrar essas existências, criamos um arquivo vivo que valida identidades, fortalece redes de apoio e constrói um legado cultural para futuras gerações.
            </p>

            <div className="pt-8 border-t border-border mt-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Objetivos do projeto</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Dar visibilidade à produção artística LGBTS em São Roque</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Criar um arquivo histórico e cultural da comunidade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Fortalecer redes de apoio e colaboração entre artistas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Promover políticas públicas de cultura e diversidade</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span>Combater o apagamento e a marginalização cultural</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
