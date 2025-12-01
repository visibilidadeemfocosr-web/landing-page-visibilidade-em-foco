import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import { execSync } from 'child_process'
import { existsSync } from 'fs'

// Função para encontrar o Chrome/Chromium no sistema
function findChromeExecutable(): string | null {
  const possiblePaths = [
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    // Windows (se estiver rodando em Windows)
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ]

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      return path
    }
  }

  // Tentar encontrar via comando (apenas Linux)
  try {
    if (process.platform === 'linux') {
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
    const { html, width = 1080, height = 1080 } = await request.json()

    if (!html) {
      return NextResponse.json(
        { error: 'HTML não fornecido' },
        { status: 400 }
      )
    }

    let browser
    try {
      // Encontrar o executável do Chrome
      const chromePath = process.env.CHROME_EXECUTABLE_PATH || findChromeExecutable()
      
      if (!chromePath) {
        return NextResponse.json(
          { 
            error: 'Chrome/Chromium não encontrado. Configure CHROME_EXECUTABLE_PATH ou instale o Chrome.',
            hint: 'Em macOS, o Chrome geralmente está em /Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          },
          { status: 500 }
        )
      }

      // Desenvolvimento - usar Chrome local
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
      
      // Definir viewport
      await page.setViewport({ width, height })
      
      // Carregar HTML
      await page.setContent(html, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      })
      
      // Aguardar renderização completa de todos os elementos
      await page.evaluate(() => {
        return new Promise<void>((resolve) => {
          // Aguardar todas as imagens carregarem
          const images = Array.from(document.querySelectorAll('img'))
          const imagePromises = images.map((img) => {
            if (img.complete) return Promise.resolve()
            return new Promise<void>((resolveImg) => {
              img.onload = () => resolveImg()
              img.onerror = () => resolveImg() // Continuar mesmo se falhar
            })
          })
          
          Promise.all(imagePromises).then(() => {
            // Aguardar um pouco mais para garantir que gradientes e efeitos sejam renderizados
            setTimeout(resolve, 1000)
          })
        })
      })
      
      // Capturar screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width,
          height
        }
      })

      await browser.close()

      // Retornar imagem como base64
      const base64 = (screenshot as Buffer).toString('base64')
      
      return NextResponse.json({
        success: true,
        image: `data:image/png;base64,${base64}`,
      })
    } catch (browserError: any) {
      if (browser) {
        try {
          await browser.close()
        } catch (e) {
          // Ignorar erro ao fechar
        }
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

