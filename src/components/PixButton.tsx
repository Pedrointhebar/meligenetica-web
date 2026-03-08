'use client'

import { useState } from 'react'

const CHAVE_PIX = '70f87166-2838-47aa-837e-3e29c5770d6c'

export default function PixButton() {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    await navigator.clipboard.writeText(CHAVE_PIX)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 3000)
  }

  return (
    <div style={{
      background: '#fffbeb',
      border: '1.5px solid #fde68a',
      borderRadius: 16,
      padding: '24px 28px',
      maxWidth: 420,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>🐝</div>

      <h3 style={{
        fontSize: 17,
        fontWeight: 700,
        color: '#92400e',
        margin: '0 0 10px',
      }}>
        Apoie o MeliGenética
      </h3>

      <p style={{
        fontSize: 14,
        color: '#78716c',
        lineHeight: 1.6,
        margin: '0 0 20px',
      }}>
        Este projeto é gratuito e desenvolvido com dedicação para ajudar
        meliponicultores a tomar decisões baseadas em ciência. Se ele
        te ajudou, considere contribuir com qualquer valor via Pix. 💛
      </p>

      {/* Chave Pix visível */}
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 10,
        padding: '10px 16px',
        marginBottom: 16,
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#92400e',
        wordBreak: 'break-all',
      }}>
        {CHAVE_PIX}
      </div>

      <button
        onClick={copiar}
        style={{
          background: copiado ? '#16a34a' : '#f59e0b',
          color: copiado ? 'white' : 'black',
          border: 'none',
          borderRadius: 12,
          padding: '12px 28px',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          width: '100%',
        }}
      >
        {copiado ? '✅ Chave copiada!' : '💛 Copiar chave Pix'}
      </button>

      <p style={{
        fontSize: 12,
        color: '#a8a29e',
        marginTop: 12,
        marginBottom: 0,
      }}>
        Qualquer valor é bem-vindo e muito apreciado 🙏
      </p>
    </div>
  )
}