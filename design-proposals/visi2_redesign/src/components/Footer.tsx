export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="mb-6 relative inline-block">
              <div className="text-2xl tracking-tight leading-tight">
                <div>VISIBILIDADE</div>
                <div>EM FOCO</div>
              </div>
              <div className="absolute -top-2 -right-6 w-4 h-4 bg-yellow-400 rounded-full" />
              <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-purple-600" />
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              1º Mapeamento Cultural de Artistas LGBTQIAPN+ do município de São Roque. Um projeto de resistência, visibilidade e celebração.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-6 tracking-widest text-sm text-gray-500">NAVEGAÇÃO</h3>
            <ul className="space-y-3">
              <li>
                <a href="#sobre" className="text-gray-300 hover:text-white transition-colors">Sobre o Projeto</a>
              </li>
              <li>
                <a href="#impacto" className="text-gray-300 hover:text-white transition-colors">Impacto</a>
              </li>
              <li>
                <a href="#participar" className="text-gray-300 hover:text-white transition-colors">Participar</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-6 tracking-widest text-sm text-gray-500">CONTATO</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Email</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Imprensa</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Visibilidade em Foco. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Feito com</span>
              <div className="w-4 h-4 bg-pink-500 rounded-full" />
              <span>para a comunidade</span>
            </div>
          </div>
        </div>

        {/* Bandeira visual no rodapé */}
        <div className="mt-12 h-2 flex">
          <div className="flex-1 bg-red-500" />
          <div className="flex-1 bg-orange-500" />
          <div className="flex-1 bg-yellow-400" />
          <div className="flex-1 bg-green-500" />
          <div className="flex-1 bg-blue-600" />
          <div className="flex-1 bg-purple-600" />
        </div>
      </div>
    </footer>
  );
}
