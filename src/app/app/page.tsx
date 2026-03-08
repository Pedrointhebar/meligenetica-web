'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import {
  Colmeia, CheckIn, ESPECIES,
  currentScore, lastSnap, canSplit, trend, scoreColor, scoreLabel, calcScore,
} from '@/lib/scoring'
import PixButton from '@/components/PixButton'
import AlertaCheckin from '@/components/AlertaCheckin'
import GraficoEvolucao from '@/components/GraficoEvolucao'
import ExportarPDF from '@/components/ExportarPDF'

// ─── Hook de dados ─────────────────────────────────────────────────────────────
function useColmeias(userId: string | undefined) {
  const [colmeias, setColmeias] = useState<Colmeia[]>([])
  const [loaded, setLoaded] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (!userId) return
    setLoaded(false)
    fetch('/api/colmeias')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setColmeias(Array.isArray(data) ? data : []); setLoaded(true) })
      .catch(() => { setColmeias([]); setLoaded(true) })
  }, [userId])

  const syncColmeia = useCallback(async (colmeia: Colmeia) => {
    setSyncing(true)
    await fetch('/api/colmeias', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert_colmeia', colmeia }),
    })
    for (const checkin of colmeia.historico) {
      await fetch('/api/colmeias', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upsert_checkin', colmeiaId: colmeia.id, checkin }),
      })
    }
    setSyncing(false)
  }, [])

  const syncCheckin = useCallback(async (colmeiaId: string, checkin: CheckIn) => {
    await fetch('/api/colmeias', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert_checkin', colmeiaId, checkin }),
    })
  }, [])

  const syncDelete = useCallback(async (colmeiaId: string) => {
    await fetch('/api/colmeias', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_colmeia', colmeiaId }),
    })
  }, [])

  return { colmeias, setColmeias, loaded, syncing, syncColmeia, syncCheckin, syncDelete }
}

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: 'var(--bg)', surface: '#FFFFFF', border: 'var(--border)', amber: 'var(--amber)',
  text: 'var(--text)', text2: 'var(--text2)', text3: 'var(--text3)',
  green: 'var(--green)', red: 'var(--red)', orange: 'var(--orange)',
}

// ─── Componentes UI ────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 72 }: { score: number; size?: number }) {
  const r = size / 2 - 5, circ = 2 * Math.PI * r, offset = circ * (1 - score / 100), col = scoreColor(score)
  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeOpacity={0.2} strokeWidth={4}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={4}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className="score-ring-fill"/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: size * 0.24, fontWeight: 800, color: col, letterSpacing: '-0.5px', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.11, fontWeight: 600, color: col, marginTop: 1 }}>{scoreLabel(score)}</span>
      </div>
    </div>
  )
}

function ProgBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ height: 5, background: C.border, borderRadius: 99, overflow: 'hidden', marginTop: 6 }}>
      <div className="prog-fill" style={{ height: '100%', width: `${(value / max) * 100}%`, background: color, borderRadius: 99 }}/>
    </div>
  )
}

function TrendBadge({ t }: { t: 'up' | 'down' | 'stable' }) {
  const icon = t === 'up' ? '↑' : t === 'down' ? '↓' : '→'
  const color = t === 'up' ? C.green : t === 'down' ? C.red : C.text3
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, borderRadius: 99, padding: '2px 8px' }}>
      {icon} {t === 'up' ? 'Subindo' : t === 'down' ? 'Caindo' : 'Estável'}
    </span>
  )
}

function Chip({ label }: { label: string }) {
  return <span style={{ fontSize: 11, fontWeight: 500, color: C.text3, background: C.bg, borderRadius: 5, padding: '2px 7px' }}>{label}</span>
}

function SectionHdr({ title }: { title: string }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 1, padding: '20px 0 8px' }}>{title}</div>
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: C.surface, borderRadius: 14, border: `1px solid ${C.border}`, overflow: 'hidden', ...style }}>{children}</div>
}

