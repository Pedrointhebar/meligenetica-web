// ─── email.ts ────────────────────────────────────────────────────────────────
// Envia e-mails via Resend (resend.com — gratuito até 3.000/mês)
// Se RESEND_API_KEY não estiver configurado, apenas loga no console.

export async function sendWelcomeEmail(to: string, name: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL] Boas-vindas para ${name} <${to}>`)
    return
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <body style="font-family:system-ui,sans-serif;background:#F7F3EE;margin:0;padding:40px 20px">
      <div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;
        border:1px solid #E2D9CC;overflow:hidden">
        <div style="background:#C9861A;padding:32px;text-align:center">
          <div style="font-size:48px">⬡</div>
          <h1 style="color:white;margin:8px 0 0;font-size:24px;font-family:Georgia,serif">
            MeliGenética
          </h1>
        </div>
        <div style="padding:32px">
          <h2 style="color:#1A1209;margin:0 0 16px;font-size:22px">
            Bem-vindo, ${name}! 🐝
          </h2>
          <p style="color:#5C4A2A;line-height:1.7;margin:0 0 20px">
            Sua conta foi criada com sucesso. Você tem <strong>7 dias grátis</strong>
            para explorar todos os recursos do MeliGenética.
          </p>
          <p style="color:#5C4A2A;line-height:1.7;margin:0 0 28px">
            Com o MeliGenética você pode registrar check-ins semanais,
            acompanhar o índice fenotípico de cada colmeia e tomar decisões
            de divisão baseadas em critérios científicos.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/app"
            style="display:inline-block;background:#C9861A;color:white;
            padding:14px 28px;border-radius:10px;text-decoration:none;
            font-weight:700;font-size:16px">
            Acessar meu meliponário →
          </a>
          <hr style="border:none;border-top:1px solid #E2D9CC;margin:32px 0">
          <p style="color:#9B8B70;font-size:13px;line-height:1.6;margin:0">
            Você está recebendo este e-mail porque criou uma conta no MeliGenética.
            <br>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacidade"
              style="color:#C9861A">Política de Privacidade</a> ·
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/termos"
              style="color:#C9861A">Termos de Uso</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MeliGenética <noreply@meligenetica.com.br>',
        to,
        subject: `Bem-vindo ao MeliGenética, ${name}! 🐝`,
        html,
      }),
    })
  } catch (err) {
    console.error('Email error:', err)
  }
}
