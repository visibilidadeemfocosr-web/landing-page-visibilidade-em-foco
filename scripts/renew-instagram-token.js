#!/usr/bin/env node

/**
 * Script para trocar Short-lived Token por Long-lived Token
 * e renovar tokens que estão próximos de expirar
 * 
 * Uso:
 * node scripts/renew-instagram-token.js
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

const APP_ID = getEnvValue('INSTAGRAM_APP_ID');
const APP_SECRET = getEnvValue('INSTAGRAM_APP_SECRET');
const CURRENT_TOKEN = getEnvValue('INSTAGRAM_ACCESS_TOKEN');

console.log('🔑 Renovando Access Token do Instagram...\n');

if (!APP_ID || !APP_SECRET || !CURRENT_TOKEN) {
  console.error('❌ Erro: Variáveis de ambiente não encontradas no .env.local');
  console.error('   Certifique-se de que INSTAGRAM_APP_ID, INSTAGRAM_APP_SECRET e INSTAGRAM_ACCESS_TOKEN estão configurados.');
  process.exit(1);
}

console.log('📋 Configuração:');
console.log(`   App ID: ${APP_ID}`);
console.log(`   App Secret: ${APP_SECRET.substring(0, 10)}...`);
console.log(`   Token atual: ${CURRENT_TOKEN.substring(0, 20)}...\n`);

// URL da API do Instagram para trocar tokens
// Nota: Para Instagram Graph API, usamos a mesma URL do Facebook
const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${CURRENT_TOKEN}`;

console.log('🔄 Solicitando Long-lived Token...\n');

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);

      if (response.error) {
        console.error('❌ Erro ao renovar token:');
        console.error(`   ${response.error.message}`);
        console.error(`\n💡 Dica: Se o token atual já expirou, você precisa:`);
        console.error(`   1. Acessar: https://developers.facebook.com/`);
        console.error(`   2. Ir em seu app → Casos de uso → API do Instagram`);
        console.error(`   3. Gerar um novo token`);
        console.error(`   4. Atualizar o .env.local com o novo token`);
        console.error(`   5. Executar este script novamente`);
        process.exit(1);
      }

      const newToken = response.access_token;
      const expiresIn = response.expires_in; // segundos até expirar
      const expiresInDays = Math.floor(expiresIn / 86400);

      console.log('✅ Long-lived Token gerado com sucesso!\n');
      console.log('📊 Informações:');
      console.log(`   Novo Token: ${newToken.substring(0, 30)}...`);
      console.log(`   Expira em: ${expiresInDays} dias (${expiresIn} segundos)\n`);

      // Atualizar o .env.local
      console.log('💾 Atualizando .env.local...');
      
      const updatedEnvContent = envContent.replace(
        /INSTAGRAM_ACCESS_TOKEN=.+/,
        `INSTAGRAM_ACCESS_TOKEN=${newToken}`
      );

      fs.writeFileSync(envPath, updatedEnvContent, 'utf8');

      console.log('✅ Arquivo .env.local atualizado!\n');
      console.log('🎉 Pronto! Seu token agora é válido por 60 dias.');
      console.log(`\n⏰ Lembre-se de renovar novamente antes de: ${new Date(Date.now() + expiresIn * 1000).toLocaleDateString('pt-BR')}`);
      console.log('\n💡 Dica: Execute este script novamente em 50 dias para renovar automaticamente.');
      
    } catch (error) {
      console.error('❌ Erro ao processar resposta:', error.message);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('❌ Erro na requisição:', error.message);
  process.exit(1);
});

