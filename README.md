# AI Project Audit Service

A productized service that delivers codebase audits and build plans to developers. Customers receive a practical, prioritized execution plan and optionally a baseline repository scaffold.

## Quick Start

```bash
cd app
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Project Structure

```
audit-service/
  README.md                  -- This file
  docs/                      -- Business, product, ops, security, sales, legal docs
    business/                -- Company model, service offers, business model
    product/                 -- Product spec, customer journey
    ops/                     -- Operator model, runbooks, agent tasks, handoff protocol
    security/                -- Access model, approval gates
    sales/                   -- Positioning, outreach templates
    legal/                   -- Compliance notes, manual account setup checklist
  app/                       -- Next.js application (src dir = app/)
    app/                     -- App router pages
      page.tsx               -- Landing page
      intake/page.tsx        -- Intake form
      confirm/page.tsx       -- Order confirmation
      admin/orders/page.tsx  -- Order admin view
      api/                   -- API routes (create-order, stripe-webhook, health)
    components/              -- React components
    lib/                     -- Shared libraries
      types/                 -- TypeScript type definitions
      db/                    -- Database interface + local implementation
      adapters/              -- Stripe, email, GitHub, storage adapters
  prompts/                   -- Agent prompt templates
  scripts/                   -- Bootstrap, lint, seed, export, maintenance scripts
  templates/                 -- Report templates, email templates
  .github/workflows/         -- CI/CD (lint, typecheck, test, build)
  .env.example               -- Environment variable template
```

## Ownership Model

- **Human owner** controls all root accounts (GitHub, Vercel, Stripe, OpenAI, email, domain, bank)
- **Hermes** acts as operator with scoped tokens only
- See `docs/security/01_access_model.md` for the full access model
- See `docs/security/02_approval_gates.md` for what requires human approval
- See `docs/legal/02_manual_account_setup_checklist.md` for what the owner must do manually

## First Steps for Owner

1. Read `docs/business/01_company_overview.md` to understand the model
2. Complete the manual account setup checklist (`docs/legal/02_manual_account_setup_checklist.md`)
3. Set up environment variables from `.env.example`
4. Run the bootstrap script: `./scripts/bootstrap.sh`
5. Deploy to Vercel: `npx vercel --prod`
6. Configure Stripe webhook pointing to `/api/stripe-webhook`
7. See `docs/ops/02_runbooks.md` for the launch runbook

## Development

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # TypeScript type check
```

## License

All rights reserved. This is a private business repository.
