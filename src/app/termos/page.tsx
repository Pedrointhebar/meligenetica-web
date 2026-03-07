import Link from 'next/link'

export const metadata = {
  title: 'Termos de Uso — MeliGenética',
}

export default function TermosPage() {
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
          Termos de Uso
        </h1>
        <p style={{ color: '#9B8B70', marginBottom: 40 }}>Última atualização: março de 2025</p>

        <p style={s}>Ao utilizar o MeliGenética, você concorda com os termos descritos neste documento. Leia com atenção antes de criar sua conta.</p>

        <h2 style={h2}>1. O serviço</h2>
        <p style={s}>O MeliGenética é um software de gestão fenotípica para meliponicultura, fornecido como serviço (SaaS) por assinatura mensal. O serviço inclui acesso ao aplicativo web, armazenamento de dados do meliponário e atualizações do sistema.</p>

        <h2 style={h2}>2. Conta e responsabilidade</h2>
        <p style={s}>Você é responsável por manter a confidencialidade da sua senha e por todas as atividades realizadas na sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado. O MeliGenética não se responsabiliza por perdas decorrentes do uso não autorizado da sua conta.</p>

        <h2 style={h2}>3. Assinatura e pagamento</h2>
        <p style={s}>O plano inclui 7 dias de teste gratuito. Após o período de trial, a cobrança de R$5,00 é realizada mensalmente de forma automática. Você pode cancelar a qualquer momento nas configurações da sua conta — o cancelamento é efetivo ao final do período já pago, sem reembolso proporcional.</p>

        <h2 style={h2}>4. Uso aceitável</h2>
        <p style={s}>O serviço deve ser usado exclusivamente para fins legítimos de gestão de meliponários. É proibido: compartilhar credenciais de acesso, realizar engenharia reversa do sistema, usar o serviço para fins comerciais de revenda, ou tentar comprometer a segurança da plataforma.</p>

        <h2 style={h2}>5. Dados e backup</h2>
        <p style={s}>Você é responsável pelos dados inseridos no sistema. Recomendamos exportar seus dados periodicamente. O MeliGenética realiza backups regulares mas não garante recuperação em casos de perda por erro do usuário.</p>

        <h2 style={h2}>6. Disponibilidade</h2>
        <p style={s}>Buscamos manter disponibilidade de 99,5% ao mês. Manutenções programadas serão comunicadas com antecedência. Não nos responsabilizamos por indisponibilidades causadas por terceiros (provedores de infraestrutura, etc.).</p>

        <h2 style={h2}>7. Propriedade intelectual</h2>
        <p style={s}>O software, design e algoritmos do MeliGenética são propriedade exclusiva dos seus criadores. Os dados inseridos por você permanecem de sua propriedade. Ao usar o serviço, você nos concede licença limitada para armazenar e processar seus dados conforme necessário para o funcionamento do serviço.</p>

        <h2 style={h2}>8. Limitação de responsabilidade</h2>
        <p style={s}>O MeliGenética é uma ferramenta de apoio à decisão. As recomendações geradas pelo sistema têm caráter informativo e não substituem o julgamento do meliponicultor. Não nos responsabilizamos por decisões tomadas com base nos dados exibidos pelo sistema.</p>

        <h2 style={h2}>9. Alterações nos termos</h2>
        <p style={s}>Podemos atualizar estes termos com aviso prévio de 30 dias por e-mail. O uso continuado do serviço após as mudanças constitui aceitação dos novos termos.</p>

        <h2 style={h2}>10. Contato</h2>
        <p style={s}>Para dúvidas sobre estes termos: <strong>contato@meligenetica.com.br</strong></p>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #E2D9CC', display: 'flex', gap: 20 }}>
          <Link href="/privacidade" style={{ color: '#C9861A', textDecoration: 'none', fontSize: 14 }}>Política de Privacidade</Link>
          <Link href="/" style={{ color: '#9B8B70', textDecoration: 'none', fontSize: 14 }}>Voltar ao início</Link>
        </div>
      </div>
    </div>
  )
}
