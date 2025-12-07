const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function generateFavicon() {
  try {
    const logoPath = path.join(__dirname, '../public/logoN.png')
    const outputPath = path.join(__dirname, '../public/favicon.ico')
    
    // Verificar se o logo existe
    if (!fs.existsSync(logoPath)) {
      console.error('Logo não encontrado em:', logoPath)
      process.exit(1)
    }

    // Para favicon.ico, vamos criar múltiplos tamanhos e combinar
    // Mas como sharp não suporta .ico diretamente, vamos criar um PNG de 32x32
    // e depois você pode converter manualmente ou usar uma ferramenta online
    
    // Criar favicon de 32x32 (tamanho padrão)
    await sharp(logoPath)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparente
      })
      .png()
      .toFile(path.join(__dirname, '../public/favicon-32x32.png'))
    
    // Criar também um 16x16
    await sharp(logoPath)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(__dirname, '../public/favicon-16x16.png'))
    
    // Copiar o 32x32 como favicon.ico (muitos navegadores aceitam PNG como .ico)
    // Ou criar um ICO real usando uma biblioteca específica
    fs.copyFileSync(
      path.join(__dirname, '../public/favicon-32x32.png'),
      outputPath
    )
    
    console.log('✅ Favicon gerado com sucesso!')
    console.log('📁 Arquivos criados:')
    console.log('   - public/favicon.ico (32x32)')
    console.log('   - public/favicon-16x16.png')
    console.log('   - public/favicon-32x32.png')
    console.log('\n💡 Dica: Para um favicon.ico real com múltiplos tamanhos,')
    console.log('   use uma ferramenta online como: https://favicon.io/favicon-converter/')
  } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error)
    process.exit(1)
  }
}

generateFavicon()

