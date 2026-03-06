import Stripe from 'stripe';

// Singleton para reutilizar a instância do Stripe no servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!,
  
  {
  apiVersion: '2026-02-25.clover', // Ajustado conforme a exigência do seu terminal atual
  typescript: true,
});