// ─── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ title, sub, onClose, children }: { title: string; sub?: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: '100%', maxWidth: 520, background: C.surface, borderRadius: '16px 16px 0 0', maxHeight: '92vh', overflowY: 'auto', padding: '0 0 32px', animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)' }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{ width: 36, height: 5, background: C.border, borderRadius: 99, margin: '12px auto 0' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 4px' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.4px' }}>{title}</div>
            {sub && <div style={{ fontSize: 13, color: C.text3, marginTop: 2 }}>{sub}</div>}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', background: C.bg, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: C.text2 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1px solid ${C.border}`, fontSize: 15 }}>
      <span style={{ color: C.text2 }}>{label}</span>
      {children}
    </div>
  )
}

function SliderField({ label, value, onChange, min, max, hint, color }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; hint?: string; color?: string
}) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 15, color: C.text2 }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: color || C.amber }}>{value}</span>
      </div>
      <input type="range" min={min} max={max} step={0.1} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color || C.amber }}/>
      {hint && <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>{hint}</div>}
    </div>
  )
}

// ─── Modal Check-in ─────────────────────────────────────────────────────────────
function ModalCheckin({ colmeia, onSave, onClose }: { colmeia: Colmeia; onSave: (c: CheckIn) => void; onClose: () => void }) {
  const ult = lastSnap(colmeia)
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [pop, setPop] = useState(ult?.populacao ?? 5)
  const [man, setMan] = useState(ult?.mansidao ?? 3)
  const [san, setSan] = useState(ult?.sanidade ?? 3)
  const [atv, setAtv] = useState(ult?.atividade ?? 3)
  const [notas, setNotas] = useState('')
  const novoScore = calcScore({ producao: colmeia.producaoAnual, populacao: pop, mansidao: man, sanidade: san, atividade: atv }, colmeia.especie)
  const delta = ult ? (novoScore - calcScore({ producao: colmeia.producaoAnual, ...ult }, colmeia.especie)).toFixed(1) : null
  return (
    <Modal title="Check-in Semanal" sub={colmeia.nome} onClose={onClose}>
      <div style={{ display: 'flex', gap: 20, padding: '12px 20px 16px', alignItems: 'center' }}>
        <ScoreRing score={novoScore} size={76}/>
        <div>
          <div style={{ fontSize: 12, color: C.text3 }}>Produção anual fixada</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>🍯 {colmeia.producaoAnual} kg / {colmeia.anoProducao}</div>
          {delta !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <span style={{ fontSize: 12, color: C.text3 }}>Δ vs. anterior</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: parseFloat(delta) > 0 ? C.green : parseFloat(delta) < 0 ? C.red : C.text3 }}>
                {parseFloat(delta) > 0 ? '+' : ''}{delta}
              </span>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: C.bg, borderRadius: 12, margin: '0 16px 16px' }}>
        <FormField label="Data da inspeção">
          <input type="date" value={data} onChange={e => setData(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.amber, cursor: 'pointer' }}/>
        </FormField>
      </div>
      <div style={{ background: C.bg, borderRadius: 12, margin: '0 16px 16px' }}>
        <SliderField label="Força populacional" value={pop} onChange={setPop} min={0} max={10} hint="Frames cobertos (0–10)" color={C.green}/>
        <SliderField label="Mansidão" value={man} onChange={setMan} min={0} max={5} hint="0 = defensiva · 5 = completamente mansa" color="#007AFF"/>
        <SliderField label="Sanidade geral" value={san} onChange={setSan} min={0} max={5} hint="0 = parasitada/doente · 5 = saudável" color={C.red}/>
        <SliderField label="Atividade de voo" value={atv} onChange={setAtv} min={0} max={5} hint="Forrageamento observado" color={C.orange}/>
      </div>
      <div style={{ margin: '0 16px 20px' }}>
        <div style={{ background: C.bg, borderRadius: 12, padding: '12px 16px' }}>
          <textarea value={notas} onChange={e => setNotas(e.target.value)}
            placeholder="Observações: enxameamento, parasitas, florada..."
            rows={3}
            style={{ width: '100%', border: 'none', background: 'transparent', fontSize: 15, resize: 'none', outline: 'none', fontFamily: 'inherit', color: C.text }}/>
        </div>
      </div>
      <button onClick={() => onSave({ id: crypto.randomUUID(), data, populacao: pop, mansidao: man, sanidade: san, atividade: atv, notas })}
        style={{ display: 'block', width: 'calc(100% - 32px)', margin: '0 16px', background: C.amber, color: 'white', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        Salvar Check-in
      </button>
    </Modal>
  )
}

