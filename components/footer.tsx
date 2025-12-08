import Image from 'next/image'
import { Instagram } from 'lucide-react'

interface FooterContent {
  title?: string
  description?: string
  instagramUrl?: string
  supportTitle?: string
  supportLogos?: Array<{
    name: string
    imagePath: string
  }>
  copyright?: string
  lgpdText?: string
}

interface FooterProps {
  content?: FooterContent
}

// Função helper para normalizar URL do Instagram
function normalizeInstagramUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  
  // Remover espaços em branco
  url = url.trim()
  
  // Se já começa com http:// ou https://, retornar como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Se começa com instagram.com ou www.instagram.com, adicionar https://
  if (url.startsWith('instagram.com/') || url.startsWith('www.instagram.com/')) {
    return `https://${url}`
  }
  
  // Se começa com @, remover e construir URL
  if (url.startsWith('@')) {
    return `https://instagram.com/${url.substring(1)}`
  }
  
  // Caso padrão: adicionar https://instagram.com/
  return `https://instagram.com/${url}`
}

export function Footer({ content }: FooterProps) {
  const title = content?.title || 'Visibilidade em Foco'
  const description = content?.description || 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque'
  const instagramUrl = normalizeInstagramUrl(content?.instagramUrl)
  const supportTitle = content?.supportTitle || 'Apoio e Realização'
  const supportLogos = content?.supportLogos || [
    { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
    { name: 'PNAB', imagePath: '/pnab.png' }
  ]
  const copyright = content?.copyright || '© 2025 Visibilidade em Foco. Todos os direitos reservados.'
  const lgpdText = content?.lgpdText || 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'

  return (
    <footer className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 text-gray-800 py-10 sm:py-12 md:py-16 relative overflow-hidden border-t border-gray-200">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-100/25 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Título e descrição */}
          <div className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-10 md:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-orange-500 font-heading">
              {title}
            </h3>
            <p className="text-gray-700 leading-relaxed text-base sm:text-lg px-2">
              {description}
            </p>
          </div>

          {/* Seção Siga-nos no Instagram */}
          {instagramUrl && (
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <p className="text-sm sm:text-base font-semibold text-gray-700 mb-4 sm:mb-6 uppercase tracking-wider">
                Siga-nos no Instagram
              </p>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
              >
                <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
                <span>@visibilidadeemfoco</span>
              </a>
            </div>
          )}

          {/* Seção de Apoio/Realização */}
          {supportLogos.length > 0 && (
            <div className="py-6 sm:py-8 border-y border-gray-300">
              <p className="text-center text-xs sm:text-sm font-semibold text-gray-700 mb-4 sm:mb-6 uppercase tracking-wider">
                {supportTitle}
            </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                {supportLogos.map((logo, index) => (
                  <div key={index} className="h-12 sm:h-14 md:h-16 lg:h-20 flex items-center">
                    {logo.imagePath && (
                <Image 
                        src={logo.imagePath}
                        alt={logo.name}
                  width={180}
                  height={80}
                  className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  unoptimized
                />
                    )}
              </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Copyright e links */}
          <div className="pt-6 sm:pt-8 text-center space-y-2 sm:space-y-3">
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              {copyright}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              <a 
                href="/admin" 
                className="hover:text-gray-700 transition-colors underline underline-offset-2"
              >
                Área Administrativa
              </a>
            </p>
            {lgpdText && (
              <p className="text-xs sm:text-sm text-gray-600 px-2">
                {lgpdText}
            </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
