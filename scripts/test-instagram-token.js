#!/usr/bin/env node

/**
 * Script para testar se o Access Token do Instagram está funcionando
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Carrega as variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnvValue = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.+)`));
  return match ? match[1].trim() : null;
};

const CURRENT_TOKEN = getEnvValue('INSTAGRAM_ACCESS_TOKEN');

console.log('🔍 Testando Access Token do Instagram...\n');

if (!CURRENT_TOKEN) {
  console.error('❌ Erro: INSTAGRAM_ACCESS_TOKEN não encontrado no .env.local');
  process.exit(1);
}

console.log(`📋 Token: ${CURRENT_TOKEN.substring(0, 30)}...\n`);

// Testar o token obtendo informações do usuário
const url = `https://graph.facebook.com/v18.0/me?access_token=${CURRENT_TOKEN}`;

console.log('🔄 Testando token...\n');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error('❌ Token inválido ou expirado:');
        console.error(`   ${response.error.message}`);
        console.error(`\n💡 Você precisa gerar um novo token no Meta for Developers.`);
        process.exit(1);
      }

      console.log('✅ Token válido!\n');
      console.log('📊 Informações:');
      console.log(`   ID: ${response.id}`);
      console.log(`   Nome: ${response.name || 'N/A'}`);
      
      // Testar se consegue acessar páginas
      console.log('\n🔄 Verificando páginas do Facebook...\n');
      
      const pagesUrl = `https://graph.facebook.com/v18.0/${response.id}/accounts?access_token=${CURRENT_TOKEN}`;
      
      https.get(pagesUrl, (pagesRes) => {
        let pagesData = '';
        
        pagesRes.on('data', (chunk) => {
          pagesData += chunk;
        });
        
        pagesRes.on('end', () => {
          try {
            const pagesResponse = JSON.parse(pagesData);
            
            if (pagesResponse.error) {
              console.error('❌ Erro ao obter páginas:');
              console.error(`   ${pagesResponse.error.message}`);
              process.exit(1);
            }
            
            if (!pagesResponse.data || pagesResponse.data.length === 0) {
              console.log('⚠️ Nenhuma página do Facebook encontrada.');
              console.log('   Certifique-se de que o Instagram está conectado a uma Página do Facebook.');
              process.exit(0);
            }
            
            console.log(`✅ ${pagesResponse.data.length} página(s) encontrada(s):\n`);
            
            pagesResponse.data.forEach((page, index) => {
              console.log(`   ${index + 1}. ${page.name} (ID: ${page.id})`);
            });
            
            console.log('\n✅ Token está funcionando corretamente!');
            console.log('\n💡 Agora você pode usar o sistema para publicar no Instagram.');
            
          } catch (error) {
            console.error('❌ Erro ao processar páginas:', error.message);
          }
        });
      }).on('error', (error) => {
        console.error('❌ Erro na requisição:', error.message);
      });
      
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error.message);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
  process.exit(1);
});

