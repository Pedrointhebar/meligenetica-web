'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { calcScore } from '@/lib/scoring'

type Checkin = {
  data: string
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
}

type Props = {
  nome: string
  historico: Checkin[]
  producaoAnual: number
  especie: string
}

export default function GraficoEvolucao({ nome, historico, producaoAnual, especie }: Props) {
  if (historico.length < 2) {
    return (
      <div style={{
        background: '#f9fafb', borderRadius: 12,
        padding: '24px', textAlign: 'center',
        color: '#9ca3af', fontSize: 13,
      }}>
        Registre pelo menos 2 check-ins para ver o gráfico de evolução
      </div>
    )
  }

  const dados = historico
    .slice()
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map(c => ({
      data: new Date(c.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      Score: Number(calcScore({ producao: producaoAnual, populacao: c.populacao, mansidao: c.mansidao, sanidade: c.sanidade, atividade: c.atividade }, especie).toFixed(1)),
      População: c.populacao,
      Mansidão: c.mansidao,
      Sanidade: c.sanidade,
      'Ativ. de Voo': c.atividade,
    }))

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 16,
      padding: '20px 16px',
      marginTop: 16,
    }}>
      <h3 style={{
        fontSize: 15, fontWeight: 700,
        color: '#1f2937', margin: '0 0 20px',
      }}>
        📈 Evolução fenotípica — {nome}
      </h3>

      {/* Gráfico principal: Score total */}
      <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px' }}>Score total</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="data" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone" dataKey="Score"
            stroke="#f59e0b" strokeWidth={2.5}
            dot={{ fill: '#f59e0b', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Gráfico secundário: parâmetros individuais */}
      <p style={{ fontSize: 12, color: '#6b7280', margin: '20px 0 8px' }}>Parâmetros individuais</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dados}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="data" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line type="monotone" dataKey="População"    stroke="#6366f1" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="Mansidão"     stroke="#10b981" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="Sanidade"     stroke="#ef4444" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="Ativ. de Voo" stroke="#8b5cf6" strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}