// ─── Modal Colheita ─────────────────────────────────────────────────────────────
function ModalColheita({ colmeia, onSave, onClose }: { colmeia: Colmeia; onSave: (kg: number, ano: number) => void; onClose: () => void }) {
  const [kg, setKg] = useState(colmeia.producaoAnual)
  const [ano, setAno] = useState(colmeia.anoProducao)
  return (
    <Modal title="Registro de Colheita" sub={colmeia.nome} onClose={onClose}>
      <div style={{ background: C.bg, borderRadius: 12, margin: '16px' }}>
        <FormField label="Total colhido (kg)">
          <input type="number" min={0} step={0.1} value={kg} onChange={e => setKg(parseFloat(e.target.value) || 0)}
            style={{ border: 'none', background: 'transparent', fontSize: 17, fontWeight: 700, color: C.amber, width: 80, textAlign: 'right', outline: 'none' }}/>
        </FormField>
        <FormField label="Ano de referência">
          <select value={ano} onChange={e => setAno(parseInt(e.target.value))}
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.amber, cursor: 'pointer' }}>
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{ margin: '0 16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.text3, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Referência — Meliponini</div>
        <Card>
          {[['< 0,5 kg', 'Baixa'], ['0,5–1,5 kg', 'Regular'], ['1,5–3,0 kg', 'Boa'], ['> 3,0 kg', 'Excelente']].map(([r, l]) => (
            <div key={r} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: `1px solid ${C.border}`, fontSize: 14 }}>
              <span style={{ fontFamily: 'monospace', color: C.amber }}>{r}</span>
              <span style={{ color: C.text2 }}>{l}</span>
            </div>
          ))}
        </Card>
      </div>
      <button onClick={() => onSave(kg, ano)}
        style={{ display: 'block', width: 'calc(100% - 32px)', margin: '0 16px', background: C.amber, color: 'white', border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        Salvar Colheita
      </button>
    </Modal>
  )
}

// ─── Modal Nova Colmeia ─────────────────────────────────────────────────────────
function ModalNovaColmeia({ onSave, onClose }: { onSave: (c: Colmeia) => void; onClose: () => void }) {
  const [nome, setNome] = useState('')
  const [especie, setEspecie] = useState('jatai')
  const [prod, setProd] = useState(1.5)
  const [ano, setAno] = useState(new Date().getFullYear())
  const [pop, setPop] = useState(5)
  const [man, setMan] = useState(3)
  const [san, setSan] = useState(3)
  const [atv, setAtv] = useState(3)
  return (
    <Modal title="Nova Colmeia" onClose={onClose}>
      <div style={{ background: C.bg, borderRadius: 12, margin: '16px 16px 12px' }}>
        <FormField label="Nome / ID">
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="ex: Rainha Alfa"
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.text, textAlign: 'right', outline: 'none', flex: 1 }}/>
        </FormField>
        <FormField label="Espécie">
          <select value={especie} onChange={e => setEspecie(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.amber, cursor: 'pointer' }}>
            {ESPECIES.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </FormField>
        <FormField label="Produção anual (kg)">
          <input type="number" min={0} step={0.1} value={prod} onChange={e => setProd(parseFloat(e.target.value) || 0)}
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.amber, textAlign: 'right', width: 70, outline: 'none' }}/>
        </FormField>
        <FormField label="Ano da colheita">
          <select value={ano} onChange={e => setAno(parseInt(e.target.value))}
            style={{ border: 'none', background: 'transparent', fontSize: 15, color: C.amber, cursor: 'pointer' }}>
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </FormField>
      </div>
      <div style={{ background: C.bg, borderRadius: 12, margin: '0 16px 16px' }}>
        <SliderField label="Força populacional" value={pop} onChange={setPop} min={0} max={10} color={C.green}/>
        <SliderField label="Mansidão" value={man} onChange={setMan} min={0} max={5} color="#007AFF"/>
        <SliderField label="Sanidade geral" value={san} onChange={setSan} min={0} max={5} color={C.red}/>
        <SliderField label="Atividade de voo" value={atv} onChange={setAtv} min={0} max={5} color={C.orange}/>
      </div>
      <button disabled={!nome.trim()}
        onClick={() => onSave({
          id: crypto.randomUUID(), nome: nome.trim(), especie,
          producaoAnual: prod, anoProducao: ano,
          historico: [{ id: crypto.randomUUID(), data: new Date().toISOString().split('T')[0], populacao: pop, mansidao: man, sanidade: san, atividade: atv, notas: '' }],
        })}
        style={{ display: 'block', width: 'calc(100% - 32px)', margin: '0 16px', background: nome.trim() ? C.amber : C.border, color: nome.trim() ? 'white' : C.text3, border: 'none', borderRadius: 12, padding: '15px', fontSize: 16, fontWeight: 700, cursor: nome.trim() ? 'pointer' : 'default' }}>
        Adicionar Colmeia
      </button>
    </Modal>
  )
}

