import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import './globals.css'

export const viewport: Viewport = {
  themeColor: '#C9861A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://meligenetica.com'),
  title: {
    default: 'MeliGenética — Gestão e Seleção Genética de Meliponicultura',
    template: '%s | MeliGenética',
  },
  description: 'Plataforma open-source para manejo, avaliação fenotípica e seleção genética de colônias de abelhas sem ferrão. Ideal para meliponicultores iniciantes e avançados.',
  keywords: ['meliponicultura', 'abelhas sem ferrão', 'seleção genética', 'manejo de colônias', 'meliponários', 'abelhas nativas', 'apicultura', 'colmeias', 'fenótipo', 'MeliGenética'],
  authors: [{ name: 'MeliGenética', url: 'https://meligenetica.com' }],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    title: 'MeliGenética — Gestão de Meliponicultura',
    description: 'Plataforma open-source para seleção genética e manejo de abelhas sem ferrão.',
    url: 'https://meligenetica.com',
    siteName: 'MeliGenética',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeliGenética — Gestão de Meliponicultura',
    description: 'Plataforma open-source para seleção genética e manejo de abelhas sem ferrão.',
  },
  alternates: { canonical: 'https://meligenetica.com' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
