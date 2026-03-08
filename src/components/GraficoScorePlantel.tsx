'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

type Checkin = {
  data: string
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
}

type Colmeia = {
  nome: string
  especie: string
  producaoAnual: number
  historico: Checkin[]
}

type Props = {
  colmeias: Colmeia[]
  calcularScore: (c: Checkin, especie: string) => number
}

// Tooltip customizado com estilo do app
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '10px 14px',
      fontSize: 13,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <p style={{ margin: '0 0 4px', color: '#6b7280', fontWeight: 500 }}>{label}</p>
      <p style={{ margin: 0, color: '#C9861A', fontWeight: 700, fontSize: 15 }}>
        Score médio: {payload[0].value}
      </p>
    </div>
  )
}

export default function GraficoScorePlantel({ colmeias, calcularScore }: Props) {
  if (!colmeias?.length) return null

  // Coletar todas as datas únicas de check-ins
  const todasDatas = Array.from(new Set(
    colmeias.flatMap(c => c.historico.map(h => h.data))
  )).sort()

  if (todasDatas.length < 2) {
    return (
      <div style={{
        background: '#f9fafb',
        borderRadius: 12,
        padding: '32px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: 13,
      }}>
        Registre check-ins em pelo menos 2 datas diferentes para ver a evolução do plantel
      </div>
    )
  }

  // Para cada data, calcular o score médio de todas as colmeias que têm check-in naquela data
  // ou no check-in mais recente anterior àquela data
  const dados = todasDatas.map(data => {
    const scores: number[] = []

    colmeias.forEach(colmeia => {
      // Pegar o check-in mais recente até aquela data
      const checkinsAte = colmeia.historico
        .filter(h => h.data <= data)
        .sort((a, b) => b.data.localeCompare(a.data))

      if (checkinsAte.length > 0) {
        scores.push(calcularScore(checkinsAte[0], colmeia.especie))
      }
    })

    const media = scores.length > 0
      ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
      : 0

    return {
      data: new Date(data + 'T00:00:00').toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
      score: media,
      colmeiasAtivas: scores.length,
    }
  })

  // Calcular tendência (subiu ou desceu)
  const primeiro = dados[0]?.score ?? 0
  const ultimo = dados[dados.length - 1]?.score ?? 0
  const diff = Number((ultimo - primeiro).toFixed(1))
  const tendencia = diff > 0 ? '↑' : diff < 0 ? '↓' : '→'
  const corTendencia = diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#6b7280'

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      border: '1px solid #e5e7eb',
      padding: '20px 20px 12px',
      marginBottom: 24,
    }}>
      {/* Header do card */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
      }}>
        <div>
          <p style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 4px',
          }}>
            EVOLUÇÃO DO PLANTEL
          </p>
          <h2 style={{
            fontSize: 22, fontWeight: 800, color: '#1a1209', margin: 0,
          }}>
            Score médio ao longo do tempo
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontSize: 28, fontWeight: 800,
            color: corTendencia, margin: 0, lineHeight: 1,
          }}>
            {tendencia} {Math.abs(diff)}
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>
            vs. início do período
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={dados} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradienteAmbar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#C9861A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C9861A" stopOpacity={0}   />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="data"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#C9861A"
            strokeWidth={2.5}
            fill="url(#gradienteAmbar)"
            dot={{ fill: '#C9861A', r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#C9861A' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Rodapé com info */}
      <p style={{
        fontSize: 12, color: '#9ca3af',
        margin: '8px 0 0', textAlign: 'right',
      }}>
        {dados.length} registros · {colmeias.length} colmeias
      </p>
    </div>
  )
}