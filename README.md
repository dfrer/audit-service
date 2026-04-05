# AI Audit Service

A practical audit service for how AI is actually being used -- across business, personal, local setups, coding workflows, and AI/ML deployments.

**What we do:** Examine real AI setups, identify waste, risk, and gaps, and deliver prioritized action plans. Fixed price, fixed scope, fast turnaround.

**What we audit:**
- Business AI operations (tools, workflows, costs, privacy)
- Personal AI workflows (prompts, habits, tool stack)
- Local / self-hosted AI (models, hardware, setup sanity)
- AI coding / build workflows (Cursor, agents, repos, testing)
- AI/ML deployment practicality (hosted vs local, production readiness)
- General AI usage (does not fit a narrow lane)

## Quick Start

```bash
cd app
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

## Project Structure

```
audit-service/
  README.md                      -- This file
  docs/
    business/                    -- Business model, service offers, company overview
    corpus/                      -- Internal audit knowledge base (taxonomy, failure modes, patterns)
    boundaries/                  -- What this service is and is not
    ops/                         -- Operator model, runbooks, agent tasks, hardening plan
    product/                     -- Product spec, customer journey
    security/                    -- Access model, approval gates
    sales/                       -- Positioning, outreach templates
    legal/                       -- Compliance notes, account setup checklist
  app/                           -- Next.js application
    app/                         -- Pages: landing, intake, confirm, admin orders
    api/                         -- API: create-order, checkout, webhook, health
    lib/                         -- Database, adapters, types
    components/                  -- UI components
  scripts/                       -- Bootstrap, maintenance, export
  prompts/                       -- Audit generation, scaffolding prompts
  templates/                     -- Report delivery template
```

## Current State

The core operations are hardened:
- File-based JSONL persistence survives restarts
- Real Stripe adapter ready for credentials
- Resend-ready email adapter with console fallback
- Admin auth via secret token
- Proper webhook signature verification (when credentials configured)
- Build passes, TypeScript clean, lint clean

## What Requires Manual Setup

Before taking real orders, the owner must:
1. Create Stripe account + configure products/prices + webhook endpoint
2. Create email provider account (Resend/SendGrid) + verify domain
3. Set `.env.local` with real credentials
4. Set `ADMIN_SECRET` for admin page protection
5. Deploy to Vercel (or your platform)

See `docs/legal/02_manual_account_setup_checklist.md` for the full checklist.

## Persistence

The service uses JSONL file-based persistence (`lib/db/jsonl.ts`). Orders are written to `./storage/orders.jsonl` and survive restarts.

For production at scale, implement a PostgreSQL/Supabase adapter via the `OrdersDb` interface in `lib/db/interface.ts`.

## Business Model

Productized service. Fixed prices: $75 / $120 / $150. No hourly billing, no scope creep, no subscriptions to the service.

## Development

```bash
# Type check
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The `.env.example` documents all required variables.
