import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!
  const stripe = getStripe()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Assinatura criada:', (event.data.object as any).customer_email)
      break
    case 'customer.subscription.deleted':
      console.log('Assinatura cancelada')
      break
    case 'invoice.payment_failed':
      console.log('Pagamento falhou')
      break
  }

  return NextResponse.json({ received: true })
}
