// Motor de scoring fenotípico
// Ref.: Souza et al. (2018), Nunes-Silva et al. (2016)

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CheckIn {
  id: string
  data: string
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
  notas: string
}

export interface Colmeia {
  id: string
  nome: string
  especie: string
  producaoAnual: number
  anoProducao: number
  historico: CheckIn[]
}

// ─── Constantes ───────────────────────────────────────────────────────────────
export const PESOS = {
  producao:  0.30,
  populacao: 0.20,
  mansidao:  0.15,
  sanidade:  0.20,
  atividade: 0.15,
}

export const ESPECIES = [
  { id: 'jatai',      nome: 'Jataí',       sci: 'Tetragonisca angustula' },
  { id: 'mandacaia',  nome: 'Mandaçaia',   sci: 'Melipona quadrifasciata' },
  { id: 'urucu',      nome: 'Uruçu',       sci: 'Melipona scutellaris' },
  { id: 'tubi',       nome: 'Mirim',       sci: 'Plebeia spp.' },
  { id: 'boroi',      nome: 'Boroi',       sci: 'Melipona fasciculata' },
  { id: 'tiuba',      nome: 'Tiúba',       sci: 'Melipona compressipes' },
  { id: 'manduri',    nome: 'Manduri',     sci: 'Melipona marginata' },
  { id: 'irai',       nome: 'Iraí',        sci: 'Nannotrigona testaceicornis' },
  { id: 'bugia',      nome: 'Bugia',       sci: 'Melipona bicolor' },
  { id: 'mandaguari', nome: 'Mandaguari',  sci: 'Scaptotrigona postica' },
  { id: 'tubuna',     nome: 'Tubuna',      sci: 'Scaptotrigona bipunctata' },
  { id: 'outra',      nome: 'Outra',       sci: '' },
]

// ─── Funções de scoring ───────────────────────────────────────────────────────
export function norm(v: number, mn: number, mx: number) {
  return Math.min(1, Math.max(0, (v - mn) / (mx - mn)))
}

export function calcScore(p: {
  producao: number
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
}): number {
  const s =
    norm(p.producao,  0, 5)  * PESOS.producao  +
    norm(p.populacao, 0, 10) * PESOS.populacao  +
    norm(p.mansidao,  0, 5)  * PESOS.mansidao   +
    norm(p.sanidade,  0, 5)  * PESOS.sanidade   +
    norm(p.atividade, 0, 5)  * PESOS.atividade
  return Math.round(s * 1000) / 10
}

export function scoreColor(s: number) {
  if (s >= 70) return '#34C759'
  if (s >= 45) return '#FF9F0A'
  return '#FF3B30'
}

export function scoreLabel(s: number) {
  if (s >= 70) return 'Elite'
  if (s >= 45) return 'Regular'
  return 'Crítico'
}

export function lastSnap(c: Colmeia): CheckIn | null {
  return c.historico.length ? c.historico[c.historico.length - 1] : null
}

export function currentScore(c: Colmeia): number {
  const u = lastSnap(c)
  if (!u) return 0
  return calcScore({ ...u, producao: c.producaoAnual })
}

export function canSplit(c: Colmeia): boolean {
  const u = lastSnap(c)
  if (!u) return false
  return u.populacao >= 6 && u.sanidade >= 3 && currentScore(c) >= 60
}

export function trend(c: Colmeia): 'up' | 'down' | 'stable' {
  if (c.historico.length < 2) return 'stable'
  const h = c.historico
  const d =
    calcScore({ ...h[h.length - 1], producao: c.producaoAnual }) -
    calcScore({ ...h[h.length - 2], producao: c.producaoAnual })
  return d > 3 ? 'up' : d < -3 ? 'down' : 'stable'
}

// ─── Sample data ──────────────────────────────────────────────────────────────
function fakeHist(base: Record<string, number>, weeks: number): CheckIn[] {
  return Array.from({ length: weeks }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (weeks - 1 - i) * 7)
    const j = (k: string, mx: number) =>
      parseFloat(Math.min(mx, Math.max(0, base[k] + (Math.random() - 0.5) * 1.2)).toFixed(1))
    return {
      id: `${i}`,
      data: d.toISOString().split('T')[0],
      populacao: j('populacao', 10),
      mansidao:  j('mansidao',  5),
      sanidade:  j('sanidade',  5),
      atividade: j('atividade', 5),
      notas: '',
    }
  })
}

export const SAMPLE_DATA: Colmeia[] = [
  { id:'1', nome:'Rainha Aurora', especie:'mandacaia', producaoAnual:3.8, anoProducao:2025, historico: fakeHist({populacao:8,mansidao:5,sanidade:5,atividade:5}, 8) },
  { id:'2', nome:'Colmeia Beta',  especie:'jatai',     producaoAnual:1.4, anoProducao:2025, historico: fakeHist({populacao:7,mansidao:4,sanidade:4,atividade:4}, 8) },
  { id:'3', nome:'Ninho Gama',    especie:'urucu',     producaoAnual:4.2, anoProducao:2025, historico: fakeHist({populacao:9,mansidao:3,sanidade:5,atividade:5}, 8) },
  { id:'4', nome:'Colmeia Delta', especie:'mandacaia', producaoAnual:0.8, anoProducao:2025, historico: fakeHist({populacao:4,mansidao:5,sanidade:2,atividade:2}, 8) },
]
