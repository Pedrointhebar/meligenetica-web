import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MeliGenética — Seleção genética de abelhas sem ferrão',
  description: 'App científico para gestão fenotípica e seleção genética de meliponários. Baseado em Souza et al. (2018).',
  keywords: 'abelhas sem ferrão, meliponário, seleção genética, apicultura, meliponicultura',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
