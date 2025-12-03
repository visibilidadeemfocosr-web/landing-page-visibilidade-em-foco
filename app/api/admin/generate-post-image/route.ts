import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { existsSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'

function findChromeExecutable(): string | null {
  const possiblePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }

  try {
    if (process.platform === 'darwin') {
      const chromePath = execSync('which "Google Chrome" || which chromium || which chromium-browser', { encoding: 'utf8' }).trim()
      if (chromePath) return chromePath
    } else if (process.platform === 'linux') {
      const chromePath = execSync('which google-chrome || which chromium || which chromium-browser', { encoding: 'utf8' }).trim()
      if (chromePath) return chromePath
    }
  } catch (e) {
    // Ignorar erros
  }

  return null
}

export async function POST(request: NextRequest) {
  try {
    const { 
      submissionId, 
      postType = 'first', // 'first' ou 'second'
      name,
      mainArtisticLanguage,
      otherArtisticLanguages,
      bio,
      photo,
      instagram,
      facebook,
      linkedin
    } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Nome do artista é obrigatório' },
        { status: 400 }
      )
    }

    const width = 1080
    const height = 1080

    // Converter logo para base64
    const logoPath = path.join(process.cwd(), 'public', 'logoN.png')
    let logoBase64 = ''
    try {
      if (existsSync(logoPath)) {
        const logoBuffer = readFileSync(logoPath)
        logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`
      }
    } catch (error) {
      console.error('Erro ao ler logo:', error)
    }

    // Função para retornar SVG do ícone baseado na linguagem
    const getLanguageIconSVG = (language?: string): string => {
      if (!language) return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>'
      
      const lang = language.toLowerCase()
      
      if (lang.includes('música') || lang.includes('musica')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>'
      }
      if (lang.includes('artes visuais') || lang.includes('pintura') || lang.includes('desenho')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>'
      }
      if (lang.includes('audiovisual') || lang.includes('cinema') || lang.includes('vídeo') || lang.includes('video')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>'
      }
      if (lang.includes('literatura') || lang.includes('escrita') || lang.includes('poeta')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
      }
      if (lang.includes('moda') || lang.includes('design')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>'
      }
      if (lang.includes('dança') || lang.includes('danca')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>'
      }
      if (lang.includes('teatro') || lang.includes('cênica') || lang.includes('cenica') || lang.includes('atuação') || lang.includes('atuacao')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"/><path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z"/><path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z"/></svg>'
      }
      if (lang.includes('performance')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>'
      }
      
      return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>'
    }

    // Criar HTML completo com todos os estilos inline
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Post Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: ${width}px;
      height: ${height}px;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      overflow: hidden;
    }
    
    #instagram-preview {
      width: ${width}px;
      height: ${height}px;
      position: relative;
      background: linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 50%, #f1f3f5 100%);
      overflow: hidden;
    }
    
    /* Grid pattern */
    .grid-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: 0;
      pointer-events: none;
    }
    
    /* Blobs decorativos */
    .blob-1 {
      position: absolute;
      top: -80px;
      left: -80px;
      width: 256px;
      height: 256px;
      background: linear-gradient(to bottom right, rgba(147, 197, 253, 0.25), rgba(196, 181, 253, 0.25));
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      pointer-events: none;
    }
    
    .blob-2 {
      position: absolute;
      bottom: -80px;
      right: -80px;
      width: 256px;
      height: 256px;
      background: linear-gradient(to bottom right, rgba(251, 207, 232, 0.25), rgba(251, 191, 36, 0.15));
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      pointer-events: none;
    }
    
    /* Logo */
    .logo-container {
      position: absolute;
      top: 40px;
      left: 40px;
      width: 220px;
      height: 220px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
    }
    
    /* Ícone da linguagem artística */
    .vfsr-tag {
      position: absolute;
      top: 40px;
      right: 40px;
      background: #f97316;
      border-radius: 50%;
      padding: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(249, 115, 22, 0.3);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .vfsr-tag svg {
      color: white;
      width: 28px;
      height: 28px;
    }
    
    /* Conteúdo principal */
    .content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 32px;
      color: white;
    }
    
    ${postType === 'first' ? `
    /* POST 1: Apresentação */
    .post-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-top: 80px;
    }
    
    .photo-container {
      position: relative;
    }
    
    .photo-wrapper {
      width: 720px;
      height: 720px;
      border-radius: 50%;
      overflow: hidden;
      border: 10px solid rgba(249, 115, 22, 0.2);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      background: rgba(255, 255, 255, 0.1);
    }
    
    .photo-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .photo-decoration {
      position: absolute;
      top: -16px;
      left: -16px;
      right: -16px;
      bottom: -16px;
      border-radius: 50%;
      border: 2px solid rgba(236, 72, 153, 0.3);
    }
    
    .artist-name {
      text-align: center;
    }
    
    .artist-name h2 {
      font-size: 72px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #1f2937;
    }
    
    .name-divider {
      width: 280px;
      height: 8px;
      background: #f97316;
      margin: 0 auto 10px;
      border-radius: 9999px;
    }
    
    .swipe-indicator-container {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
    }
    
    .language-tag {
      display: inline-flex;
      align-items: center;
      gap: 16px;
      padding: 20px 36px;
      border-radius: 9999px;
      border: 2px solid;
    }
    
    .language-tag.principal {
      background: rgba(249, 115, 22, 0.1);
      border-color: rgba(249, 115, 22, 0.3);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      width: fit-content;
      margin: 0 auto;
    }
    
    .language-tag.principal span:first-child {
      color: #f97316;
      font-weight: 600;
      font-size: 32px;
    }
    
    .language-tag.principal span:last-child {
      color: #1f2937;
      font-weight: 500;
      font-size: 32px;
    }
    
    .language-tag.outras {
      background: rgba(107, 114, 128, 0.1);
      border-color: rgba(107, 114, 128, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    
    .language-tag.outras span:first-child {
      color: #6b7280;
      font-weight: 600;
      font-size: 32px;
    }
    
    .language-tag.outras span:last-child {
      color: #1f2937;
      font-weight: 500;
      font-size: 32px;
    }
    
    .swipe-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
    }
    
    .swipe-icon {
      background: rgba(249, 115, 22, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      padding: 12px;
      border: 2px solid rgba(249, 115, 22, 0.3);
    }
    
    .swipe-icon svg {
      width: 32px;
      height: 32px;
      color: #f97316;
    }
    
    .swipe-text {
      font-size: 16px;
      color: #6b7280;
      font-weight: 500;
    }
    ` : `
    /* POST 2: Biografia + Redes */
    .post-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 24px;
      margin-top: 64px;
    }
    
    .artist-name-small {
      text-align: center;
    }
    
    .artist-name-small h2 {
      font-size: 56px;
      font-weight: bold;
      margin-bottom: 16px;
      color: #1f2937;
    }
    
    .name-divider-small {
      width: 200px;
      height: 8px;
      background: #f97316;
      margin: 0 auto;
      border-radius: 9999px;
    }
    
    .bio {
      max-width: 750px;
      text-align: center;
      padding: 0 40px;
    }
    
    .bio p {
      font-size: 32px;
      line-height: 1.65;
      color: #1f2937;
    }
    
    .social-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
    }
    
    .social-links p {
      font-size: 24px;
      color: #6b7280;
      margin-bottom: 16px;
      font-weight: 500;
    }
    
    .social-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .social-button {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 32px;
      background: rgba(249, 115, 22, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      border: 2px solid rgba(249, 115, 22, 0.2);
    }
    
    .social-button svg {
      width: 32px;
      height: 32px;
      color: #f97316;
    }
    
    .social-button span {
      font-size: 24px;
      font-weight: 500;
      color: #1f2937;
    }
    
    .hashtags {
      text-align: center;
      padding-bottom: 24px;
    }
    
    .hashtags p {
      font-size: 22px;
      color: #6b7280;
      font-weight: 500;
    }
    `}
  </style>
</head>
<body>
  <div id="instagram-preview">
    <div class="grid-pattern"></div>
    <div class="blob-1"></div>
    <div class="blob-2"></div>
    
    ${logoBase64 ? `
    <div class="logo-container">
      <img src="${logoBase64}" alt="Visibilidade em Foco" />
    </div>
    ` : ''}
    
    <div class="vfsr-tag">
      ${getLanguageIconSVG(mainArtisticLanguage)}
    </div>
    
    <div class="content">
      ${postType === 'first' ? `
        <div class="post-content">
          <div class="photo-container">
            <div class="photo-wrapper">
              <img src="${photo || 'https://via.placeholder.com/400x400?text=Foto'}" alt="${name}" />
            </div>
            <div class="photo-decoration"></div>
          </div>
          
          <div class="artist-name">
            <h2>${name}</h2>
            <div class="name-divider"></div>
          </div>
          
          <div class="swipe-indicator-container">
            <div class="swipe-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <span class="swipe-text">Arraste para ver mais</span>
            </div>
          </div>
        </div>
      ` : `
        <div class="post-content">
          <div class="artist-name-small">
            <h2>${name}</h2>
            <div class="name-divider-small"></div>
          </div>
          
          <div class="bio">
            <p>${bio || 'Biografia do artista'}</p>
          </div>
          
          <div class="social-links">
            <p>Entre em contato:</p>
            <div class="social-buttons">
              ${instagram ? `
                <div class="social-button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>${instagram}</span>
                </div>
              ` : ''}
              ${facebook ? `
                <div class="social-button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                  <span>Facebook</span>
                </div>
              ` : ''}
              ${linkedin ? `
                <div class="social-button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>LinkedIn</span>
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="hashtags">
            <p>#VisibilidadeEmFoco #SãoRoque #ArteLGBTQIA+</p>
          </div>
        </div>
      `}
    </div>
  </div>
</body>
</html>
    `

    // Usar Puppeteer para capturar
    const chromePath = process.env.CHROME_EXECUTABLE_PATH || findChromeExecutable()

    if (!chromePath) {
      return NextResponse.json(
        {
          error: 'Chrome/Chromium não encontrado. Configure CHROME_EXECUTABLE_PATH ou instale o Chrome.',
        },
        { status: 500 }
      )
    }

    let browser
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: chromePath,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
        ],
      })

      const page = await browser.newPage()
      await page.setViewport({ width, height })
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 30000
      })

      // Aguardar renderização completa
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          const images = Array.from(document.querySelectorAll('img'))
          const imagePromises = images.map((img) => {
            if (img.complete) return Promise.resolve()
            return new Promise<void>((resolveImg) => {
              img.onload = () => resolveImg()
              img.onerror = () => resolveImg()
            })
          })
          Promise.all(imagePromises).then(() => {
            setTimeout(resolve, 1000)
          })
        })
      })

      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: { x: 0, y: 0, width, height }
      })

      await browser.close()

      const base64 = (screenshot as Buffer).toString('base64')
      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${base64}`,
        width,
        height
      })

    } catch (browserError: any) {
      if (browser) {
        await browser.close()
      }
      throw browserError
    }

  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error)
    return NextResponse.json(
      {
        error: 'Erro ao gerar imagem: ' + (error.message || 'Erro desconhecido'),
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

