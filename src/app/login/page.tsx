'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    })

    if (res?.ok) {
      router.push('/app')
      router.refresh()
    } else {
      setError('E-mail ou senha incorretos.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>⬡</div>
        <h1 style={{
          fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px',
          fontFamily: 'Georgia, serif', color: 'var(--amber)',
        }}>
          MeliGenética
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text3)', marginTop: 4 }}>
          Seleção genética de abelhas sem ferrão
        </p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 400,
        background: '#fff', borderRadius: 18,
        border: '1px solid var(--border)',
        padding: '32px 28px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
      }}>
        <h2 style={{
          fontSize: 22, fontWeight: 700, letterSpacing: '-0.4px',
          marginBottom: 24, color: 'var(--text)',
        }}>
          Entrar na sua conta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(192,57,43,0.08)',
              border: '1px solid rgba(192,57,43,0.25)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 13, color: 'var(--red)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...btnStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'wait' : 'pointer',
              marginTop: 4,
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{
          marginTop: 24, paddingTop: 20,
          borderTop: '1px solid var(--border)',
          textAlign: 'center', fontSize: 14, color: 'var(--text3)',
        }}>
          Não tem conta?{' '}
          <Link href="/cadastro" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>
            Criar conta grátis
          </Link>
        </div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  borderRadius: 10, border: '1.5px solid var(--border)',
  fontSize: 15, outline: 'none', color: 'var(--text)',
  background: 'white', transition: 'border-color 0.15s',
}

const btnStyle: React.CSSProperties = {
  width: '100%', padding: '13px',
  background: 'var(--amber)', color: 'white',
  border: 'none', borderRadius: 10,
  fontSize: 16, fontWeight: 700,
}
