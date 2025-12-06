import Image from 'next/image'

interface FooterContent {
  title?: string
  description?: string
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

export function Footer({ content }: FooterProps) {
  const title = content?.title || 'Visibilidade em Foco'
  const description = content?.description || 'Mapeamento de Artistas LGBTQIAPN+ do Município de São Roque'
  const supportTitle = content?.supportTitle || 'Apoio e Realização'
  const supportLogos = content?.supportLogos || [
    { name: 'Prefeitura de São Roque', imagePath: '/prefeitura.png' },
    { name: 'PNAB', imagePath: '/pnab.png' }
  ]
  const copyright = content?.copyright || '© 2025 Visibilidade em Foco. Todos os direitos reservados.'
  const lgpdText = content?.lgpdText || 'Este projeto respeita a privacidade e os dados pessoais conforme a LGPD.'

  return (
    <footer className="bg-gradient-to-br from-slate-100 via-gray-100 to-slate-50 text-gray-800 py-16 relative overflow-hidden border-t border-gray-200">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-10 w-72 h-72 bg-purple-100/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-pink-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-100/25 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Título e descrição */}
          <div className="text-center space-y-6 mb-12">
            <h3 className="text-3xl font-bold text-orange-500 font-heading">
              {title}
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {description}
            </p>
          </div>

          {/* Seção de Apoio/Realização */}
          {supportLogos.length > 0 && (
            <div className="py-8 border-y border-gray-300">
              <p className="text-center text-sm font-semibold text-gray-700 mb-6 uppercase tracking-wider">
                {supportTitle}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {supportLogos.map((logo, index) => (
                  <div key={index} className="h-16 md:h-20 flex items-center">
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
          <div className="pt-8 text-center space-y-3">
            <p className="text-sm text-gray-600">
              {copyright}
            </p>
            <p className="text-sm text-gray-500">
              <a 
                href="/admin" 
                className="hover:text-gray-700 transition-colors underline underline-offset-2"
              >
                Área Administrativa
              </a>
            </p>
            {lgpdText && (
              <p className="text-sm text-gray-600">
                {lgpdText}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
