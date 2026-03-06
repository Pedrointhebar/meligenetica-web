// ─── /api/webhook ────────────────────────────────────────────────────────────
// Recebe eventos do Stripe (pagamento confirmado, cancelado, etc.)
// Configure no Stripe Dashboard → Webhooks → Add endpoint
// URL: https://seusite.com/api/webhook
// Eventos: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed

import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature invalid:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ─── Processar eventos ────────────────────────────────────────────────────
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log('✅ Assinatura criada:', session.customer_email, session.subscription)
      // AÇÃO: marque o usuário como assinante no seu banco de dados
      // Ex.: await db.user.update({ where: { email }, data: { isSubscribed: true } })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      console.log('❌ Assinatura cancelada:', sub.customer)
      // AÇÃO: remova acesso premium do usuário
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('⚠️ Pagamento falhou:', invoice.customer_email)
      // AÇÃO: envie e-mail de aviso ao usuário
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      console.log('💰 Renovação paga:', invoice.customer_email, invoice.amount_paid / 100)
      break
    }

    default:
      // Evento não tratado — OK ignorar
      break
  }

  return NextResponse.json({ received: true })
}
