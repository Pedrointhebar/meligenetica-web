# MeliGenética — Versão Web

App web completo para gestão fenotípica de meliponários, com assinatura mensal via Stripe.

## Estrutura

```
meligenetica-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page (marketing)
│   │   ├── app/page.tsx          ← App completo (após assinar)
│   │   ├── sucesso/page.tsx      ← Tela pós-pagamento
│   │   ├── api/
│   │   │   ├── stripe/route.ts   ← POST → cria sessão Stripe Checkout
│   │   │   └── webhook/route.ts  ← Recebe eventos do Stripe
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       ├── stripe.ts             ← Cliente Stripe (servidor)
│       └── scoring.ts            ← Motor de score fenotípico
├── .env.local                    ← Variáveis de ambiente (NUNCA commitar)
└── package.json
```

---

## Setup em 5 passos

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar conta e produto no Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta gratuita
2. No Dashboard → **Products** → **Add product**:
   - Nome: `MeliGenética Premium`
   - Preço: `R$ 5,00` → Recurring → Monthly
   - Currency: `BRL`
3. Copie o **Price ID** (começa com `price_`)
4. Vá em **Developers** → **API keys** → copie:
   - Publishable key (`pk_test_...`)
   - Secret key (`sk_test_...`)

### 3. Configurar variáveis de ambiente

Edite o arquivo `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE
STRIPE_PRICE_ID=price_SEU_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar webhook local (para testar)

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Em outro terminal, rodar o proxy:
stripe listen --forward-to localhost:3000/api/webhook
# Isso imprime o webhook secret (whsec_...) — coloque no .env.local
```

### 5. Rodar localmente

```bash
npm run dev
# Abra http://localhost:3000
```

---

## Deploy em produção

### Opção A — Vercel (recomendado, gratuito para começar)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente no painel da Vercel
# Projeto → Settings → Environment Variables
```

Após o deploy, configure o webhook no Stripe:
- Stripe Dashboard → Developers → Webhooks → **Add endpoint**
- URL: `https://seusite.vercel.app/api/webhook`
- Eventos: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
- Copie o **Signing secret** → adicione como `STRIPE_WEBHOOK_SECRET` na Vercel

### Opção B — Railway / Render

Qualquer plataforma que suporte Node.js funciona. Configure as variáveis de ambiente conforme acima.

---

## Fluxo de pagamento

```
Usuário                Landing page             API /stripe          Stripe              App
   │                       │                         │                  │                  │
   ├──── email + clique ───▶│                         │                  │                  │
   │                       ├──── POST /api/stripe ───▶│                  │                  │
   │                       │                         ├── createSession ─▶│                  │
   │                       │                         │◀── session.url ──│                  │
   │◀──── redirect ────────┤◀──── { url } ───────────┤                  │                  │
   │                       │                         │                  │                  │
   ├──────────────────────────────────── Stripe Checkout Page ──────────▶│                  │
   │                       │                         │                  │                  │
   │◀─────────────────────────────── redirect /sucesso ─────────────────┤                  │
   │                       │                         │                  │                  │
   │                       │                         │◀── webhook ──────┤                  │
   │                       │                         │   (confirma)     │                  │
   ├──────────────────────────────────────────────────────────── acessa /app ──────────────▶│
```

---

## Proteção de acesso (próximo passo)

O app atual em `/app` é acessível a qualquer pessoa.
Para restringir por assinatura, adicione um sistema de autenticação:

**Opção mais simples**: [NextAuth.js](https://next-auth.js.org/) + salvar `stripeCustomerId` e `isSubscribed` no banco.

**Stack recomendada para MVP:**
- [Clerk](https://clerk.com) (auth) + Postgres (Neon.tech, gratuito) + Stripe

---

## Referências científicas

- Souza et al. (2018) — Genetic selection criteria for stingless bees. *Apidologie*
- Nunes-Silva et al. (2016) — Boas práticas de manejo para abelhas nativas sem ferrão
- Villas-Bôas (2012) — Mel de abelhas sem ferrão: produção e controle de qualidade
- Kerr et al. (1996) — Aspectos da biodiversidade amazônica. *Parcerias Estratégicas*
