'use client'
import { useRouter } from 'next/navigation'
import PixButton from '@/components/PixButton'

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
        <button onClick={() => router.push('/app')} style={{
          background: 'var(--amber)', color: 'white',
          border: 'none', borderRadius: 8, padding: '8px 18px',
          fontWeight: 600, fontSize: 14, cursor: 'pointer',
        }}>
          Acessar app
        </button>
      </nav>

      {/* ── Hero ── */}
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
          <button onClick={() => router.push('/cadastro')} style={{
            background: 'var(--amber)', color: 'white',
            border: 'none', borderRadius: 10, padding: '16px 36px',
            fontSize: 17, fontWeight: 700, cursor: 'pointer',
          }}>
            Criar conta grátis →
          </button>
          <button onClick={() => router.push('/login')} style={{
            background: 'white', color: 'var(--amber)',
            border: '1.5px solid var(--amber)', borderRadius: 10, padding: '16px 28px',
            fontSize: 17, fontWeight: 600, cursor: 'pointer',
          }}>
            Entrar
          </button>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 16 }}>
          100% gratuito · Sem cartão de crédito · Dados salvos na nuvem
        </p>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{
          textAlign: 'center', fontSize: 28, fontWeight: 700,
          letterSpacing: '-0.5px', fontFamily: 'Georgia, serif',
          marginBottom: 40, color: 'var(--text)',
        }}>
          Tudo que um meliponicultor precisa
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {beneficios.map(b => (
            <div key={b.titulo} className="card-hover" style={{
              background: 'white', borderRadius: 14,
              border: '1px solid var(--border)', padding: '20px',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: 'var(--text)' }}>{b.titulo}</div>
              <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section style={{
        background: 'white', borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)', padding: '64px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 460, margin: '0 auto' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', fontFamily: 'Georgia, serif', marginBottom: 8 }}>
            Comece agora, é gratuito
          </h2>
          <p style={{ color: 'var(--text3)', marginBottom: 32 }}>
            Sem cartão de crédito. Sem limite de colmeias.
          </p>
          <button onClick={() => router.push('/cadastro')} style={{
            background: 'var(--amber)', color: 'white',
            border: 'none', borderRadius: 10, padding: '16px 40px',
            fontSize: 17, fontWeight: 700, cursor: 'pointer',
          }}>
            Criar minha conta →
          </button>
        </div>
      </section>

      {/* ── Referências ── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, fontFamily: 'Georgia, serif', color: 'var(--text)' }}>
          🔬 Embasamento científico
        </h2>
        <div style={{ background: 'white', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
          {refs.map((ref, i) => (
            <div key={i} style={{
              padding: '14px 18px', fontSize: 14, color: 'var(--text2)',
              borderBottom: i < refs.length - 1 ? '1px solid var(--border)' : 'none',
              fontStyle: 'italic', lineHeight: 1.5,
            }}>
              <span style={{ fontStyle: 'normal', marginRight: 8 }}>📄</span>{ref}
            </div>
          ))}
        </div>
      </section>

      {/* ── SEO: Sobre Meliponicultura ── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, fontFamily: 'Georgia, serif', color: 'var(--text)' }}>
          O que é Meliponicultura?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
          A meliponicultura é a criação racional de abelhas sem ferrão (Meliponini), abelhas nativas do Brasil com grande importância ecológica e econômica. Espécies como Jataí (Tetragonisca angustula), Mandaçaia (Melipona quadrifasciata), Uruçu (Melipona scutellaris), Tiúba (Melipona compressipes) e Jandaíra (Melipona subnitida) são amplamente criadas por meliponicultores em todo o país.
        </p>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 16 }}>
          A seleção genética em meliponicultura consiste em identificar e propagar colônias com melhores índices fenotípicos — maior produção de mel, força populacional, mansidão, sanidade e atividade de voo. O MeliGenética automatiza esse processo com base em critérios científicos validados.
        </p>
        <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8 }}>
          A divisão de colmeias é a principal técnica de reprodução em meliponicultura. Realizada corretamente, a partir das colônias geneticamente superiores, garante a evolução do plantel ao longo das gerações.
        </p>
      </section>
      {/* ── FAQ ── */}
      <section style={{ background: 'white', borderTop: '1px solid var(--border)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, fontFamily: 'Georgia, serif', color: 'var(--text)' }}>
            Perguntas frequentes
          </h2>
          {[
            { p: 'O MeliGenética é gratuito?', r: 'Sim, 100% gratuito e sem limite de colmeias. Não precisa de cartão de crédito.' },
            { p: 'Quais espécies de abelhas sem ferrão são suportadas?', r: 'Jataí, Mandaçaia, Uruçu, Tiúba, Jandaíra, Iraí, Tubiba e outras espécies de Meliponini brasileiros.' },
            { p: 'Como funciona o score genético?', r: 'É um índice ponderado multi-critério baseado em Souza et al. (2018), considerando produção anual (30%), força populacional (20%), sanidade (20%), atividade de voo (15%) e mansidão (15%).' },
            { p: 'Quando devo fazer a divisão de uma colmeia?', r: 'O sistema indica automaticamente quando uma colônia atinge os critérios mínimos: score acima de 65, população forte e boa sanidade.' },
            { p: 'Meus dados ficam salvos?', r: 'Sim, todos os dados são salvos na nuvem e sincronizados entre dispositivos.' },
          ].map(({ p, r }, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--border)', padding: '20px 0' }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: 'var(--text)' }}>❓ {p}</div>
              <div style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.7 }}>{r}</div>
            </div>
          ))}
        </div>
      </section>
      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
        © 2025 MeliGenética · Todos os direitos reservados ·{' '}
        <a href="/privacidade" style={{ color: 'var(--amber)' }}>Privacidade</a> ·{' '}
        <a href="/termos" style={{ color: 'var(--amber)' }}>Termos</a>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '48px 24px',
          borderTop: '1px solid #e5e7eb',
          marginTop: 32,
        }}>
          <PixButton />
        </div>
      </footer>
    </div>
  )
}
