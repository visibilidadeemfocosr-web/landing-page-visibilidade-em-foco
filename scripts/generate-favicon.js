const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateFavicon() {
  try {
    const logoPath = path.join(__dirname, '../public/logoN.png')
    const publicFaviconPath = path.join(__dirname, '../public/favicon.ico')
    const appFaviconPath = path.join(__dirname, '../app/favicon.ico')
    
    // Verificar se o logo existe
    if (!fs.existsSync(logoPath)) {
      console.error('Logo não encontrado em:', logoPath)
      process.exit(1)
    }

    // Criar favicon de 32x32 com fundo branco (melhor visibilidade)
    const favicon32 = await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 } // Fundo branco
      })
      .png()
      .toBuffer()
    
    // Criar também um 16x16
    const favicon16 = await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer()
    
    // Salvar PNGs
    fs.writeFileSync(path.join(__dirname, '../public/favicon-32x32.png'), favicon32)
    fs.writeFileSync(path.join(__dirname, '../public/favicon-16x16.png'), favicon16)
    
    // Para favicon.ico, vamos usar o 32x32 (navegadores modernos aceitam PNG como .ico)
    // Mas vamos criar um arquivo que funcione melhor
    fs.writeFileSync(publicFaviconPath, favicon32)
    fs.writeFileSync(appFaviconPath, favicon32)
    
    console.log('✅ Favicon gerado com sucesso!')
    console.log('📁 Arquivos criados:')
    console.log('   - app/favicon.ico (Next.js 13+ usa automaticamente)')
    console.log('   - public/favicon.ico')
    console.log('   - public/favicon-16x16.png')
    console.log('   - public/favicon-32x32.png')
    console.log('\n💡 Para forçar atualização no navegador:')
    console.log('   - Chrome/Edge: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)')
    console.log('   - Firefox: Ctrl+F5 (Windows) ou Cmd+Shift+R (Mac)')
    console.log('   - Ou limpe o cache do navegador')
  } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error)
    process.exit(1)
  }
}

generateFavicon()

