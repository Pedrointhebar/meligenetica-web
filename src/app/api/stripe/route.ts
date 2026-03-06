// ─── /api/stripe/checkout ────────────────────────────────────────────────────
// Cria uma sessão de Checkout do Stripe e redireciona o usuário.
// Arquitetura mais simples: sem banco de dados, sem autenticação própria.
// O Stripe cuida de tudo: pagamento, recorrência, notificação de falha.

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const email = body.email || undefined
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      // Pré-preenche o e-mail se já tiver
      customer_email: email,

      // Período de trial gratuito de 7 dias
      subscription_data: {
        trial_period_days: 7,
      },

      // URLs de retorno
      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?cancelado=1`,

      // Metadados (útil para identificar o usuário depois)
      metadata: {
        source: 'web',
      },

      // Permite salvar método de pagamento para renovações
      payment_method_collection: 'if_required',

      // Coleta o CPF/CNPJ para emissão de nota (opcional mas bom para BR)
      billing_address_collection: 'required',

      // Localização para BRL
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Erro ao criar sessão de pagamento' },
      { status: 500 }
    )
  }
}
