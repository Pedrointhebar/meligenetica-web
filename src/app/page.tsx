'use client'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  const beneficios = [
    { icon:'📊', titulo:'Painel completo',        desc:'Score médio, tendências e distribuição fenotípica do meliponário em tempo real.' },
    { icon:'🏆', titulo:'Ranking genético',       desc:'Índice ponderado multi-critério (Souza et al. 2018) com setas de tendência semanal.' },
    { icon:'📋', titulo:'Check-ins semanais',     desc:'Registro longitudinal de população, sanidade, mansidão e atividade de voo.' },
    { icon:'🍯', titulo:'Controle de colheita',   desc:'Rastreio de produção anual por colmeia com escala de referência científica.' },
    { icon:'📈', titulo:'Gráficos de evolução',   desc:'Visualize a tendência fenotípica de cada parâmetro ao longo do tempo.' },
    { icon:'🧬', titulo:'Diagnóstico automático', desc:'Interpretação científica baseada em Souza et al. (2018) e Nunes-Silva et al. (2016).' },
    { icon:'🪲', titulo:'Recomendação de divisão', desc:'Critérios objetivos para propagação do melhor material genético do plantel.' },
    { icon:'🌐', titulo:'Acesso web',             desc:'Use no computador ou celular. Dados salvos na nuvem.' },
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <nav style={{
        background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>⬡</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--amber)' }}>MeliGenética</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/login')}
            style={{ background: 'transparent', color: 'var(--amber)', border: '1.5px solid var(--amber)',
              borderRadius: 8, padding: '7px 16px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Entrar
          </button>
          <button onClick={() => router.push('/cadastro')}
            style={{ background: 'var(--amber)', color: 'white', border: 'none',
              borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
            Criar conta
          </button>
        </div>
      </nav>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--amber-soft)', borderRadius: 99,
          padding: '4px 14px', fontSize: 13, fontWeight: 600,
          color: 'var(--amber)', marginBottom: 24,
          border: '1px solid rgba(201,134,26,0.25)',
        }}>
          🐝 Baseado em literatura científica revisada por pares
        </div>
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 62px)', fontWeight: 800,
          letterSpacing: '-1.5px', lineHeight: 1.1,
          fontFamily: 'Georgia, serif', color: 'var(--text)', marginBottom: 20,
        }}>
          Seleção genética para<br />
          <span style={{ color: 'var(--amber)' }}>abelhas sem ferrão</span>
        </h1>
        <p style={{ fontSize: 20, color: 'var(--text2)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Registre check-ins semanais, monitore índices fenotípicos e tome decisões
          de divisão com base em dados — não em intuição.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/cadastro')}
            style={{ background: 'var(--amber)', color: 'white', border: 'none',
              borderRadius: 10, padding: '16px 36px', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
            Criar conta grátis →
          </button>
          <button onClick={() => router.push('/login')}
            style={{ background: 'white', color: 'var(--amber)', border: '1.5px solid var(--amber)',
              borderRadius: 10, padding: '16px 28px', fontSize: 17, fontWeight: 600, cursor: 'pointer' }}>
            Entrar
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 16 }}>
          100% gratuito · Sem cartão de crédito · Dados salvos na nuvem
        </p>
      </section>

      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.5px', fontFamily: 'Georgia, serif',
          marginBottom: 40, color: 'var(--text)' }}>
          Tudo que um meliponicultor precisa
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {beneficios.map(b => (
            <div key={b.titulo} style={{ background: 'white', borderRadius: 14,
              border: '1px solid var(--border)', padding: '20px' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>{b.titulo}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--amber)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white',
          fontFamily: 'Georgia, serif', marginBottom: 16, letterSpacing: '-0.5px' }}>
          Comece agora, gratuitamente
        </h2>
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.85)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
          Crie sua conta e registre suas primeiras colmeias em menos de 2 minutos.
        </p>
        <button onClick={() => router.push('/cadastro')}
          style={{ background: 'white', color: 'var(--amber)', border: 'none',
            borderRadius: 10, padding: '16px 40px', fontSize: 17, fontWeight: 700, cursor: 'pointer' }}>
          Criar conta grátis →
        </button>
      </section>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text3)', fontSize: 13 }}>
          © 2025 MeliGenética ·{' '}
          <a href="/privacidade" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Privacidade</a>
          {' · '}
          <a href="/termos" style={{ color: 'var(--amber)', textDecoration: 'none' }}>Termos</a>
        </p>
      </footer>
    </div>
  )
}
