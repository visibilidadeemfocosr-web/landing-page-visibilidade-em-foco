import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { existsSync } from 'fs'
import { execSync } from 'child_process'

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
      background: linear-gradient(to bottom right, #1a4b8c 0%, #2d1b69 50%, #4a1942 100%);
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
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
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
      background: linear-gradient(to bottom right, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2));
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
      background: linear-gradient(to bottom right, rgba(34, 211, 238, 0.2), rgba(59, 130, 246, 0.2));
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      pointer-events: none;
    }
    
    /* Logo */
    .logo-container {
      position: absolute;
      top: 32px;
      left: 32px;
      width: 140px;
      height: 140px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 12px;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-container img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    /* VFSR Tag */
    .vfsr-tag {
      position: absolute;
      top: 32px;
      right: 32px;
      background: linear-gradient(to bottom right, #ec4899, #9333ea);
      border-radius: 9999px;
      padding: 12px 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      z-index: 10;
    }
    
    .vfsr-tag span {
      color: white;
      font-weight: bold;
      font-size: 20px;
      letter-spacing: 0.05em;
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
      margin-top: 64px;
    }
    
    .photo-container {
      position: relative;
    }
    
    .photo-wrapper {
      width: 380px;
      height: 380px;
      border-radius: 50%;
      overflow: hidden;
      border: 6px solid rgba(255, 255, 255, 0.3);
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
      font-size: 56px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    
    .name-divider {
      width: 200px;
      height: 6px;
      background: #ec4899;
      margin: 0 auto 20px;
      border-radius: 9999px;
    }
    
    .languages {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .language-tag {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 28px;
      border-radius: 9999px;
      border: 1px solid;
    }
    
    .language-tag.principal {
      background: rgba(236, 72, 153, 0.2);
      border-color: rgba(236, 72, 153, 0.3);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      width: fit-content;
      margin: 0 auto;
    }
    
    .language-tag.principal span:first-child {
      color: #f9a8d4;
      font-weight: 600;
      font-size: 24px;
    }
    
    .language-tag.principal span:last-child {
      color: white;
      font-weight: 500;
      font-size: 24px;
    }
    
    .language-tag.outras {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }
    
    .language-tag.outras span:first-child {
      color: rgba(255, 255, 255, 0.8);
      font-weight: 600;
      font-size: 24px;
    }
    
    .language-tag.outras span:last-child {
      color: white;
      font-weight: 500;
      font-size: 24px;
    }
    
    .swipe-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding-top: 16px;
    }
    
    .swipe-icon {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      padding: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .swipe-icon svg {
      width: 32px;
      height: 32px;
      color: white;
    }
    
    .swipe-text {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.7);
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
      font-size: 40px;
      font-weight: bold;
      margin-bottom: 12px;
    }
    
    .name-divider-small {
      width: 140px;
      height: 6px;
      background: #ec4899;
      margin: 0 auto;
      border-radius: 9999px;
    }
    
    .bio {
      max-width: 700px;
      text-align: center;
      padding: 0 32px;
    }
    
    .bio p {
      font-size: 28px;
      line-height: 1.75;
      color: rgba(255, 255, 255, 0.9);
    }
    
    .social-links {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
    }
    
    .social-links p {
      font-size: 20px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 12px;
    }
    
    .social-buttons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .social-button {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 28px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .social-button svg {
      width: 28px;
      height: 28px;
      color: white;
    }
    
    .social-button span {
      font-size: 20px;
      font-weight: 500;
      color: white;
    }
    
    .hashtags {
      text-align: center;
      padding-bottom: 24px;
    }
    
    .hashtags p {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);
    }
    `}
  </style>
</head>
<body>
  <div id="instagram-preview">
    <div class="grid-pattern"></div>
    <div class="blob-1"></div>
    <div class="blob-2"></div>
    
    <div class="logo-container">
      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura_de_Tela_2025-11-14_a%CC%80s_20.28.13-removebg-preview-ZHLqMcqvj2fR23VIPIBhdOyvkeAAcx.png" alt="Visibilidade em Foco" />
    </div>
    
    <div class="vfsr-tag">
      <span>VFSR</span>
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
          
          <div class="languages">
            ${mainArtisticLanguage ? `
              <div class="language-tag principal">
                <span>Principal:</span>
                <span>${mainArtisticLanguage.split('(')[0].trim()}</span>
              </div>
            ` : ''}
            ${otherArtisticLanguages ? `
              <div class="language-tag outras">
                <span>Outras:</span>
                <span>${otherArtisticLanguages}</span>
              </div>
            ` : ''}
            
            <div class="swipe-indicator">
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

