import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe()
    const body = await req.json().catch(() => ({}))
    const email = body.email || undefined
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      customer_email: email,
      subscription_data: { trial_period_days: 7 },
      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?cancelado=1`,
      metadata: { source: 'web' },
      billing_address_collection: 'required',
      locale: 'pt-BR',
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao criar sessão' },
      { status: 500 }
    )
  }
}
