'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SucessoPage() {
  const router = useRouter()
  useEffect(() => {
    const t = setTimeout(() => router.push('/app'), 4000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'white', borderRadius: 20,
        border: '1px solid var(--border)', padding: '48px 40px',
        textAlign: 'center', maxWidth: 420,
      }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{
          fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px',
          fontFamily: 'Georgia, serif', marginBottom: 10, color: 'var(--text)',
        }}>
          Bem-vindo ao MeliGenética!
        </h1>
        <p style={{ color: 'var(--text2)', marginBottom: 8, lineHeight: 1.6 }}>
          Sua conta foi criada com sucesso. Explore todos os recursos disponíveis.
        </p>
        <p style={{ color: 'var(--text3)', fontSize: 13, marginBottom: 28 }}>
          Redirecionando para o app em instantes...
        </p>
        <button
          onClick={() => router.push('/app')}
          style={{
            background: 'var(--amber)', color: 'white',
            border: 'none', borderRadius: 10, padding: '13px 28px',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Acessar o app agora
        </button>
      </div>
    </div>
  )
}
