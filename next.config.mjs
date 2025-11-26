import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  // Configuração para Turbopack (Next.js 16+)
  turbopack: {
    // Turbopack não precisa de configuração especial para módulos nativos
    // Eles são carregados dinamicamente em runtime
  },
  // Manter webpack para compatibilidade, mas será ignorado quando usar Turbopack
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalizar módulos nativos para evitar problemas com bundling
      config.externals = config.externals || []
      // Adicionar como função para externalizar módulos dinâmicos também
      config.externals.push(({ request }, callback) => {
        if (request === 'chartjs-node-canvas' || request === 'canvas') {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      })
    }
    
    // Adicionar fallback para buffer
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: path.resolve(process.cwd(), 'node_modules/buffer/index.js'),
    }
    
    return config
  },
}

export default nextConfig
