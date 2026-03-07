'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CadastroPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('As senhas não conferem.')
      return
    }

    setLoading(true)

    // 1. Criar conta
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Erro ao criar conta.')
      setLoading(false)
      return
    }

    // 2. Login automático após cadastro
    const login = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    })

    if (login?.ok) {
      router.push('/app')
      router.refresh()
    } else {
      router.push('/login')
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
          7 dias grátis · R$&nbsp;5,00/mês
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
          Criar sua conta
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Seu nome"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>E-mail</label>
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
            <label style={labelStyle}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Confirmar senha</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repita a senha"
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
              width: '100%', padding: '13px',
              background: 'var(--amber)', color: 'white',
              border: 'none', borderRadius: 10,
              fontSize: 16, fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {loading ? 'Criando conta...' : 'Criar conta e começar'}
          </button>
        </form>

        <p style={{
          fontSize: 12, color: 'var(--text3)', marginTop: 14,
          textAlign: 'center', lineHeight: 1.5,
        }}>
          Ao criar conta você concorda com os{' '}
          <Link href="/termos" style={{ color: 'var(--amber)' }}>Termos de uso</Link>
          {' '}e{' '}
          <Link href="/privacidade" style={{ color: 'var(--amber)' }}>Política de privacidade</Link>.
        </p>

        <div style={{
          marginTop: 20, paddingTop: 20,
          borderTop: '1px solid var(--border)',
          textAlign: 'center', fontSize: 14, color: 'var(--text3)',
        }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: 'var(--amber)', fontWeight: 600, textDecoration: 'none' }}>
            Entrar
          </Link>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 600,
  color: 'var(--text2)', display: 'block', marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  borderRadius: 10, border: '1.5px solid var(--border)',
  fontSize: 15, outline: 'none', color: 'var(--text)',
  background: 'white',
}
