import nodemailer from 'nodemailer'

interface SendEmailParams {
  to: string
  artistName: string
  instagramPostUrl: string
}

/**
 * Cria o template HTML do e-mail de notificação
 */
function createEmailTemplate({ artistName, instagramPostUrl }: Omit<SendEmailParams, 'to'>): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu post está no ar! - Visibilidade em Foco</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header com gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333EA 0%, #F97316 50%, #EC4899 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">
                VISIBILIDADE EM FOCO
              </h1>
            </td>
          </tr>
          
          <!-- Conteúdo principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
                Olá, ${artistName}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Queremos agradecer sua participação no <strong>1º Mapeamento Cultural de Artistas LGBTQIAPN+</strong> do município de São Roque!
              </p>
              
              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                É com muita alegria que informamos que <strong style="color: #9333EA;">seu post está no ar no Instagram!</strong> 🎉
              </p>
              
              <!-- Botão CTA -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${instagramPostUrl}" 
                       style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #9333EA 0%, #F97316 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);">
                      Ver Post no Instagram 📸
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                Ao registrar nossas existências, criamos um arquivo vivo que valida identidades e fortalece redes de apoio. 
                <strong style="color: #9333EA;">Sua voz importa!</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #1f2937; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 14px;">
                <strong style="color: #ffffff;">Visibilidade em Foco</strong>
              </p>
              <p style="margin: 0 0 15px 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                1º Mapeamento Cultural de Artistas LGBTQIAPN+<br>
                Município de São Roque
              </p>
              <div style="margin: 20px 0;">
                <a href="https://instagram.com/visibilidadeemfocosr" style="color: #9333EA; text-decoration: none; margin: 0 10px; font-size: 14px;">Instagram</a>
                <span style="color: #6b7280;">|</span>
                <a href="https://www.facebook.com/share/14UaAhPw5VN/?mibextid=wwXIfr" style="color: #9333EA; text-decoration: none; margin: 0 10px; font-size: 14px;">Facebook</a>
              </div>
              <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 11px;">
                © 2025 Visibilidade em Foco. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Envia e-mail de notificação quando o post é publicado no Instagram
 */
export async function sendPostPublishedEmail({ to, artistName, instagramPostUrl }: SendEmailParams): Promise<void> {
  // Verificar se as variáveis de ambiente estão configuradas
  const gmailUser = process.env.GMAIL_USER
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailAppPassword) {
    console.warn('⚠️ Gmail credentials não configuradas. E-mail não será enviado.')
    console.warn('Configure GMAIL_USER e GMAIL_APP_PASSWORD nas variáveis de ambiente.')
    return
  }

  // Validar e-mail
  if (!to || !to.includes('@')) {
    console.warn(`⚠️ E-mail inválido: ${to}. E-mail não será enviado.`)
    return
  }

  try {
    // Criar transporter do nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    // Criar template do e-mail
    const htmlContent = createEmailTemplate({ artistName, instagramPostUrl })

    // Enviar e-mail
    const info = await transporter.sendMail({
      from: `"Visibilidade em Foco" <${gmailUser}>`,
      to,
      subject: '🎉 Seu post está no ar no Instagram! - Visibilidade em Foco',
      html: htmlContent,
      text: `
Olá, ${artistName}!

Queremos agradecer sua participação no 1º Mapeamento Cultural de Artistas LGBTQIAPN+ do município de São Roque!

É com muita alegria que informamos que seu post está no ar no Instagram! 🎉

Acesse o post: ${instagramPostUrl}

Ao registrar nossas existências, criamos um arquivo vivo que valida identidades e fortalece redes de apoio. Sua voz importa!

Visibilidade em Foco
1º Mapeamento Cultural de Artistas LGBTQIAPN+
Município de São Roque

Instagram: https://instagram.com/visibilidadeemfocosr
Facebook: https://www.facebook.com/share/14UaAhPw5VN/?mibextid=wwXIfr

© 2025 Visibilidade em Foco. Todos os direitos reservados.
      `.trim(),
    })

    console.log('✅ E-mail enviado com sucesso:', info.messageId)
  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error)
    // Não lançar erro para não quebrar o fluxo de publicação
    // O post já foi publicado, então apenas logamos o erro
  }
}
