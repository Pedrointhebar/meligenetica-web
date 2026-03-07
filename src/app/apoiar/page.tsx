'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PIX_PAYLOAD = "00020126330014BR.GOV.BCB.PIX0111149740429045204000053039865802BR5911Pedro Nunes6009SAO PAULO62070503***6304EBD0"
const PIX_CHAVE = "14974042904"

export default function ApoiarPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(PIX_PAYLOAD)}&color=1A1209&bgcolor=ffffff&qzone=1`
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, 220, 220)
    }
  }, [])

  function copiarChave() {
    navigator.clipboard.writeText(PIX_CHAVE)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2500)
  }

  return (
    <div style={{ background: '#F7F3EE', minHeight: '100vh' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #E2D9CC',
        padding: '0 24px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ fontSize: 18, fontWeight: 800, color: '#C9861A', textDecoration: 'none' }}>
          ⬡ MeliGenética
        </Link>
        <Link href="/app" style={{ color: '#C9861A', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
          Abrir app →
        </Link>
      </nav>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🍯</div>
        <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: 'Georgia, serif',
          letterSpacing: '-0.5px', marginBottom: 12, color: '#1A1209' }}>
          Apoie o MeliGenética
        </h1>
        <p style={{ color: '#5C4A2A', lineHeight: 1.7, marginBottom: 40, fontSize: 16 }}>
          O MeliGenética é gratuito e feito com carinho para a comunidade de meliponicultores.
          Se ele te ajuda, considere apoiar com qualquer valor via Pix. 🐝
        </p>

        <div style={{ background: 'white', borderRadius: 20, padding: 28,
          border: '1px solid #E2D9CC', display: 'inline-block',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 28 }}>
          <canvas ref={canvasRef} width={220} height={220}
            style={{ display: 'block', borderRadius: 8 }} />
          <p style={{ margin: '16px 0 0', fontSize: 13, color: '#9B8B70', fontWeight: 600 }}>
            Escaneie com qualquer app bancário
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px',
          border: '1px solid #E2D9CC', marginBottom: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9B8B70',
              textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              Chave Pix (CPF)
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1209', letterSpacing: '0.5px' }}>
              {PIX_CHAVE}
            </div>
          </div>
          <button onClick={copiarChave} style={{
            background: copiado ? '#22c55e' : '#C9861A',
            color: 'white', border: 'none', borderRadius: 8,
            padding: '10px 18px', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {copiado ? '✓ Copiado!' : 'Copiar'}
          </button>
        </div>

        <p style={{ fontSize: 13, color: '#9B8B70', lineHeight: 1.6 }}>
          Titular: <strong>Pedro Nunes</strong><br />
          Qualquer valor é bem-vindo e muito apreciado 💛
        </p>

        <div style={{ marginTop: 48 }}>
          <Link href="/app" style={{ background: '#C9861A', color: 'white',
            padding: '12px 28px', borderRadius: 10, fontWeight: 700,
            textDecoration: 'none', fontSize: 15 }}>
            Voltar ao app →
          </Link>
        </div>
      </div>
    </div>
  )
}