// ─── Detalhe da Colmeia ─────────────────────────────────────────────────────────
function DetalheView({ c, onBack, onCheckin, onColheita, onDelete }: {
  c: Colmeia; onBack: () => void; onCheckin: () => void; onColheita: () => void; onDelete: () => void
}) {
  const [tab, setTab] = useState<'overview' | 'historico'>('overview')
  const s = currentScore(c), snap = lastSnap(c), t = trend(c), div = canSplit(c)
  const esp = ESPECIES.find(e => e.id === c.especie)
  const chartData = c.historico.map(h => ({
    sem: new Date(h.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    score: calcScore({ producao: c.producaoAnual, populacao: h.populacao, mansidao: h.mansidao, sanidade: h.sanidade, atividade: h.atividade }, c.especie),
    populacao: h.populacao, mansidao: h.mansidao, sanidade: h.sanidade, atividade: h.atividade,
  }))
  const params = snap ? [
    { label: 'Força populacional', value: snap.populacao, max: 10, color: C.green },
    { label: 'Mansidão',           value: snap.mansidao,  max: 5,  color: '#007AFF' },
    { label: 'Sanidade geral',     value: snap.sanidade,  max: 5,  color: C.red },
    { label: 'Atividade de voo',   value: snap.atividade, max: 5,  color: C.orange },
  ] : []
  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <button onClick={onBack} style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.amber, fontSize: 15, fontWeight: 600 }}>‹ Colmeias</button>
        <span style={{ fontWeight: 700 }}>{c.nome}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <ExportarPDF colmeia={c} score={s} />
          <button onClick={() => { if (confirm(`Excluir "${c.nome}"?`)) onDelete() }}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: C.red, fontSize: 14, fontWeight: 600 }}>Excluir</button>
        </div>
      </div>
      {/* Hero */}
      <div style={{ padding: 20 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text3 }}>{esp?.nome}</div>
              <div style={{ fontSize: 13, color: C.text3, fontStyle: 'italic', marginTop: 2 }}>{esp?.sci}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                <TrendBadge t={t}/>
                {div && <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: `${C.green}18`, borderRadius: 99, padding: '2px 8px' }}>✓ Apta para divisão</span>}
              </div>
              <div style={{ marginTop: 14, padding: '10px 14px', background: `${C.amber}12`, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 11, color: C.text3 }}>Produção anual ({c.anoProducao})</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: C.amber, marginTop: 2 }}>🍯 {c.producaoAnual} kg</div>
                </div>
                <button onClick={onColheita} style={{ border: 'none', background: `${C.amber}18`, borderRadius: 8, padding: '6px 12px', color: C.amber, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Atualizar</button>
              </div>
            </div>
            <ScoreRing score={s} size={88}/>
          </div>
        </Card>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button onClick={onCheckin} style={{ flex: 1, background: C.amber, color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
            + Check-in semanal
          </button>
        </div>
        {/* Segmented control */}
        <div style={{ display: 'flex', background: '#e8e0d4', borderRadius: 10, padding: 3, marginTop: 16 }}>
          {(['overview', 'historico'] as const).map(tt => (
            <button key={tt} onClick={() => setTab(tt)}
              style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, background: tab === tt ? 'white' : 'transparent', color: tab === tt ? C.text : C.text3, boxShadow: tab === tt ? '0 1px 4px rgba(0,0,0,0.12)' : 'none' }}>
              {tt === 'overview' ? 'Visão geral' : 'Histórico'}
            </button>
          ))}
        </div>
      </div>
      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ padding: '0 20px 32px' }}>
          {snap && (
            <>
              <SectionHdr title="Parâmetros do último check-in"/>
              <Card>
                {params.map((p, i) => (
                  <div key={p.label} style={{ padding: '12px 16px', borderBottom: i < params.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span style={{ color: C.text2 }}>{p.label}</span>
                      <span style={{ fontWeight: 700, color: p.color }}>{p.value}</span>
                    </div>
                    <ProgBar value={p.value} max={p.max} color={p.color}/>
                  </div>
                ))}
              </Card>
            </>
          )}
          {chartData.length >= 2 && (
            <>
              <SectionHdr title="Evolução do score genético"/>
              <Card style={{ padding: '14px 8px 8px' }}>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={chartData} margin={{ top: 4, right: 12, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="ambar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.amber} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={C.amber} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="sem" tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: C.text3 }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}/>
                    <Area type="monotone" dataKey="score" stroke={C.amber} strokeWidth={2.5} fill="url(#ambar)" dot={{ fill: C.amber, r: 3 }} name="Score"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </>
          )}
          <SectionHdr title="Diagnóstico"/>
          <div style={{ padding: 14, background: `${C.amber}10`, borderRadius: 12, border: `1px solid ${C.amber}30`, fontSize: 14, lineHeight: 1.6, color: C.text2 }}>
            🧬 {s >= 70
              ? `Genótipo elite. ${div ? 'Recomenda-se divisão controlada para propagação do material genético.' : 'Aguardar fortalecimento populacional antes de dividir.'}`
              : s >= 45
              ? 'Fenótipo intermediário. Separe variações sazonais de estresse biótico/abiótico correlacionando com fenologia floral local.'
              : 'Fenótipo crítico. Correlacione quedas com infestações de Phoridae, déficit floral e pesticidas vizinhos no histórico longitudinal.'}
          </div>
          <GraficoEvolucao
            nome={c.nome}
            historico={c.historico}
            producaoAnual={c.producaoAnual}
            especie={c.especie}
          />
        </div>
      )}
      {/* Histórico */}
      {tab === 'historico' && (
        <div style={{ padding: '0 20px 32px' }}>
          <SectionHdr title={`${c.historico.length} check-ins registrados`}/>
          {c.historico.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px 0', color: C.text3 }}>Nenhum check-in registrado.</div>
            : <Card>
                {[...c.historico].reverse().map((h, i, arr) => {
                  const hs = calcScore({ producao: c.producaoAnual, populacao: h.populacao, mansidao: h.mansidao, sanidade: h.sanidade, atividade: h.atividade }, c.especie)
                  return (
                    <div key={h.id} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ width: 64, flexShrink: 0, fontSize: 12, color: C.text3, paddingTop: 2 }}>
                        {new Date(h.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20, fontWeight: 800, color: scoreColor(hs) }}>{hs}</span>
                          <span style={{ fontSize: 12, color: C.text3 }}>/100</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                          <Chip label={`pop ${h.populacao}`}/>
                          <Chip label={`man ${h.mansidao}`}/>
                          <Chip label={`san ${h.sanidade}`}/>
                          <Chip label={`atv ${h.atividade}`}/>
                        </div>
                        {h.notas && <div style={{ fontSize: 12, color: C.text3, fontStyle: 'italic', marginTop: 4 }}>{h.notas}</div>}
                      </div>
                    </div>
                  )
                })}
              </Card>
          }
        </div>
      )}
    </div>
  )
}

