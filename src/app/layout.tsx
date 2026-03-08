import type { Metadata, Viewport } from 'next'
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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
        <ClerkProvider>
          <header style={{ background: '#fff', borderBottom: '1px solid #E2D9CC', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px', color: '#C9861A' }}>
              ⬡ MeliGenética
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
