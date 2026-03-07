import type { Metadata, Viewport } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'MeliGenética — Seleção genética de abelhas sem ferrão',
  description: 'App científico para gestão fenotípica e seleção genética de meliponários. Registre check-ins semanais, monitore índices e tome decisões baseadas em dados.',
  keywords: 'abelhas sem ferrão, meliponário, seleção genética, apicultura, meliponicultura, Melipona, Tetragonisca',
  authors: [{ name: 'MeliGenética' }],
  openGraph: {
    title: 'MeliGenética — Seleção genética de abelhas sem ferrão',
    description: 'Registre check-ins semanais, monitore índices fenotípicos e tome decisões de divisão com base em dados científicos.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'MeliGenética',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeliGenética',
    description: 'Seleção genética de abelhas sem ferrão baseada em ciência.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MeliGenética',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#C9861A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
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
