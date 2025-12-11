import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-heading',
  display: 'swap',
});

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Visibilidade em Foco | Mapeamento de Artistas LGBTQIAPN+ - São Roque',
  description: '1º Mapeamento Cultural de Artistas LGBTQIAPN+ do município de São Roque. Um projeto de resistência, visibilidade e celebração das nossas existências. Participe!',
  generator: 'v0.app',
  openGraph: {
    title: 'Visibilidade em Foco | Mapeamento de Artistas LGBTQIAPN+',
    description: '1º Mapeamento Cultural de Artistas LGBTQIAPN+ de São Roque. Participe e faça parte dessa história de visibilidade e resistência!',
    url: 'https://visibilidadeemfoco.com.br',
    siteName: 'Visibilidade em Foco',
    type: 'website',
    locale: 'pt_BR',
    images: [
      {
        url: '/logo-gradient.png',
        width: 1200,
        height: 630,
        alt: 'Visibilidade em Foco - Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visibilidade em Foco | Mapeamento de Artistas LGBTQIAPN+',
    description: '1º Mapeamento Cultural de Artistas LGBTQIAPN+ de São Roque. Participe!',
    images: ['/logo-gradient.png'],
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
    ],
    apple: '/apple-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Visibilidade em Foco',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover', // Para suportar safe-area no iPhone
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
