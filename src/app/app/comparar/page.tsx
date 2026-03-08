'use client'

import { useState, useEffect } from 'react'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip
} from 'recharts'
import Link from 'next/link'
import { calcScore } from '@/lib/scoring'

const CORES = ['#f59e0b', '#10b981', '#6366f1', '#ef4444']

type Colmeia = {
  id: string
  nome: string
  especie: string
  score: number
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
  producaoAnual: number
}

const PARAMETROS = [
  { key: 'populacao', label: 'População'      },
  { key: 'mansidao',  label: 'Mansidão'       },
  { key: 'sanidade',  label: 'Sanidade'       },
  { key: 'atividade', label: 'Ativ. de Voo'   },
  { key: 'score',     label: 'Score Total'    },
]

export default function CompararPage() {
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [selecionadas, setSelecionadas] = useState<string[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    fetch('/api/colmeias')
      .then(r => r.json())
      .then(data => {
        // Pegar último check-in de cada colmeia para montar os dados
        const processadas = (data || []).map((c: any) => {
          const ultimo = c.historico?.[c.historico.length - 1]
          return {
            id: c.id,
            nome: c.nome,
            especie: c.especie,
            score: ultimo ? Number(calcScore({ producao: c.producaoAnual, populacao: ultimo.populacao, mansidao: ultimo.mansidao, sanidade: ultimo.sanidade, atividade: ultimo.atividade }, c.especie).toFixed(1)) : 0,
            populacao: ultimo?.populacao ?? 0,
            mansidao: ultimo?.mansidao ?? 0,
            sanidade: ultimo?.sanidade ?? 0,
            atividade: ultimo?.atividade ?? 0,
            producaoAnual: c.producaoAnual ?? 0,
          }
        })
        setColmeias(processadas)
        setCarregando(false)
      })
  }, [])

  const toggleColmeia = (id: string) => {
    setSelecionadas(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 4 ? [...prev, id] : prev
    )
  }

  const dadosSelecionados = colmeias.filter(c => selecionadas.includes(c.id))

  const dadosRadar = PARAMETROS.map(p => {
    const entry: any = { parametro: p.label }
    dadosSelecionados.forEach(c => { entry[c.nome] = c[p.key as keyof Colmeia] })
    return entry
  })

  const melhor = dadosSelecionados.length >= 2
    ? dadosSelecionados.reduce((a, b) => a.score > b.score ? a : b)
    : null

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Link href="/app" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none' }}>
          ← Voltar ao app
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.5px', margin: '8px 0 4px' }}>
          Comparar Colmeias
        </h1>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Selecione de 2 a 4 colmeias para comparar o perfil fenotípico
        </p>
      </div>

      {/* Seletor */}
      {carregando ? (
        <p style={{ color: '#9ca3af' }}>Carregando colmeias...</p>
      ) : colmeias.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>Nenhuma colmeia encontrada. Cadastre colmeias primeiro.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {colmeias.map(c => {
            const idx = selecionadas.indexOf(c.id)
            const ativa = idx !== -1
            return (
              <button
                key={c.id}
                onClick={() => toggleColmeia(c.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 999,
                  border: `2px solid ${ativa ? CORES[idx] : '#e5e7eb'}`,
                  background: ativa ? CORES[idx] : 'white',
                  color: ativa ? 'white' : '#374151',
                  fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                {c.nome}
              </button>
            )
          })}
        </div>
      )}

      {selecionadas.length < 2 && !carregando && colmeias.length >= 2 && (
        <div style={{
          textAlign: 'center', padding: '48px 24px',
          color: '#9ca3af', fontSize: 14,
        }}>
          🐝 Selecione pelo menos 2 colmeias para ver a comparação
        </div>
      )}

      {dadosSelecionados.length >= 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Gráfico Radar */}
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid #e5e7eb', padding: '20px 16px',
          }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1f2937', margin: '0 0 20px' }}>
              Perfil Fenotípico Comparativo
            </h2>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={dadosRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="parametro" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fontSize: 10 }} />
                {dadosSelecionados.map((c, i) => (
                  <Radar
                    key={c.id}
                    name={c.nome}
                    dataKey={c.nome}
                    stroke={CORES[i]}
                    fill={CORES[i]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela comparativa */}
          <div style={{
            background: 'white', borderRadius: 16,
            border: '1px solid #e5e7eb', overflow: 'hidden',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#fffbeb' }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: '#92400e', fontWeight: 700 }}>
                    Parâmetro
                  </th>
                  {dadosSelecionados.map((c, i) => (
                    <th key={c.id} style={{ padding: '12px 16px', textAlign: 'center', color: CORES[i], fontWeight: 700 }}>
                      {c.nome}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PARAMETROS.map(p => {
                  const valores = dadosSelecionados.map(c => c[p.key as keyof Colmeia] as number)
                  const max = Math.max(...valores)
                  return (
                    <tr key={p.key} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 16px', color: '#4b5563', fontWeight: 500 }}>
                        {p.label}
                      </td>
                      {dadosSelecionados.map(c => {
                        const val = c[p.key as keyof Colmeia] as number
                        const isMelhor = val === max
                        return (
                          <td key={c.id} style={{
                            padding: '12px 16px', textAlign: 'center',
                            fontWeight: isMelhor ? 700 : 400,
                            color: isMelhor ? '#16a34a' : '#374151',
                          }}>
                            {val}{isMelhor && ' 🏆'}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Recomendação */}
          {melhor && (
            <div style={{
              background: '#f0fdf4', border: '1.5px solid #86efac',
              borderRadius: 16, padding: '20px 24px',
            }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#14532d', margin: '0 0 8px' }}>
                🧬 Recomendação genética
              </h2>
              <p style={{ fontSize: 14, color: '#166534', margin: 0, lineHeight: 1.6 }}>
                Com base nos critérios fenotípicos de Souza et al. (2018),{' '}
                <strong>{melhor.nome}</strong> apresenta o melhor desempenho geral
                (score {melhor.score}) e é o candidato mais indicado para{' '}
                <strong>propagação genética por divisão</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}