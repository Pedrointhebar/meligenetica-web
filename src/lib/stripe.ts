import Stripe from 'stripe'

// Inicializa só quando chamado, não no build
export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY as string)
}
