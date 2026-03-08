'use client'

import { useState } from 'react'
import { calcScore } from '@/lib/scoring'

type Checkin = {
  id: string
  data: string
  populacao: number
  mansidao: number
  sanidade: number
  atividade: number
  notas: string
}

type Props = {
  colmeia: {
    nome: string
    especie: string
    producaoAnual: number
    anoProducao: number
    historico: Checkin[]
  }
  score: number
}

export default function ExportarPDF({ colmeia, score }: Props) {
  const [gerando, setGerando] = useState(false)

  const gerar = async () => {
    setGerando(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      const amber = [201, 134, 26] as [number, number, number]
      const dark  = [26, 18, 9]   as [number, number, number]
      const gray  = [107, 114, 128] as [number, number, number]

      // Cabeçalho
      doc.setFillColor(...amber)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('MeliGenética', 14, 18)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text('Laudo Técnico Fenotípico', 14, 27)
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 14, 34)

      // Dados da colmeia
      doc.setTextColor(...dark)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(colmeia.nome, 14, 56)

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...gray)
      doc.text(`Espécie: ${colmeia.especie}`, 14, 65)
      doc.text(`Produção anual: ${colmeia.producaoAnual} kg (${colmeia.anoProducao})`, 14, 72)
      doc.text(`Score fenotípico atual: ${score.toFixed(1)} / 100`, 14, 79)
      doc.text(`Total de check-ins: ${colmeia.historico.length}`, 14, 86)

      // Linha separadora
      doc.setDrawColor(...amber)
      doc.setLineWidth(0.5)
      doc.line(14, 92, 196, 92)

      // Histórico de check-ins
      doc.setTextColor(...dark)
      doc.setFontSize(13)
      doc.setFont('helvetica', 'bold')
      doc.text('Histórico de Check-ins', 14, 102)

      // Cabeçalho da tabela
      doc.setFillColor(254, 243, 199)
      doc.rect(14, 108, 182, 9, 'F')
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...dark)
      doc.text('Data',       16, 114)
      doc.text('Pop.',       60, 114)
      doc.text('Mansidão',   85, 114)
      doc.text('Sanidade',  115, 114)
      doc.text('Ativ. Voo', 145, 114)
      doc.text('Notas',     170, 114)

      // Linhas da tabela
      doc.setFont('helvetica', 'normal')
      let y = 123
      const historico = [...colmeia.historico].sort(
        (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
      )

      historico.forEach((h, i) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        if (i % 2 === 0) {
          doc.setFillColor(249, 250, 251)
          doc.rect(14, y - 5, 182, 8, 'F')
        }
        doc.setTextColor(...dark)
        doc.text(new Date(h.data).toLocaleDateString('pt-BR'), 16, y)
        doc.text(String(h.populacao), 60, y)
        doc.text(String(h.mansidao),  85, y)
        doc.text(String(h.sanidade),  115, y)
        doc.text(String(h.atividade), 145, y)
        if (h.notas) {
          doc.setTextColor(...gray)
          doc.text(h.notas.substring(0, 20), 170, y)
        }
        y += 9
      })

      // Rodapé
      const totalPages = doc.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(...gray)
        doc.text(
          'MeliGenética · Baseado em Souza et al. (2018) · meligenetica-web.vercel.app',
          14, 290
        )
        doc.text(`Página ${i} de ${totalPages}`, 180, 290)
      }

      doc.save(`meligenetica-${colmeia.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`)
    } catch (err) {
      console.error('Erro ao gerar PDF:', err)
    } finally {
      setGerando(false)
    }
  }

  return (
    <button
      onClick={gerar}
      disabled={gerando}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: gerando ? '#e5e7eb' : '#1f2937',
        color: gerando ? '#9ca3af' : 'white',
        border: 'none', borderRadius: 10,
        padding: '8px 16px', fontSize: 13, fontWeight: 600,
        cursor: gerando ? 'wait' : 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {gerando ? '⏳ Gerando...' : '📄 Exportar PDF'}
    </button>
  )
}