// ─── App Principal ──────────────────────────────────────────────────────────────
export default function AppPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => { if (status === 'unauthenticated') router.push('/login') }, [status, router])

  const userId = (session?.user as any)?.id as string | undefined
  const { colmeias, setColmeias, loaded, syncing, syncColmeia, syncCheckin, syncDelete } = useColmeias(userId)

  const [tab, setTab] = useState<'painel' | 'ranking' | 'colmeias'>('colmeias')
  const [detalhe, setDetalhe] = useState<Colmeia | null>(null)
  const [modalCheckin, setModalCheckin] = useState<Colmeia | null>(null)
  const [modalColheita, setModalColheita] = useState<Colmeia | null>(null)
  const [modalNova, setModalNova] = useState(false)

  const scoreMedia = useMemo(() => !colmeias.length ? 0 : Math.round(colmeias.reduce((a, c) => a + currentScore(c), 0) / colmeias.length * 10) / 10, [colmeias])
  const ranking = useMemo(() => [...colmeias].sort((a, b) => currentScore(b) - currentScore(a)), [colmeias])

  const saveCheckin = async (colmeiaId: string, snap: CheckIn) => {
    const updated = colmeias.map(c => {
      if (c.id !== colmeiaId) return c
      const hist = c.historico.filter(h => h.data !== snap.data)
      return { ...c, historico: [...hist, snap].sort((a, b) => a.data.localeCompare(b.data)) }
    })
    setColmeias(updated)
    if (detalhe?.id === colmeiaId) setDetalhe(updated.find(x => x.id === colmeiaId)!)
    await syncCheckin(colmeiaId, snap)
  }

  const saveColheita = async (colmeiaId: string, kg: number, ano: number) => {
    const updated = colmeias.map(c => c.id !== colmeiaId ? c : { ...c, producaoAnual: kg, anoProducao: ano })
    setColmeias(updated)
    if (detalhe?.id === colmeiaId) setDetalhe(prev => prev ? { ...prev, producaoAnual: kg, anoProducao: ano } : null)
    await syncColmeia(updated.find(c => c.id === colmeiaId)!)
  }

  const addColmeia = async (c: Colmeia) => { setColmeias([...colmeias, c]); setModalNova(false); await syncColmeia(c) }
  const deleteColmeia = async (id: string) => { setColmeias(colmeias.filter(c => c.id !== id)); setDetalhe(null); await syncDelete(id) }

  if (status === 'loading' || (status === 'authenticated' && !loaded)) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🐝</div>
        <div style={{ color: C.text3, fontSize: 14 }}>Carregando seu meliponário...</div>
      </div>
    </div>
  )
  if (status === 'unauthenticated') return null

  const hoje = new Date(), lim = new Date(hoje)
  lim.setDate(hoje.getDate() - 7)
  const pendentes = colmeias.filter(c => { const u = lastSnap(c); return !u || new Date(u.data) < lim })
  const maxSem = Math.max(...colmeias.map(c => c.historico.length), 0)
  const meliHist = maxSem >= 2 ? Array.from({ length: Math.min(8, maxSem) }, (_, i) => {
    const n = Math.min(8, maxSem)
    const vals = colmeias.flatMap(c => { const idx = c.historico.length - n + i; return idx < 0 ? [] : [calcScore({ producao: c.producaoAnual, ...c.historico[idx] }, c.especie)] })
    const ref = colmeias.find(c => c.historico.length >= n - i)
    const h = ref?.historico[ref.historico.length - n + i]
    return { sem: h ? new Date(h.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : `S${i+1}`, score: vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length * 10) / 10 : 0 }
  }) : []

  return (
    <div style={{ background: C.bg, minHeight: '100vh', maxWidth: 520, margin: '0 auto', position: 'relative' }}>

      {/* ── Navbar ── */}
      <div style={{ background: 'rgba(247,243,238,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 40, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.3px', color: C.amber }}>⬡ MeliGenética</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {syncing && <span style={{ fontSize: 11, color: C.text3 }}>💾 salvando...</span>}

          <Link
            href="/app/comparar"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#fef3c7', color: '#92400e',
              border: '1px solid #fde68a', borderRadius: 10,
              padding: '8px 16px', fontSize: 14, fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            📊 Comparar
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: C.bg, borderRadius: 99, padding: '4px 10px 4px 6px', border: `1px solid ${C.border}`, cursor: 'pointer' }}
            onClick={() => signOut({ callbackUrl: '/login' })} title="Sair">
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${C.amber}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.amber }}>
              {session?.user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <span style={{ fontSize: 12, color: C.text2, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session?.user?.name?.split(' ')[0]}
            </span>
            <span style={{ fontSize: 11, color: C.text3 }}>Sair</span>
          </div>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div style={{ paddingBottom: 80, minHeight: 'calc(100vh - 52px - 65px)' }}>
        <AlertaCheckin
          colmeias={colmeias.map(c => ({
            nome: c.nome,
            ultimoCheckin: c.historico?.length > 0
              ? c.historico[c.historico.length - 1].data
              : null
          }))}
        />
        {detalhe ? (
          <DetalheView
            c={colmeias.find(x => x.id === detalhe.id) || detalhe}
            onBack={() => setDetalhe(null)}
            onCheckin={() => setModalCheckin(detalhe)}
            onColheita={() => setModalColheita(detalhe)}
            onDelete={() => deleteColmeia(detalhe.id)}
          />
        ) : (
          <>
            {/* ── Painel ── */}
            {tab === 'painel' && (
              <div style={{ padding: 16 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, fontFamily: 'Georgia, serif' }}>
                  Meli<span style={{ color: C.amber }}>Genética</span>
                </h1>
                {pendentes.length > 0 && (
                  <div style={{ background: `${C.orange}15`, border: `1px solid ${C.orange}40`, borderRadius: 12, padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 20 }}>⏰</span>
                    <div style={{ flex: 1, fontSize: 14, color: C.text2 }}>
                      <strong>{pendentes.length} colmeia{pendentes.length > 1 ? 's' : ''}</strong> sem check-in há +7 dias
                    </div>
                    <button onClick={() => setModalCheckin(pendentes[0])} style={{ background: C.orange, color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Registrar</button>
                  </div>
                )}
                <SectionHdr title="Meliponário"/>
                <Card style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <ScoreRing score={scoreMedia} size={88}/>
                    <div>
                      <div style={{ fontSize: 13, color: C.text3 }}>Score médio do plantel</div>
                      <div style={{ fontSize: 14, color: C.text2, marginTop: 4 }}>{colmeias.length} colmeia{colmeias.length !== 1 ? 's' : ''}</div>
                      <div style={{ fontSize: 13, color: C.text2, marginTop: 4 }}>{colmeias.filter(c => canSplit(c)).length} apta{colmeias.filter(c => canSplit(c)).length !== 1 ? 's' : ''} para divisão</div>
                    </div>
                  </div>
                  {meliHist.length >= 2 && (
                    <div style={{ marginTop: 16 }}>
                      <ResponsiveContainer width="100%" height={100}>
                        <AreaChart data={meliHist} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                          <defs>
                            <linearGradient id="ambar2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={C.amber} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={C.amber} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="sem" tick={{ fontSize: 9, fill: C.text3 }} axisLine={false} tickLine={false}/>
                          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: C.text3 }} axisLine={false} tickLine={false}/>
                          <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }}/>
                          <Area type="monotone" dataKey="score" stroke={C.amber} strokeWidth={2} fill="url(#ambar2)" dot={false} name="Score médio"/>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
                <SectionHdr title="Top colmeias"/>
                <Card>
                  {ranking.slice(0, 3).map((c, i) => {
                    const s = currentScore(c)
                    return (
                      <div key={c.id} className="card-hover" onClick={() => setDetalhe(c)}
                        style={{ display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer', alignItems: 'center', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                        <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600 }}>{c.nome}</div>
                          <div style={{ fontSize: 12, color: C.text3, fontStyle: 'italic' }}>{ESPECIES.find(e => e.id === c.especie)?.sci}</div>
                        </div>
                        <ScoreRing score={s} size={44}/>
                      </div>
                    )
                  })}
                </Card>
              </div>
            )}

            {/* ── Ranking ── */}
            {tab === 'ranking' && (
              <div style={{ padding: 16 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 16, fontFamily: 'Georgia, serif' }}>Ranking</h1>
                <div style={{ fontSize: 12, color: C.text3, marginBottom: 12, background: `${C.amber}10`, borderRadius: 10, padding: '8px 12px' }}>
                  Produção 30% · Sanidade 20% · Pop. 20% · Atividade 15% · Mansidão 15%
                </div>
                <Card>
                  {ranking.map((c, i, arr) => {
                    const s = currentScore(c), t = trend(c), div = canSplit(c)
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null
                    return (
                      <div key={c.id} className="card-hover" onClick={() => setDetalhe(c)}
                        style={{ display: 'flex', gap: 12, padding: '14px 16px', cursor: 'pointer', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
                        <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                          {medal ? <span style={{ fontSize: 22 }}>{medal}</span> : <span style={{ fontWeight: 700, color: C.text3 }}>{i + 1}</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 16 }}>{c.nome}</div>
                          <div style={{ fontSize: 12, color: C.text3, fontStyle: 'italic', marginTop: 1 }}>{ESPECIES.find(e => e.id === c.especie)?.sci}</div>
                          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 6 }}>
                            {div && <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: `${C.green}18`, borderRadius: 99, padding: '2px 8px' }}>✓ Dividir</span>}
                            <TrendBadge t={t}/>
                            <span style={{ fontSize: 11, color: C.text3, background: C.bg, borderRadius: 99, padding: '2px 8px' }}>🍯 {c.producaoAnual}kg</span>
                          </div>
                        </div>
                        <ScoreRing score={s} size={52}/>
                        <span style={{ color: C.text3, fontSize: 18 }}>›</span>
                      </div>
                    )
                  })}
                </Card>
              </div>
            )}

            {/* ── Colmeias ── */}
            {tab === 'colmeias' && (
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.5px', fontFamily: 'Georgia, serif' }}>Colmeias</h1>
                  <button onClick={() => setModalNova(true)} style={{ background: C.amber, color: 'white', border: 'none', borderRadius: 10, padding: '8px 18px', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                    + Nova
                  </button>
                </div>
                {colmeias.length === 0
                  ? <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <div style={{ fontSize: 52, marginBottom: 12 }}>🐝</div>
                      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>Nenhuma colmeia</div>
                      <div style={{ color: C.text3 }}>Toque em "+ Nova" para cadastrar</div>
                    </div>
                  : <Card>
                      {colmeias.map((c, i, arr) => {
                        const s = currentScore(c), t = trend(c)
                        return (
                          <div key={c.id} className="card-hover" onClick={() => setDetalhe(c)}
                            style={{ display: 'flex', gap: 12, padding: '12px 16px', cursor: 'pointer', alignItems: 'center', borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                            <div style={{ width: 42, height: 42, borderRadius: 10, flexShrink: 0, background: `${scoreColor(s)}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🐝</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 600, fontSize: 16 }}>{c.nome}</div>
                              <div style={{ fontSize: 12, color: C.text3, fontStyle: 'italic' }}>{ESPECIES.find(e => e.id === c.especie)?.sci}</div>
                              <div style={{ display: 'flex', gap: 5, marginTop: 4 }}><TrendBadge t={t}/></div>
                            </div>
                            <ScoreRing score={s} size={48}/>
                            <span style={{ color: C.text3, fontSize: 18 }}>›</span>
                          </div>
                        )
                      })}
                    </Card>
                }
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Tab bar ── */}
      {!detalhe && (
        <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 520, background: 'rgba(247,243,238,0.95)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, display: 'flex', paddingBottom: 'env(safe-area-inset-bottom)', zIndex: 30 }}>
          {([
            { id: 'painel',   icon: '🏠', label: 'Início' },
            { id: 'ranking',  icon: '🏆', label: 'Ranking' },
            { id: 'colmeias', icon: '🐝', label: 'Colmeias' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', border: 'none', background: 'transparent', cursor: 'pointer' }}>
              <span style={{ fontSize: tab === t.id ? 22 : 20, filter: tab === t.id ? 'none' : 'grayscale(1) opacity(0.5)' }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: tab === t.id ? C.amber : C.text3 }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Modais ── */}
      {modalCheckin && (
        <ModalCheckin colmeia={modalCheckin}
          onSave={snap => { saveCheckin(modalCheckin.id, snap); setModalCheckin(null) }}
          onClose={() => setModalCheckin(null)}/>
      )}
      {modalColheita && (
        <ModalColheita colmeia={modalColheita}
          onSave={(kg, ano) => { saveColheita(modalColheita.id, kg, ano); setModalColheita(null) }}
          onClose={() => setModalColheita(null)}/>
      )}
      {modalNova && <ModalNovaColmeia onSave={addColmeia} onClose={() => setModalNova(false)}/>}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '48px 24px 32px',
        borderTop: '1px solid #e5e7eb',
        marginTop: 48,
      }}>
        <PixButton />
      </div>
    </div>
  )
}
