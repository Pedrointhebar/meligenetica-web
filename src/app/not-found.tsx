import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#F7F3EE',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🐝</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px',
        fontFamily: 'Georgia, serif', marginBottom: 8, color: '#1A1209' }}>
        Página não encontrada
      </h1>
      <p style={{ color: '#9B8B70', marginBottom: 32, maxWidth: 320, lineHeight: 1.6 }}>
        A abelha explorou por aqui mas não encontrou o que você procura.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link href="/" style={{ background: '#C9861A', color: 'white',
          padding: '12px 24px', borderRadius: 10, fontWeight: 700,
          textDecoration: 'none', fontSize: 15 }}>
          Voltar ao início
        </Link>
        <Link href="/app" style={{ background: 'white', color: '#C9861A',
          padding: '12px 24px', borderRadius: 10, fontWeight: 700,
          textDecoration: 'none', fontSize: 15, border: '1.5px solid #C9861A' }}>
          Abrir app
        </Link>
      </div>
    </div>
  )
}
