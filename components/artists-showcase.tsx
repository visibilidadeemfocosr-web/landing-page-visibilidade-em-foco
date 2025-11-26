'use client'

import Image from 'next/image'

export function ArtistsShowcase() {
  const artistTypes = [
    {
      title: "Artes Visuais",
      description: "Pintores, ilustradores, fotógrafos e artistas plásticos",
      color: "from-slate-800/20 to-gray-700/15",
      imageUrl: "/visual-artist-painting.jpg"
    },
    {
      title: "Música",
      description: "Cantores, compositores, músicos e produtores musicais",
      color: "from-slate-800/20 to-gray-700/15",
      imageUrl: "/musician-performing.jpg"
    },
    {
      title: "Teatro",
      description: "Atores, diretores, dramaturgos e performers",
      color: "from-slate-800/20 to-gray-700/15",
      imageUrl: "/theater-performer.jpg"
    },
    {
      title: "Dança",
      description: "Bailarinos, coreógrafos e performers corporais",
      color: "from-slate-800/20 to-gray-700/15",
      imageUrl: "/hiphop-dancer.jpg"
    },
    {
      title: "Audiovisual",
      description: "Cineastas, videomakers, fotógrafos e produtores audiovisuais",
      color: "from-slate-800/20 to-gray-700/15",
      imageUrl: "/audiovisual-filmmaker.jpg"
    }
  ]

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 -left-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-cyan-400/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold uppercase tracking-wider text-yellow-300 mb-4 block drop-shadow-glow">
            Diversidade Artística
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
            Celebrando todas as formas de arte
          </h2>
          <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Cada artista traz sua voz única, sua perspectiva singular e sua contribuição inestimável para a cultura de São Roque
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {artistTypes.map((type, index) => (
            <div 
              key={index}
              className="group relative bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/20"
            >
              <div className="relative h-64 overflow-hidden">
                {/* Renderizar imagem primeiro */}
                <Image 
                  src={type.imageUrl || "/placeholder.svg"}
                  alt={type.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 z-0"
                  unoptimized
                />
                {/* Gradient overlay por cima */}
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} z-10`} />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-3 text-center">
                  {type.title}
                </h3>
                <p className="text-gray-200 text-center leading-relaxed text-sm">
                  {type.description}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${type.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
            </div>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="text-5xl md:text-6xl font-bold text-pink-400 mb-2">+</div>
            <div className="text-lg font-semibold text-white mb-1">Vozes Diversas</div>
            <div className="text-sm text-gray-300">Cada artista conta</div>
          </div>
          
          <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="text-5xl md:text-6xl font-bold text-pink-400 mb-2">∞</div>
            <div className="text-lg font-semibold text-white mb-1">Expressões Artísticas</div>
            <div className="text-sm text-gray-300">Sem limites de criatividade</div>
          </div>
          
          <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="text-5xl md:text-6xl font-bold text-pink-400 mb-2">1</div>
            <div className="text-lg font-semibold text-white mb-1">Comunidade</div>
            <div className="text-sm text-gray-300">Unidos pela arte</div>
          </div>
        </div>
      </div>
    </section>
  )
}
