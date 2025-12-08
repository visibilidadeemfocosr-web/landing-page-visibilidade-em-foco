'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Logo e descrição */}
          <div className="md:col-span-2">
            <div className="mb-6 relative inline-block">
              <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative">
                <Image 
                  src="/logoN.png"
                  alt="Visibilidade em Foco"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'brightness(0) invert(1)',
                  }}
                  unoptimized
                />
                <div className="absolute -top-2 -right-6 w-4 h-4 bg-yellow-400 rounded-full" />
                <div className="absolute -bottom-2 -left-4 w-6 h-6 bg-purple-600 rounded-full" />
              </div>
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
                <Link href="/admin/login" className="text-gray-300 hover:text-white transition-colors">Acesso Admin</Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-6 tracking-widest text-sm text-gray-500">CONTATO</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:visibilidade.emfocosr@gmail.com" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a href="https://instagram.com/visibilidadeemfocosr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Seção de Apoio e Realização */}
        <div className="py-8 sm:py-10 border-b border-gray-800 mb-8">
          <p className="text-center text-xs sm:text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">
            Apoio e Realização
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12">
            <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center">
              <Image 
                src="/prefeitura.png"
                alt="Prefeitura de São Roque"
                width={180}
                height={80}
                className="h-full w-auto object-contain"
                style={{ 
                  filter: 'brightness(0) invert(1)',
                }}
                unoptimized
              />
            </div>
            <div className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center">
              <Image 
                src="/pnab.png"
                alt="PNAB"
                width={180}
                height={80}
                className="h-full w-auto object-contain"
                style={{ 
                  filter: 'brightness(0) invert(1)',
                }}
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 Visibilidade em Foco. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Feito com</span>
              <span>❤️</span>
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
  )
}

