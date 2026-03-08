'use client'

import { useState } from 'react'

type Props = {
  colmeias: Array<{
    nome: string
    ultimoCheckin: string | null
  }>
}

export default function AlertaCheckin({ colmeias }: Props) {
  const [fechado, setFechado] = useState(false)

  if (fechado) return null

  const hoje = new Date()
  const atrasadas = colmeias.filter(c => {
    if (!c.ultimoCheckin) return true
    const diff = (hoje.getTime() - new Date(c.ultimoCheckin).getTime()) / (1000 * 60 * 60 * 24)
    return diff > 7
  })

  if (atrasadas.length === 0) return null

  return (
    <div style={{
      background: '#fffbeb',
      border: '1.5px solid #f59e0b',
      borderRadius: 12,
      padding: '14px 18px',
      marginBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 700, color: '#92400e', fontSize: 14 }}>
          🐝 {atrasadas.length === 1
            ? `A colmeia "${atrasadas[0].nome}" está há mais de 7 dias sem check-in`
            : `${atrasadas.length} colmeias estão há mais de 7 dias sem check-in`}
        </p>
        {atrasadas.length > 1 && (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#b45309' }}>
            {atrasadas.map(c => c.nome).join(', ')}
          </p>
        )}
      </div>
      <button
        onClick={() => setFechado(true)}
        style={{
          background: 'none', border: 'none',
          cursor: 'pointer', color: '#92400e',
          fontSize: 18, lineHeight: 1, padding: 0,
          flexShrink: 0,
        }}
        aria-label="Fechar alerta"
      >
        ×
      </button>
    </div>
  )
}