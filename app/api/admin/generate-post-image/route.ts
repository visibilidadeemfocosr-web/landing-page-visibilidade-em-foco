import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { existsSync, readFileSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'

// Detectar se está em ambiente serverless (Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME

async function getBrowser() {
  // Em ambiente serverless (Vercel), usar @sparticuz/chromium
  if (isServerless) {
    try {
      const chromium = await import('@sparticuz/chromium')
      const puppeteerCore = await import('puppeteer-core')
      
      // Usar type assertion para contornar problemas de tipo
      const chromiumModule = chromium as any
      
      // Configurar Chromium para serverless (se disponível)
      if (typeof chromiumModule.setGraphicsMode === 'function') {
        chromiumModule.setGraphicsMode(false)
      }
      
      // Obter argumentos e executável
      const chromiumArgs = chromiumModule.args || chromiumModule.default?.args || []
      const chromiumExecutablePath = typeof chromiumModule.executablePath === 'function'
        ? await chromiumModule.executablePath()
        : typeof chromiumModule.default?.executablePath === 'function'
        ? await chromiumModule.default.executablePath()
        : chromiumModule.executablePath || chromiumModule.default?.executablePath
      
      return await puppeteerCore.default.launch({
        args: [...chromiumArgs, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chromiumModule.defaultViewport || chromiumModule.default?.defaultViewport || { width: 1920, height: 1080 },
        executablePath: chromiumExecutablePath,
        headless: chromiumModule.headless !== false,
      })
    } catch (error: any) {
      console.error('Erro ao carregar @sparticuz/chromium:', error)
      throw new Error(`Chromium não disponível no ambiente serverless: ${error.message}`)
    }
  }
  
  // Em desenvolvimento/local, usar Chrome local
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

  const chromePath = process.env.CHROME_EXECUTABLE_PATH || findChromeExecutable()

  if (!chromePath) {
    throw new Error('Chrome/Chromium não encontrado. Configure CHROME_EXECUTABLE_PATH ou instale o Chrome.')
  }

  return await puppeteer.launch({
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
}

// SVG placeholder inline (não depende de serviços externos)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + Buffer.from(`
  <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#f3f4f6"/>
    <circle cx="200" cy="150" r="50" fill="#d1d5db"/>
    <path d="M 100 250 Q 200 200 300 250 L 300 350 L 100 350 Z" fill="#d1d5db"/>
    <text x="200" y="320" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle">Foto</text>
  </svg>
`).toString('base64')

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
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11.9 12.1 4.514-4.514"/><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z"/><path d="m6 16 2 2"/><path d="M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z"/><circle cx="11.5" cy="12.5" r=".5" fill="currentColor"/></svg>'
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
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1"/><path d="m9 20 3-6 3 6"/><path d="m6 8 6 2 6-2"/><path d="M12 10v4"/></svg>'
      }
      if (lang.includes('teatro') || lang.includes('cênica') || lang.includes('cenica') || lang.includes('atuação') || lang.includes('atuacao')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"/><path d="M6 11c1.5 0 3 .5 3 2-2 0-3 0-3-2Z"/><path d="M18 11c-1.5 0-3 .5-3 2 2 0 3 0 3-2Z"/></svg>'
      }
      if (lang.includes('performance')) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>'
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
      background: #fafaf9;
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
      background: linear-gradient(to bottom right, rgba(192, 132, 252, 0.20), rgba(236, 72, 153, 0.20));
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
      background: linear-gradient(to bottom right, rgba(192, 132, 252, 0.20), rgba(168, 85, 247, 0.15));
      border-radius: 50%;
      filter: blur(80px);
      z-index: 0;
      pointer-events: none;
    }
    
    /* Formas geométricas decorativas - estilo Hero */
    .geo-shape-1 {
      position: absolute;
      top: 64px;
      right: 64px;
      width: 96px;
      height: 96px;
      background: #9333ea;
      opacity: 0.3;
      clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
      z-index: 0;
      pointer-events: none;
    }
    
    .geo-shape-2 {
      position: absolute;
      bottom: 96px;
      left: 48px;
      width: 64px;
      height: 64px;
      background: #facc15;
      border-radius: 50%;
      opacity: 0.4;
      z-index: 0;
      pointer-events: none;
    }
    
    .geo-shape-3 {
      position: absolute;
      bottom: 128px;
      left: 96px;
      width: 80px;
      height: 96px;
      background: #f97316;
      opacity: 0.3;
      clip-path: polygon(0 0, 100% 25%, 100% 100%, 0 75%);
      z-index: 0;
      pointer-events: none;
    }
    
    .geo-shape-4 {
      position: absolute;
      top: 33.33%;
      right: 25%;
      width: 48px;
      height: 48px;
      background: #ec4899;
      border-radius: 50%;
      opacity: 0.35;
      z-index: 0;
      pointer-events: none;
    }
    
    .geo-shape-5 {
      position: absolute;
      top: 50%;
      right: 48px;
      width: 56px;
      height: 56px;
      background: #2563eb;
      border-radius: 50%;
      opacity: 0.3;
      z-index: 0;
      pointer-events: none;
    }
    
    /* Logo */
    .logo-container {
      position: absolute;
      top: 40px;
      left: 40px;
      width: 195px;
      height: 195px;
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
      background: #9333ea;
      border-radius: 50%;
      padding: 14px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border: 2px solid rgba(147, 51, 234, 0.3);
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
      border: 10px solid rgba(147, 51, 234, 0.2);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      background: #ffffff;
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
      border: 2px solid rgba(147, 51, 234, 0.3);
    }
    
    .artist-name {
      text-align: center;
    }
    
    .artist-name h2 {
      font-size: 72px;
      font-weight: bold;
      margin-bottom: 12px;
      color: #1f2937;
      letter-spacing: -0.025em;
    }
    
    .name-divider {
      width: 280px;
      height: 8px;
      background: #9333ea;
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
      background: rgba(147, 51, 234, 0.1);
      border-color: rgba(147, 51, 234, 0.3);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      width: fit-content;
      margin: 0 auto;
    }
    
    .language-tag.principal span:first-child {
      color: #9333ea;
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
      background: rgba(147, 51, 234, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 50%;
      padding: 12px;
      border: 2px solid rgba(147, 51, 234, 0.3);
    }
    
    .swipe-icon svg {
      width: 32px;
      height: 32px;
      color: #9333ea;
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
      letter-spacing: -0.025em;
    }
    
    .name-divider-small {
      width: 200px;
      height: 8px;
      background: #9333ea;
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
      letter-spacing: -0.01em;
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
      background: rgba(147, 51, 234, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 9999px;
      border: 2px solid rgba(147, 51, 234, 0.2);
    }
    
    .social-button svg {
      width: 32px;
      height: 32px;
      color: #9333ea;
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
    <div class="geo-shape-1"></div>
    <div class="geo-shape-2"></div>
    <div class="geo-shape-3"></div>
    <div class="geo-shape-4"></div>
    <div class="geo-shape-5"></div>
    
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
              <img src="${photo || PLACEHOLDER_IMAGE}" alt="${name}" />
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
    let browser
    try {
      browser = await getBrowser()

      const page = await browser.newPage()
      await page.setViewport({ width, height })
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0',
        timeout: 60000 // Aumentar timeout para 60s
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
    const errorMessage = error?.message || 'Erro desconhecido'
    const errorStack = error?.stack || ''
    
    // Log detalhado para debug
    console.error('Detalhes do erro:', {
      message: errorMessage,
      name: error?.name,
      stack: errorStack.substring(0, 500) // Primeiros 500 chars do stack
    })
    
    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao gerar imagem: ' + errorMessage,
        message: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

