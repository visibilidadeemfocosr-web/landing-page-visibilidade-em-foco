export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-yellow-400/15 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            Visibilidade em Foco
          </h3>
          <p className="text-gray-200 leading-relaxed text-lg drop-shadow-lg">
            Mapeamento de Artistas LGBTS • São Roque • Interior de São Paulo
          </p>
          
          <div className="pt-8 border-t border-white/30">
            <p className="text-sm text-gray-300">
              © 2025 Visibilidade em Foco. Todos os direitos reservados.
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
