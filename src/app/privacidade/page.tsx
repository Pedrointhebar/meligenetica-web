import Link from 'next/link'

export const metadata = {
  title: 'Política de Privacidade — MeliGenética',
}

export default function PrivacidadePage() {
  const s = { marginBottom: 24, lineHeight: 1.8, color: '#3d2e1a' }
  const h2 = { fontSize: 20, fontWeight: 700, marginBottom: 12, marginTop: 32, color: '#1A1209' }
  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh', padding: '0 0 60px' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2D9CC', padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#C9861A', textDecoration: 'none' }}>
          ⬡ MeliGenética
        </Link>
        <Link href="/login" style={{ color: '#C9861A', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
          Entrar
        </Link>
      </nav>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
          Política de Privacidade
        </h1>
        <p style={{ color: '#9B8B70', marginBottom: 40 }}>Última atualização: março de 2025</p>

        <p style={s}>O MeliGenética respeita sua privacidade. Este documento explica quais dados coletamos, como os usamos e quais são seus direitos.</p>

        <h2 style={h2}>1. Dados que coletamos</h2>
        <p style={s}>Coletamos apenas os dados necessários para o funcionamento do serviço: nome, endereço de e-mail, senha (armazenada em hash bcrypt) e os dados do seu meliponário (colmeias, check-ins, registros de colheita). Não coletamos dados de localização, contatos ou qualquer outra informação do dispositivo.</p>

        <h2 style={h2}>2. Como usamos seus dados</h2>
        <p style={s}>Seus dados são usados exclusivamente para: autenticar sua conta e armazenar e exibir os dados do seu meliponário. Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins de marketing.</p>

        <h2 style={h2}>3. Segurança</h2>
        <p style={s}>Suas senhas são armazenadas usando bcrypt com fator de custo 12. Toda comunicação é criptografada via HTTPS/TLS. Os dados são armazenados em servidores seguros com backups regulares.</p>

        <h2 style={h2}>4. Seus direitos (LGPD)</h2>
        <p style={s}>De acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018), você tem direito a: acessar seus dados, corrigir dados incorretos, solicitar a exclusão da sua conta e dados, e revogar seu consentimento a qualquer momento. Para exercer esses direitos, entre em contato pelo e-mail abaixo.</p>

        <h2 style={h2}>5. Cookies</h2>
        <p style={s}>Usamos apenas cookies essenciais para manter sua sessão autenticada. Não utilizamos cookies de rastreamento ou publicidade.</p>

        <h2 style={h2}>6. Retenção de dados</h2>
        <p style={s}>Seus dados são mantidos enquanto sua conta estiver ativa. Ao solicitar a exclusão da conta, todos os seus dados são removidos permanentemente em até 30 dias.</p>

        <h2 style={h2}>7. Contato</h2>
        <p style={s}>Para dúvidas sobre privacidade, entre em contato: <strong>contato@meligenetica.com.br</strong></p>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E2D9CC', display: 'flex', gap: 20 }}>
          <Link href="/termos" style={{ color: '#C9861A', textDecoration: 'none', fontSize: 14 }}>Termos de Uso</Link>
          <Link href="/" style={{ color: '#9B8B70', textDecoration: 'none', fontSize: 14 }}>Voltar ao início</Link>
        </div>
      </div>
    </div>
  )
}
