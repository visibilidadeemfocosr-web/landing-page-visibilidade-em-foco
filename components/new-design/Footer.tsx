'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-black text-white py-12 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-10 sm:mb-12">
          {/* Logo e descrição */}
          <div className="sm:col-span-2">
            <div className="mb-4 sm:mb-6 relative inline-block">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 relative">
                <Image 
                  src="/logoN.png"
                  alt="Logo do projeto Visibilidade em Foco - Mapeamento de artistas LGBTQIAPN+ do município de São Roque"
                  width={112}
                  height={112}
                  className="w-full h-full object-contain"
                  style={{ 
                    filter: 'brightness(0) invert(1)',
                  }}
                  unoptimized
                />
                <div className="absolute -top-2 -right-6 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full" aria-hidden="true" />
                <div className="absolute -bottom-2 -left-4 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-purple-600 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
              1º Mapeamento Cultural de Artistas LGBTQIAPN+ do município de São Roque. Um projeto de resistência, visibilidade e celebração.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm text-gray-500">NAVEGAÇÃO</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#sobre" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors" aria-label="Ir para seção sobre o projeto">Sobre o Projeto</a>
              </li>
              <li>
                <a href="#impacto" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors" aria-label="Ir para seção de impacto">Impacto</a>
              </li>
              <li>
                <a href="#participar" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors" aria-label="Ir para seção de participação">Participar</a>
              </li>
              <li>
                <Link href="/admin/login" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors" aria-label="Ir para página de acesso administrativo">Acesso Admin</Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="mb-4 sm:mb-6 tracking-widest text-xs sm:text-sm text-gray-500">CONTATO</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a 
                  href="mailto:visibilidade.emfocosr@gmail.com" 
                  className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors break-all"
                  aria-label="Enviar email para visibilidade.emfocosr@gmail.com"
                >
                  Email
                </a>
              </li>
              <li>
                <a href="https://instagram.com/visibilidadeemfocosr" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors" aria-label="Abrir perfil do Instagram em nova aba: @visibilidadeemfocosr">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Seção de Realização e Programa */}
        <div className="py-8 sm:py-10 border-b border-gray-800 mb-8">
          <p className="text-center text-xs sm:text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">
            Realização e Programa
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
          <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-6 leading-relaxed max-w-3xl mx-auto px-4">
            Projeto contemplado pelo Edital PNAB (Lei nº 14.399/2022) Nº 01/2024 — Prefeitura de São Roque.
          </p>
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
        <div className="mt-12 h-2 flex" aria-hidden="true" role="presentation">
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

