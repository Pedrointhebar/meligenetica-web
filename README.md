# MeliGenética — Versão Web

App web completo para gestão fenotípica de meliponários.

## Estrutura

```
meligenetica-web/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page (marketing)
│   │   ├── app/page.tsx          ← App completo
│   │   ├── sucesso/page.tsx      ← Tela de sucesso
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   └── lib/
│       ├── scoring.ts            ← Motor de score fenotípico
├── .env.local                    ← Variáveis de ambiente (NUNCA commitar)
└── package.json
```

---

## Setup em 3 passos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Edite o arquivo `.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Rodar localmente

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
```

### Opção B — Railway / Render

Qualquer plataforma que suporte Node.js funciona. Configure as variáveis de ambiente conforme acima.

---

## Proteção de acesso (próximo passo)

O app atual em `/app` é acessível a qualquer pessoa.
Para restringir acesso, adicione um sistema de autenticação:

**Opção mais simples**: [NextAuth.js](https://next-auth.js.org/)

**Stack recomendada para MVP:**
- [Clerk](https://clerk.com) (auth) + Postgres (Neon.tech, gratuito)

---

## Referências científicas

- Souza et al. (2018) — Genetic selection criteria for stingless bees. *Apidologie*
- Nunes-Silva et al. (2016) — Boas práticas de manejo para abelhas nativas sem ferrão
- Villas-Bôas (2012) — Mel de abelhas sem ferrão: produção e controle de qualidade
- Kerr et al. (1996) — Aspectos da biodiversidade amazônica. *Parcerias Estratégicas*
