import Stripe from 'stripe';

// Singleton para reutilizar a instância do Stripe no servidor
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Ajustado conforme a exigência do seu terminal atual
  typescript: true,
});