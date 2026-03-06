'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url // Redirect to Stripe Checkout
      } else {
        setError(data.error || 'Erro inesperado. Tente novamente.')
      }
    } catch {
      setError('Erro de conexão. Verifique sua internet.')
    }
    setLoading(false)
  }

  const beneficios = [
    { icon:'📊', titulo:'Painel completo',        desc:'Score médio, tendências e distribuição fenotípica do meliponário em tempo real.' },
    { icon:'🏆', titulo:'Ranking genético',       desc:'Índice ponderado multi-critério (Souza et al. 2018) com setas de tendência semanal.' },
    { icon:'📋', titulo:'Check-ins semanais',     desc:'Registro longitudinal de população, sanidade, mansidão e atividade de voo.' },
    { icon:'🍯', titulo:'Controle de colheita',   desc:'Rastreio de produção anual por colmeia com escala de referência científica.' },
    { icon:'📈', titulo:'Gráficos de evolução',   desc:'Visualize a tendência fenotípica de cada parâmetro ao longo do tempo.' },
    { icon:'🧬', titulo:'Diagnóstico automático', desc:'Interpretação científica baseada em Souza et al. (2018) e Nunes-Silva et al. (2016).' },
    { icon:'🪲', titulo:'Recomendação de divisão','desc':'Critérios objetivos para propagação do melhor material genético do plantel.' },
    { icon:'🌐', titulo:'Acesso web e iOS',       desc:'Use no computador e no iPhone. Dados sincronizados.' },
  ]

  const refs = [
    'Souza et al. (2018) — Critérios para seleção genética de Meliponini',
    'Nunes-Silva et al. (2016) — Boas práticas de manejo para abelhas nativas',
    'Villas-Bôas (2012) — Mel de abelhas sem ferrão: produção e controle de qualidade',
    'Kerr et al. (1996) — Biodiversidade e meliponicultura amazônica',
  ]

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{
        background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>⬡</span>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.4px', color: 'var(--amber)' }}>
            MeliGenética
          </span>
        </div>
        <button
          onClick={() => router.push('/app')}
          style={{
            background: 'var(--amber)', color: 'white',
            border: 'none', borderRadius: 8, padding: '8px 18px',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}
        >
          Acessar app
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        maxWidth: 900, margin: '0 auto', padding: '80px 24px 64px',
        textAlign: 'center',
      }}>
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
          fontFamily: 'Georgia, serif',
          color: 'var(--text)', marginBottom: 20,
        }}>
          Seleção genética para<br />
          <span style={{ color: 'var(--amber)' }}>abelhas sem ferrão</span>
        </h1>

        <p style={{
          fontSize: 20, color: 'var(--text2)', maxWidth: 560,
          margin: '0 auto 40px', lineHeight: 1.6,
        }}>
          Registre check-ins semanais, monitore índices fenotípicos e tome decisões
          de divisão com base em dados — não em intuição.
        </p>

        {/* CTA form */}
        <form onSubmit={handleSubscribe} style={{
          display: 'flex', gap: 10, maxWidth: 480, margin: '0 auto',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              flex: '1 1 240px', padding: '14px 18px',
              borderRadius: 10, border: '1.5px solid var(--border)',
              fontSize: 16, background: 'white', outline: 'none',
              color: 'var(--text)',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'var(--amber)', color: 'white',
              border: 'none', borderRadius: 10, padding: '14px 28px',
              fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1, whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Aguarde...' : 'Começar 7 dias grátis'}
          </button>
        </form>

        {error && (
          <p style={{ color: 'var(--red)', fontSize: 14, marginTop: 12 }}>{error}</p>
        )}

        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 14 }}>
          R$&nbsp;5,00/mês após o trial · Cancele quando quiser · Sem fidelidade
        </p>
      </section>

      {/* ── Features ── */}
      <section style={{
        maxWidth: 960, margin: '0 auto', padding: '0 24px 80px',
      }}>
        <h2 style={{
          textAlign: 'center', fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.5px', fontFamily: 'Georgia, serif',
          marginBottom: 40, color: 'var(--text)',
        }}>
          Tudo que um meliponicultor precisa
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {beneficios.map(b => (
            <div key={b.titulo} className="card-hover" style={{
              background: 'white', borderRadius: 14,
              border: '1px solid var(--border)', padding: '20px 20px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>
                {b.titulo}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
                {b.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section style={{
        background: 'white', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '64px 24px',
      }}>
        <div style={{ maxWidth: 460, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px',
            fontFamily: 'Georgia, serif', marginBottom: 8,
          }}>
            Um plano simples
          </h2>
          <p style={{ color: 'var(--text3)', marginBottom: 36 }}>
            Sem surpresas, sem planos confusos.
          </p>

          <div style={{
            border: '2px solid var(--amber)', borderRadius: 20,
            padding: '32px 28px', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--amber)', color: 'white',
              fontSize: 12, fontWeight: 700, padding: '4px 14px', borderRadius: 99,
            }}>
              7 DIAS GRÁTIS
            </div>

            <div style={{
              fontSize: 52, fontWeight: 800, color: 'var(--amber)',
              letterSpacing: '-2px', lineHeight: 1,
            }}>
              R$&nbsp;5
              <span style={{ fontSize: 20, fontWeight: 400, color: 'var(--text3)' }}>/mês</span>
            </div>
            <p style={{ color: 'var(--text3)', fontSize: 14, margin: '8px 0 28px' }}>
              após o período de teste gratuito
            </p>

            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 28 }}>
              {[
                'Colmeias ilimitadas',
                'Check-ins semanais ilimitados',
                'Gráficos de evolução genética',
                'Ranking fenotípico ponderado',
                'Diagnósticos científicos automáticos',
                'Acesso web + iOS',
                'Dados salvos localmente (privacidade)',
              ].map(item => (
                <li key={item} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 0', fontSize: 15, color: 'var(--text)',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  padding: '13px 16px', borderRadius: 10,
                  border: '1.5px solid var(--border)', fontSize: 15,
                  outline: 'none', color: 'var(--text)',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'var(--amber)', color: 'white',
                  border: 'none', borderRadius: 10, padding: '15px',
                  fontSize: 16, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                }}
              >
                {loading ? 'Redirecionando...' : 'Assinar agora — 7 dias grátis'}
              </button>
            </form>

            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 12, lineHeight: 1.5 }}>
              Pagamento processado pelo Stripe. Cancele a qualquer momento
              nas configurações da sua conta.
            </p>
          </div>
        </div>
      </section>

      {/* ── Referências ── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, marginBottom: 20,
          fontFamily: 'Georgia, serif', color: 'var(--text)',
        }}>
          🔬 Embasamento científico
        </h2>
        <div style={{
          background: 'white', borderRadius: 14,
          border: '1px solid var(--border)', overflow: 'hidden',
        }}>
          {refs.map((ref, i) => (
            <div key={i} style={{
              padding: '14px 18px', fontSize: 14, color: 'var(--text2)',
              borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none',
              fontStyle: 'italic', lineHeight: 1.5,
            }}>
              <span style={{ fontStyle: 'normal', marginRight: 8 }}>📄</span>
              {ref}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '24px', textAlign: 'center',
        fontSize: 13, color: 'var(--text3)',
      }}>
        © 2025 MeliGenética · Todos os direitos reservados ·{' '}
        <a href="/privacidade" style={{ color: 'var(--amber)' }}>Privacidade</a> ·{' '}
        <a href="/termos" style={{ color: 'var(--amber)' }}>Termos</a>
      </footer>
    </div>
  )
}
