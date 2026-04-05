# CURRENT STATE REPORT

**Generated:** 2026-04-04
**Project:** audit-service
**Branch:** fix-cleanup (not yet merged to main)
**Remote:** github.com/dfrer/audit-service.git

---

## 1. Executive Summary

This is a **documented, scaffolded, visually polished web app** for a productized "AI project audit" service. The landing page, pricing, FAQ, intake form, admin panel, and confirmation page are all implemented with refined UI. TypeScript compiles clean and Next.js builds successfully.

**BUT:** The app cannot actually accept payments, cannot send emails, cannot clone GitHub repos, and cannot persist data across server restarts. All four integration adapters (Stripe, email, GitHub, storage) are stubs with placeholder behavior. The database is an in-memory Map that resets on every deploy/restart.

**Deployable?** Yes, the code builds and runs. But without Stripe credentials the "Buy" buttons are dead, and without a real database the admin panel shows nothing once the server restarts.

**Biggest strength:** Complete documentation foundation. The business model, operator model, security gates, compliance notes, and runbooks are all real content derived from the deep research report, not filler.

**Biggest weakness:** Zero real integrations. The app looks like a complete business but currently functions as a static site with a form that stores data in RAM.

**Biggest risk:** Someone could deploy this and get a refund/chargeback if a customer clicks "Buy" and nothing happens. The flow currently has no Stripe redirect -- landing page CTAs go to `#pricing`, pricing buttons go to `/intake?package=...`, the intake form submits to `/api/create-order` which writes to the in-memory store and then "sends" a confirmation email (which logs to console). No payment ever occurs.

---

## 2. Project Metadata

| Field | Value |
|---|---|
| Project name | audit-service |
| Local path | /home/hunter/audit-service |
| Remote URL | git@github.com:dfrer/audit-service.git |
| Primary stack | Next.js 16 + TypeScript + Tailwind CSS 4 |
| Package manager | npm |
| Git initialized | Yes |
| Current branch | fix-cleanup |
| Last commit hash | d594f0a4 |
| Last commit message | refactor: second design pass -- refined all pages and components |
| Total tracked files | ~57 source files (excluding node_modules, .next, package-lock) |

---

## 3. Repository Tree

```
audit-service/
  README.md                          -- Project overview, quick start, first steps
  .gitignore                         -- Excludes node_modules/, .next/, .env*, storage/
  .github/
    workflows/
      ci.yml                         -- CI: lint + typecheck + build on push/PR to main
  app/                               -- Next.js application root
    .env.example                     -- Documented env vars for ALL integrations
    .eslintrc.json                   -- Relaxes no-unused-vars for underscore prefixes
    .gitignore                       -- Excludes .next/, node_modules/, .env.local
    eslint.config.mjs                -- ESLint 9 flat config with next plugin
    next.config.ts                   -- Default config, no custom options
    tsconfig.json                    -- Standard Next.js TS config with @/* path alias
    next-env.d.ts                    -- Generated Next.js type declarations
    postcss.config.mjs               -- Tailwind CSS 4 PostCSS plugin
    package.json                     -- Dependencies: next 16.2.2, react 19.1.0, tailwind ^4
    app/                             -- App router pages
      layout.tsx                     -- Root layout with Geist fonts
      globals.css                    -- Minimal Tailwind + font declarations
      page.tsx                       -- Landing page (hero, how-it-works, pricing, FAQ, CTA)
      intake/page.tsx                -- Intake form page (wraps IntakeForm component)
      confirm/page.tsx               -- Order submitted confirmation page
      admin/orders/page.tsx          -- Admin order list with status filter
      api/create-order/route.ts      -- POST endpoint: validates + stores intake data
      api/stripe-webhook/route.ts    -- POST endpoint: logs webhook events (stub)
      api/health/route.ts            -- GET endpoint: returns 200 with timestamp
      favicon.ico                    -- Next.js default favicon
    components/
      PricingSection.tsx             -- 3-tier pricing cards with "Most popular" badge
      FAQSection.tsx                 -- Accordion FAQ with +/- toggle icons
      IntakeForm.tsx                 -- Full form with validation, package selector, loading state
    lib/
      types/order.ts                 -- Order, PackageTier, OrderStatus, IntakeData types
      db/interface.ts                -- OrdersDb interface (CRUD)
      db/local.ts                    -- In-memory Map implementation of OrdersDb
      adapters/stripe.ts             -- PLACEHOLDER stub -- logs, returns fake checkout URL
      adapters/email.ts              -- PLACEHOLDER stub -- logs draft instead of sending
      adapters/github.ts             -- PLACEHOLDER stub -- parses URLs, no API calls
      adapters/storage.ts            -- PARTIAL -- works locally via fs/promises, S3 commented out
    public/                          -- Default Next.js SVGs + favicon
  docs/
    business/
      01_company_overview.md         -- Company model, ownership, why lean
      02_service_offers.md           -- Three tiers with deliverables, turnaround, upsells
      03_business_model.md           -- Revenue/cost logic, pricing, break-even, constraints
    product/
      01_product_spec.md             -- Full flow, states, inputs/outputs, edge cases, MVP scope
      02_customer_journey.md         -- Six-stage journey: visitor to re-engagement
    ops/
      01_operator_model.md           -- Human vs Hermes roles, what each can/cannot do
      02_runbooks.md                 -- Launch, new order, delivery, incident, rollback
      03_agent_tasks.md              -- Tasks Hermes can automate, weekly maintenance checklist
      04_handoff_protocol.md         -- How new agents should read this project
    security/
      01_access_model.md             -- Root vs scoped tokens, secret handling, least privilege
      02_approval_gates.md           -- Six gates: A (accounts), B (billing), C (delete), D (secrets), E (quality), F (risk)
    sales/
      01_positioning.md              -- Target customer, pain points, differentiation
      02_outreach_templates.md       -- DM, email, post, follow-up, delivery email templates
    legal/
      01_compliance_notes.md         -- Platform-specific terms constraints (GitHub, Vercel, Stripe, OpenAI)
      02_manual_account_setup_checklist.md -- Step-by-step for 7 root accounts owner must create
  prompts/
    audit-generation.md              -- Prompt template for generating audit reports
    scaffold-recommendation.md       -- Prompt template for generating scaffold PRs
    customer-followup.md             -- Prompt template for follow-up emails
    incident-summary.md              -- Prompt template for incident documentation
  scripts/
    bootstrap.sh                     -- Validates env, installs deps, runs typecheck
    seed-mock-orders.ts              -- Creates 3 test orders for development
    export-report.sh                 -- Lists stored delivery artifacts for an order
    maintenance.sh                   -- Weekly health check, dependency check, storage check, git status
  templates/
    report-template.md               -- Markdown template for audit report output
```

---

## 4. What Was Actually Created

### Docs (REAL - all solid)

| Path | Purpose | Status |
|---|---|---|
| docs/business/01_company_overview.md | Company model | REAL - derived from deep research report |
| docs/business/02_service_offers.md | Three service tiers | REAL - specific prices, deliverables, turnaround |
| docs/business/03_business_model.md | Revenue/cost logic | REAL - specific numbers, break-even analysis |
| docs/product/01_product_spec.md | Full product spec | REAL - states, inputs, outputs, edge cases, MVP boundaries |
| docs/product/02_customer_journey.md | Six-stage journey | REAL - visitor to re-engagement with specific touchpoints |
| docs/ops/01_operator_model.md | Human vs Hermes roles | REAL - explicit permissions model |
| docs/ops/02_runbooks.md | Operational runbooks | REAL - launch, order, delivery, incident, rollback |
| docs/ops/03_agent_tasks.md | Agent automation tasks | REAL - recurring tasks, weekly checklist |
| docs/ops/04_handoff_protocol.md | Agent handoff | REAL - first files to read, safety rules |
| docs/security/01_access_model.md | Access/token model | REAL - token types, rotation, secret handling |
| docs/security/02_approval_gates.md | Six approval gates | REAL - specific triggers, who approves, why |
| docs/sales/01_positioning.md | Market positioning | REAL - target, pain points, messaging principles |
| docs/sales/02_outreach_templates.md | Outreach templates | REAL - 5 templates with real copy |
| docs/legal/01_compliance_notes.md | Compliance notes | REAL - platform-specific ToS constraints with citations |
| docs/legal/02_manual_account_setup_checklist.md | Account setup steps | REAL - 7 accounts, step-by-step, data needed, what agent can do after |

### App/Frontend (REAL - polished but no integrations)

| Path | Purpose | Status |
|---|---|---|
| app/page.tsx | Landing page | REAL - hero, how it works, pricing, trust, FAQ, CTA, footer |
| app/intake/page.tsx | Intake form page | REAL - wraps IntakeForm, passes preselected package |
| app/confirm/page.tsx | Order confirmation | REAL - success state with CTAs |
| app/admin/orders/page.tsx | Admin order list | REAL - filterable list with status dots and counts |
| components/PricingSection.tsx | Pricing cards | REAL - 3 tiers, "Most popular" badge |
| components/FAQSection.tsx | FAQ accordion | REAL - 8 Q&As with +/- toggle |
| components/IntakeForm.tsx | Intake form | REAL - full validation, package selector, submit to API |

### Backend/API (REAL - functional but limited)

| Path | Purpose | Status |
|---|---|---|
| app/api/create-order/route.ts | Intake submission API | REAL - validates fields, stores in localDb, calls email stub |
| app/api/stripe-webhook/route.ts | Stripe webhook handler | STUB - logs event type, no signature verification |
| app/api/health/route.ts | Health check endpoint | REAL - returns status, timestamp, uptime |

### Integrations (ALL PLACEHOLDER)

| Path | Purpose | Status |
|---|---|---|
| lib/adapters/stripe.ts | Stripe Checkout | PLACEHOLDER - console.warn, returns fake URL |
| lib/adapters/email.ts | Email sending | PLACEHOLDER - console.log drafts only |
| lib/adapters/github.ts | GitHub API/PR | PARTIAL - URL parsing works, API calls commented out |
| lib/adapters/storage.ts | Report storage | PARTIAL - local fs works, S3 commented out |

### Persistence (MOCK)

| Path | Purpose | Status |
|---|---|---|
| lib/db/interface.ts | Database interface | REAL - clean CRUD interface |
| lib/db/local.ts | In-memory Map | MOCK - works for dev, data lost on restart |

### Scripts (REAL)

| Path | Purpose | Status |
|---|---|---|
| scripts/bootstrap.sh | Env validation | REAL - checks node, npm, env vars, runs tsc |
| scripts/seed-mock-orders.ts | Seed test data | REAL - creates 3 mock orders |
| scripts/export-report.sh | Report export | REAL - lists stored artifacts (needs real storage) |
| scripts/maintenance.sh | Weekly maintenance | REAL - health check, npm outdated, storage check, git status |

### CI/Config

| Path | Purpose | Status |
|---|---|---|
| .github/workflows/ci.yml | GitHub Actions CI | REAL - lint + typecheck + build |
| .env.example | Env template | REAL - 17 env vars with comments |
| app/.eslintrc.json | ESLint relax rules | REAL - allows _-prefixed unused vars |
| app/tsconfig.json | TypeScript config | REAL - standard Next.js config |
| app/postcss.config.mjs | PostCSS config | REAL - Tailwind v4 |
| app/next.config.ts | Next.js config | REAL - no custom options |
| .gitignore (root) | Ignore rules | REAL - node_modules, .next, .env*, storage |
| .gitignore (app/) | Ignore rules | REAL - .next, node_modules, .env*, tsbuildinfo |

### Prompts/Agent Ops (REAL)

| Path | Purpose | Status |
|---|---|---|
| prompts/audit-generation.md | Audit report prompt | REAL - structured prompt with variables |
| prompts/scaffold-recommendation.md | Scaffold PR prompt | REAL - files to generate for scaffold tier |
| prompts/customer-followup.md | Follow-up email prompt | REAL - input/output format, rules |
| prompts/incident-summary.md | Incident summary prompt | REAL - structured format, factual tone |

### Templates (REAL)

| Path | Purpose | Status |
|---|---|---|
| templates/report-template.md | Report template | REAL - markdown template with placeholders |

---

## 5. Business + Service Documentation Status

All 15 planned documents exist. Quality assessment:

| File | Exists | Quality | Summary |
|---|---|---|---|
| docs/business/01_company_overview.md | Yes | Solid | Company model, service tiers, target audience, lean rationale, ownership model with explicit human/Hermes split |
| docs/business/02_service_offers.md | Yes | Solid | Three tiers with exact prices ($75/$120/$150), deliverables per tier, turnaround times, upsell pricing, refund policy |
| docs/business/03_business_model.md | Yes | Solid | Revenue scenarios with specific numbers, fixed/variable costs, break-even analysis at different plan tiers, what this is NOT |
| docs/product/01_product_spec.md | Yes | Solid | Full flow from landing to delivery, order states with enum, edge cases with handling, input field specs, MVP boundaries |
| docs/product/02_customer_journey.md | Yes | Solid | Six stages with specific touchpoints, SLA notes, customer experience at each stage, re-engagement strategy |
| docs/ops/01_operator_model.md | Yes | Solid | Explicit role separation, automation whitelist, approval gate references, token model, communication model |
| docs/ops/02_runbooks.md | Yes | Solid | Five runbooks: launch, new order, delivery, incident, rollback. Each has specific steps, communication templates |
| docs/ops/03_agent_tasks.md | Yes | Solid | Recurring task list, weekly maintenance checklist, report assembly process, monitoring review process |
| docs/ops/04_handoff_protocol.md | Yes | Solid | First 5 files to read, key directories, safety rules, incident handling, context for new agents |
| docs/security/01_access_model.md | Yes | Solid | Root vs scoped token model, secret handling rules, no-sharing policy, least privilege principles, rotation schedule |
| docs/security/02_approval_gates.md | Yes | Solid | Six gates with trigger, approver, reason, and action for each. Quick reference table |
| docs/sales/01_positioning.md | Yes | Solid | Target customer profile, four pain points, positioning statement, differentiation table, messaging principles |
| docs/sales/02_outreach_templates.md | Yes | Solid | Five templates (DM, cold email, social post, follow-up, delivery) with real copy, not lorem ipsum |
| docs/legal/01_compliance_notes.md | Yes | Solid | Platform-specific constraints from ToS (GitHub, Vercel, Stripe, OpenAI, Google), operational rules, disclaimer |
| docs/legal/02_manual_account_setup_checklist.md | Yes | Solid | Seven root accounts, step-by-step checklists, data needed, what agent can configure after setup |

**Verdict:** Documentation is the strongest part of this project. All documents are substantive, specific, and useful. No scaffolding filler.

---

## 6. Product / App Implementation Status

| Subsystem | Status | Evidence |
|---|---|---|
| Landing page | Implemented | app/page.tsx -- 183 lines, all sections rendered |
| How it works section | Implemented | app/page.tsx -- 3-step cards with numbered boxes |
| Pricing section | Implemented | components/PricingSection.tsx -- 3 cards with features, CTAs to /intake |
| FAQ section | Implemented | components/FAQSection.tsx -- 8 Q&As with accordion |
| Trust/social proof section | Implemented | app/page.tsx -- 3-card grid with hover shadows |
| Final CTA section | Implemented | app/page.tsx -- dark background section |
| Footer | Implemented | app/page.tsx -- copyright, intake link, admin link |
| Nav bar | Implemented | app/page.tsx -- sticky, backdrop blur, 4 nav items |
| Intake form | Implemented | components/IntakeForm.tsx -- validated, submits to API |
| Intake page | Implemented | app/intake/page.tsx -- wraps IntakeForm, handles URL params |
| Order creation API | Implemented | app/api/create-order/route.ts -- validates, stores, calls email stub |
| Order confirmation page | Implemented | app/confirm/page.tsx -- success UI, CTAs |
| Admin orders page | Implemented | app/admin/orders/page.tsx -- filterable list with status filter |
| Health check API | Implemented | app/api/health/route.ts -- returns status/uptime |
| Stripe webhook API | Stubbed | app/api/stripe-webhook/route.ts -- logs events, no verification |
| Stripe Checkout | Stubbed | lib/adapters/stripe.ts -- logs warning, returns fake URL |
| Email sending | Stubbed | lib/adapters/email.ts -- logs drafts to console |
| GitHub integration | Stubbed | lib/adapters/github.ts -- URL parsing works, no API calls |
| Storage (local) | Partial | lib/adapters/storage.ts -- writes to ./storage/deliveries on filesystem |
| Storage (S3) | Not started | lib/adapters/storage.ts -- commented out S3 code |
| Persistence (production) | Not started | lib/db/local.ts -- in-memory Map, data lost on restart |
| Analytics/monitoring | Not started | No analytics configured |
| PDF generation | Not started | No PDF library or conversion logic |
| Auth (admin) | Not started | No authentication on /admin/orders |

---

## 7. Route / Page / UI Inventory

| Route | Source File | Purpose | Completeness | Known Issues |
|---|---|---|---|---|
| `GET /` | app/page.tsx | Landing page | Complete -- all sections render | None |
| `GET /intake` | app/intake/page.tsx | Intake form wrapper | Complete -- handles URL params | None |
| `GET /confirm` | app/confirm/page.tsx | Order confirmation page | Complete | Static page, no order ID lookup |
| `GET /admin/orders` | app/admin/orders/page.tsx | Admin order list | Complete -- filters work with mock data | No authentication gate |
| `POST /api/create-order` | app/api/create-order/route.ts | Submit intake form | Complete -- validation + storage | No order ID generation from Stripe; intake form creates order directly |
| `POST /api/stripe-webhook` | app/api/stripe-webhook/route.ts | Stripe webhook handler | Stub -- logs only | No signature verification, no actual order state updates |
| `GET /api/health` | app/api/health/route.ts | Health check | Complete | None |

**Missing routes not in the MVP:**
- Stripe Checkout redirect (intake page should redirect to Stripe after submission for paid packages)
- Individual order detail page (`/admin/orders/[id]`)
- Public order status tracker
- Stripe checkout session creation API route

---

## 8. Data Models and Storage

### Types (exact path: app/lib/types/order.ts)

```typescript
type PackageTier = "audit-lite" | "audit-standard" | "audit-scaffold"

type OrderStatus = "new" | "intake-complete" | "in-progress" | "review" | "delivered" | "archived"

interface Order {
  id: string;                         // "ord_TIMESTAMP_RANDOM"
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  packageTier: PackageTier;
  intake: IntakeData | null;          // null until intake form submitted
  internalNotes: string;
  deliveryArtifacts: DeliveryArtifact[];
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  archivedAt?: string;
}

interface IntakeData {
  name: string;
  email: string;
  repoUrl: string;
  projectSummary: string;
  goals?: string;
  constraints?: string;
  packageTier: PackageTier;
  acknowledgedPrivateRepoPolicy: boolean;
}

interface DeliveryArtifact {
  type: "pdf" | "markdown" | "pr-link";
  url?: string;
  filename?: string;
  uploadedAt?: string;
}
```

### Database Interface (exact path: app/lib/db/interface.ts)

```typescript
interface OrdersDb {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(status?: OrderStatus): Promise<Order[]>;
  update(id: string, input: UpdateOrderInput): Promise<Order>;
  delete(id: string): Promise<void>;
}
```

### Storage Used

**Currently:** In-memory Map (`app/lib/db/local.ts`)
- Data is stored in a `Map<string, Order>` at module scope
- Data is LOST when the server process restarts
- Explicitly labeled as "development only" in comments
- Swappable via the `OrdersDb` interface

**No real database is configured.** No Supabase, no Postgres, no SQLite, no file-based persistence. The local Map is the only implementation.

---

## 9. Environment and Secrets Readiness

### .env.example contents (app/.env.example)

| Variable | Purpose | Required |
|---|---|---|
| NEXT_PUBLIC_APP_URL | Public app URL | Required |
| NEXT_PUBLIC_STRIPE_MODE | "test" or "live" | Required |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | Stripe public key | Required for payments |
| STRIPE_SECRET_KEY | Stripe secret key | Required for payments |
| STRIPE_WEBHOOK_SECRET | Webhook verification | Required for webhooks |
| STRIPE_PRICE_LITE | Stripe Price ID for Lite | Required for payments |
| STRIPE_PRICE_STANDARD | Stripe Price ID for Standard | Required for payments |
| STRIPE_PRICE_SCAFFOLD | Stripe Price ID for Scaffold | Required for payments |
| GITHUB_PAT | GitHub PAT for repo access | Required for GitHub features |
| VERCEL_ACCESS_TOKEN | Vercel API token | Optional (Hermes deployments) |
| VERCEL_PROJECT_ID | Vercel project ID | Optional |
| VERCEL_ORG_ID | Vercel org ID | Optional |
| RESEND_API_KEY | Email provider key | Required for emails |
| EMAIL_FROM | Sender address | Required for emails |
| DATABASE_URL | Postgres connection string | Optional (future Supabase) |
| SUPABASE_URL | Supabase project URL | Optional |
| SUPABASE_SERVICE_ROLE_KEY | Supabase admin key | Optional |
| STORAGE_DIR | Local storage path | Optional, defaults to ./storage/deliveries |
| SENTRY_DSN | Error monitoring | Optional |

### Secrets Handling Assessment

**Sane:**
- .env.local is in .gitignore
- .env.example has placeholder values with clear comments
- No secrets are hardcoded in source (except placeholder strings like "price_PLACEHOLDER_lite")
- Stripe and other adapters read from process.env

**Risky/Incomplete:**
- The admin page `/admin/orders` has NO authentication -- anyone who knows the URL can see all orders
- The create-order API has NO rate limiting -- could be spammed
- The stripe-webhook route has NO signature verification -- anyone could POST fake webhook events
- The local storage adapter writes to the local filesystem -- not portable across Vercel's serverless functions
- No HTTPS enforcement configured (would be Vercel-level, but no config file exists)

### Integrations That Cannot Work Without Manual Credentials

| Integration | What's Needed | Why Manual |
|---|---|---|
| Stripe | Stripe account, API keys, Products/Prices | KYC, business identity |
| Email (Resend/SendGrid) | Email provider account, verified domain, API key | Domain ownership verification |
| GitHub (audit features) | GitHub account, PAT with repo access | Platform ToS (no bot accounts) |
| Storage (S3) | AWS account, bucket, credentials | Business infrastructure |

---

## 10. Deployment Readiness

**Status:** Deployable with manual setup

### Commands

| Command | Purpose | Tested |
|---|---|---|
| `npm install` (in app/) | Install dependencies | Passed |
| `npm run build` (in app/) | Production build | Passed |
| `npm run dev` (in app/) | Development server | Not tested in this review |
| `npx tsc --noEmit` | Type check | Passed |
| `npm run lint` | ESLint | FAILS -- see Section 11 |

### Deployment Config Files

No Vercel config file (vercel.json) exists. Next.js auto-deploys to Vercel with default settings which is usually fine.

### Deployment Blockers

1. **Stripe API keys not configured** -- The "Buy" buttons on pricing cards go to the intake form, not to Stripe Checkout. Intake form submits but no payment occurs. This is a functional blocker for the business to operate as intended.
2. **No email provider** -- Confirmation emails log to console. Customers will never receive order confirmations or delivery notifications.
3. **No real persistence** -- In-memory Map means all orders are lost when Vercel cold-starts or redeploys. Admin panel will show empty state after any deployment.
4. **Admin page has no auth** -- Anyone with the URL sees all orders.
5. **No custom domain configured** -- Will use Vercel's random subdomain.

---

## 11. Evidence From Commands

### npm install
- **Command:** `npm install` (in /home/hunter/audit-service/app)
- **Result:** PASSED
- **Output:** "added 359 packages, found 0 vulnerabilities"

### npm run build
- **Command:** `npm run build` (in /home/hunter/audit-service/app)
- **Result:** PASSED
- **Output:** Compiled successfully in ~1.5s, TypeScript finished in ~1.9s, 10 pages generated (7 static, 4 dynamic -- one overlap). Zero errors, zero warnings from Next.js build.

### npx tsc --noEmit
- **Command:** `npx tsc --noEmit` (in /home/hunter/audit-service/app)
- **Result:** PASSED
- **Output:** Zero errors

### npm run lint
- **Command:** `npm run lint` (in /home/hunter/audit-service/app)
- **Result:** FAILS
- **Output:** "Invalid project directory provided, no such directory: /home/hunter/audit-service/app/lint"
- **Reason:** The ESLint flat config (eslint.config.mjs) is not being read correctly by `next lint`. Next.js 16 + ESLint 9 flat config has a known incompatibility. The legacy `.eslintrc.json` also exists but is likely being ignored. This is a known issue that would resolve on Vercel since Next.js handles ESLint differently there, but it fails locally.

### npm test
- **Command:** Not run
- **Reason:** No test script exists in package.json. No test files exist in the project.
- **Output:** N/A

### Additional verification done:
- TypeScript type check passed independently via `npx tsc --noEmit` (zero errors when `@types/react` and `@types/node` are installed as dev dependencies)
- All route definitions confirmed in build output
- Git repository on main branch has 2 commits, remote points to github.com/dfrer/audit-service.git
- Current active branch is `fix-cleanup` (not yet merged to main)

---

## 12. Placeholder / Fake / Incomplete Areas

**THIS SECTION IS CRITICAL.** Here is everything that looks complete but is not:

### Completely Stubbed (Does Not Work)

1. **Stripe Checkout** (`lib/adapters/stripe.ts`)
   - `createCheckoutSession()` logs a console.warn and returns a fake URL: `https://checkout.stripe.com/PLACEHOLDER?price=...`
   - Stripe package is NOT installed (`npm install stripe` has not been run)
   - The commented-out real implementation exists but is not active
   - Price IDs default to "price_PLACEHOLDER_lite" etc.

2. **Stripe Webhook** (`app/api/stripe-webhook/route.ts`)
   - Logs event type to console only
   - No signature verification
   - No order state updates triggered by webhooks
   - Cannot process payment confirmations from Stripe

3. **Email Sending** (`lib/adapters/email.ts`)
   - `sendEmail()` logs to console: `[Email] DRAFT -> To: ... | Subject: ...`
   - No actual email is ever sent
   - Resend/SendGrid package NOT installed
   - Confirmation emails, delivery emails, follow-up emails -- all are console logs only

4. **GitHub Integration** (`lib/adapters/github.ts`)
   - `parseRepoUrl()` works (parses https://github.com/ and SSH URLs)
   - `checkRepoAccess()` returns "GitHub PAT not configured" unless PAT is set
   - `createScaffoldPR()` logs a warning and returns a fake PR URL
   - @octokit/rest package NOT installed

5. **Admin Authentication** (`app/admin/orders/page.tsx`)
   - No login, no auth middleware, no access control
   - Anyone who knows `/admin/orders` can see all orders

### Partially Implemented

6. **Local Storage** (`lib/adapters/storage.ts`)
   - Local filesystem writes work (writes to ./storage/deliveries/)
   - Not usable on Vercel's serverless platform (ephemeral filesystem)
   - S3 adapter is commented out, NOT functional
   - The storage adapter is imported by NOTHING in the app currently -- it exists but is not wired into any flow

7. **Intake-to-Payment Flow**
   - The intake form creates an order via `/api/create-order`
   - There is NO step where the customer is redirected to Stripe to pay
   - The flow currently goes: Landing -> Intake Form -> Order Created (no payment)
   - The "real" flow should be: Landing -> Stripe Checkout -> Intake Form -> Order Confirmed

### Incomplete but Not Stubs

8. **Order State Machine**
   - The types define 6 states but the app only transitions: null -> intake-complete
   - States "in-progress", "review", "delivered", "archived" exist in types but no code transitions to them
   - The admin page displays them if they exist but no UI updates them

9. **Delivery Artifacts**
   - The Order type has `deliveryArtifacts: DeliveryArtifact[]`
   - No code actually creates or attaches delivery artifacts
   - The storage adapter could store them but nothing calls it

---

## 13. Manual Owner Actions Still Required

### Account Creation (Cannot Be Automated)

| Step | Why Manual | What's Needed | What Agent Does After |
|---|---|---|---|
| Create GitHub account | GitHub ToS prohibits bot-created accounts | GitHub username, email, 2FA setup | Agent can create repos, PRs, Actions once PAT exists |
| Create Stripe account + KYC | Requires legal identity verification | Legal name, SSN/EIN, bank account, address | Agent can create products/prices, query orders via API |
| Create Vercel account + upgrade to Pro | Payment method required; Hobby is non-commercial | GitHub linking, credit card, Pro plan ($20/mo) | Agent can deploy, set env vars, manage domains |
| Create email domain | Domain ownership verification | Domain name, DNS provider access | Agent can configure DNS records, send via API |
| Create Google Workspace (optional) | Professional email | Domain, payment method ($8.40/mo) | Agent can configure templates, routing |
| Create business bank account | Regulated, requires identity | Depends on jurisdiction/bank | Nothing -- agent should never access this |
| Register domain | Asset/identity control | Domain name, payment, WHOIS info | Agent can update DNS via API if supported |

### Configuration Actions

| Step | Why Manual | What's Needed |
|---|---|---|
| Create Stripe Products (3) | Need to match audit packages to Stripe Price IDs | Price IDs for Lite ($75), Standard ($120), Scaffold ($150) |
| Create Stripe webhook endpoint | Need to provide a live URL | URL pointing to `/api/stripe-webhook` |
| Generate Stripe restricted API key | Security (least privilege) | API key with read/write limited to orders |
| Generate GitHub PAT | Security (scoped permissions) | Fine-grained PAT with read-only on customer repos |
| Generate Vercel access token | Security (project-scoped) | Token for the specific project |
| Copy .env.example to .env.local | Secrets cannot be committed | Fill in all placeholder values |
| Set env vars in Vercel dashboard | Deployment-time configuration | All env vars from .env.example |
| Configure custom domain DNS | Domain registrar credentials | CNAME record pointing to Vercel |

### Business Actions

| Step | Why Manual |
|---|---|
| Choose business structure (sole prop vs LLC) | Legal/tax decision, jurisdiction-dependent |
| Decide on business name | Branding decision |
| Complete Stripe verification/KYC flow | Requires actual identity documents |
| Decide initial outreach strategy | Business judgment call |

---

## 14. Deviations From the Original Plan

### Implemented As Planned
- All 15 documentation files as specified in the original prompt
- Three-tier pricing with exact prices from the research report ($75/$120/$150)
- Intake form with all specified fields
- Order lifecycle with 6 states
- Approval gate model (6 gates)
- Agent task definitions and runbooks
- CI workflow (lint, typecheck, build)
- Prompt templates for audit generation
- Clean Next.js project structure

### Simplified
- **Database:** Spec mentions "optionally include a Supabase-ready adapter." I created the interface and a local Map implementation. The Supabase-ready adapter exists only as a commented-out example in the storage adapter, not a fully separate module.
- **Stripe integration:** Spec asked for "Stripe integration placeholders." What was built is a fully commented-out integration with an active placeholder stub. The stub returns fake URLs rather than actual Stripe Checkout redirects -- this means the payment flow does not actually redirect to Stripe at all.
- **Admin:** Spec mentions "admin view." Built a read-only list view, not a full dashboard. No order detail view, no editing capability, no delivery management interface.
- **Email notifications:** Draft functions exist but no real provider is integrated. The spec said "email/notification adapter placeholder" -- delivered exactly that.

### Skipped (Intentionally, to Avoid Overbuilding)
- **No automated report generation** -- Spec says "Audit Pipeline (repeatable)" as a Month 1 item. The prompts/templates exist but there is no server-side report generation flow. This is by design: Gate E requires human review, and PDF generation adds significant complexity.
- **No user authentication** -- Spec mentions this is a productized service, not a SaaS. Customers don't log in. Confirmed as intentional skip.
- **No analytics** -- Not yet configured. Spec lists this as future work.
- **No real Stripe integration** -- The Stripe npm package is not installed. Placeholder code with commented real implementation. This is intentional: cannot test Stripe without credentials.

### Not Overbuilt
- No multi-tenant architecture
- No user accounts or login
- No complex admin roles (single owner model)
- No automated PDF generation
- No real-time features (no WebSockets, polling)
- No multi-currency support
- No subscription billing
- No complex admin dashboard (read-only order list only)
- The app is genuinely lean, matching the spec's intent

### Missing vs. Spec
- The spec mentions "Stripe Checkout" redirect from the "Buy" button on the landing page. Currently, pricing CTAs go to the intake form, not to Stripe. The full payment flow (payment -> intake -> confirmation) is not connected. The landing page CTAs and pricing cards should integrate Stripe Checkout Links or Payment Links.
- The spec mentions "Order tracking skeleton" -- implemented as `/admin/orders` but this is admin-only, not customer-facing. The original spec did mention "Order tracking skeleton" which could mean a customer-facing tracker. This is ambiguous and currently admin-only.

---

## 15. Critical File Excerpts

### README.md (truncated)

```
# AI Project Audit Service

A productized service that delivers codebase audits and build plans to developers.
Customers receive a practical, prioritized execution plan and optionally a baseline
repository scaffold.

## Quick Start

    cd app
    npm install
    cp .env.example .env.local
    npm run dev
```

### Order Types (app/lib/types/order.ts -- key excerpt)

```typescript
export type PackageTier = "audit-lite" | "audit-standard" | "audit-scaffold";

export const PACKAGE_CONFIG: Record<PackageTier, { name: string; price: number; turnaround: string }> = {
  "audit-lite": { name: "Audit Lite", price: 75, turnaround: "48 hours" },
  "audit-standard": { name: "Audit Standard", price: 120, turnaround: "72 hours" },
  "audit-scaffold": { name: "Audit + Scaffold", price: 150, turnaround: "5 business days" },
};

export type OrderStatus =
  | "new" | "intake-complete" | "in-progress" | "review" | "delivered" | "archived";
```

### Database Interface (app/lib/db/interface.ts)

```typescript
export interface OrdersDb {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(status?: OrderStatus): Promise<Order[]>;
  update(id: string, input: UpdateOrderInput): Promise<Order>;
  delete(id: string): Promise<void>;
}
```

### Create Order API (app/app/api/create-order/route.ts -- key excerpt)

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  // Validates: name, email, repoUrl, projectSummary, packageTier, acknowledgment
  // Creates or updates order in localDb
  // Calls sendOrderConfirmationEmail (which logs to console)
  // Returns { orderId, status: "intake-complete" }
}
```

### Stripe Adapter (app/lib/adapters/stripe.ts -- key excerpt)

```typescript
// PLACEHOLDER: This function requires the stripe npm package.
export async function createCheckoutSession(_params: CreateCheckoutSessionParams): Promise<string> {
  console.warn("[Stripe] createCheckoutSession is a placeholder...");
  return `https://checkout.stripe.com/PLACEHOLDER?price=${_params.priceId}&metadata_orderId=${_params.orderId}`;
}
```

### .env.example (app/.env.example -- key variables)

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_MODE=test
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXXXXXXXX
STRIPE_PRICE_LITE=price_XXXXXXXXXXXXXXXX
GITHUB_PAT=ghp_XXXXXXXXXXXXXXXX
```

### CI Workflow (.github/workflows/ci.yml -- key excerpt)

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, npm ci, npm run lint]
  typecheck:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, npm ci, npx tsc --noEmit]
  build:
    runs-on: ubuntu-latest
    steps: [checkout, setup-node, npm ci, npm run build]
```

---

## 16. Top Risks and Technical Debt

**Ranked by severity:**

### 1. No Real Payment Flow (CRITICAL)
The entire business logic stops after the intake form. Customers can submit intake data but are never redirected to Stripe to pay. The pricing buttons link to `/intake?package=...` instead of a Stripe Checkout session. The app cannot generate revenue until Stripe is integrated and connected.

**Impact:** Zero revenue possible.

### 2. Data Loss on Server Restart (HIGH)
The database is an in-memory Map. Every deploy, every Vercel cold start, every serverless function termination wipes all order data. Orders submitted in production could disappear without warning.

**Impact:** Lost orders, customer confusion, no audit trail.

### 3. Admin Page Has No Authentication (HIGH)
`/admin/orders` is publicly accessible. Anyone who discovers the URL can see all customer orders (names, emails, repo URLs, project descriptions).

**Impact:** Data exposure, privacy risk.

### 4. Stripe Webhook Has No Signature Verification (HIGH)
The webhook route accepts any POST request without verifying the Stripe signature. Anyone could send fake webhook events.

**Impact:** Order state could be manipulated by unauthorized parties.

### 5. No Tests (MEDIUM)
Zero test files exist. The CI workflow has a lint/typecheck/build pipeline but no test job because no test script is defined in package.json.

**Impact:** No safety net for future changes.

### 6. ESLint Fails Locally (LOW-MEDIUM)
`npm run lint` fails with "Invalid project directory provided" due to ESLint 9 flat config incompatibility with Next.js's `next lint` command. The build still succeeds but the CI lint job will fail on every push.

**Impact:** CI pipeline broken on lint job.

### 7. Storage Adapter Not Wired Into Any Flow (LOW-MEDIUM)
The `lib/adapters/storage.ts` adapter exists but is never imported or called by any API route or page. Report delivery has no code path to store or retrieve artifacts.

**Impact:** Delivery artifact model in types is dead code.

### 8. Intake Form Creates Order Without Payment (LOW)
The `/api/create-order` endpoint creates an order regardless of payment status. A customer could submit the intake form without ever paying via Stripe.

**Impact:** Orphaned orders, potential abuse of the intake form.

### 9. No Rate Limiting on API Endpoints (LOW)
The create-order API has no rate limiting. The health check is public. The webhook endpoint accepts unverified requests.

**Impact:** Potential API abuse, though the mock storage limits real damage.

### 10. Current Branch is fix-cleanup, Not main (LOW)
The design refinements are on the `fix-cleanup` branch. The main branch only has the initial commit. This creates split context and the deploy target is unclear.

**Impact:** Ambiguous deployment source.

---

## 17. Next 10 Highest-Value Actions

### 1. Integrate Stripe Checkout (Manual + Agent)
**Why:** Without payments, this is not a business. The intake form should redirect to Stripe Checkout after submission, or the pricing CTAs should initiate Stripe Checkout first.
**Type:** Approval-gated (requires Stripe account setup) + Agent (implementation)
**Outcome:** Actual payment flow, Stripe Price IDs functional, real money collection

### 2. Replace In-Memory Map with Real Persistence (Agent)
**Why:** Orders are lost on every server restart. This is the highest technical debt item.
**Type:** Agent-safe (can implement Supabase adapter or file-based persistence)
**Outcome:** Durable order storage, admin panel shows real data after deploys

### 3. Fix ESLint CI Failure (Agent)
**Why:** The CI lint job fails on every push. This blocks the pipeline.
**Type:** Agent-safe
**Outcome:** CI passes clean, lint works locally

### 4. Add Admin Authentication (Agent)
**Why:** Anyone can currently see all orders via `/admin/orders`.
**Type:** Agent-safe (can add simple token-based or Next.js middleware auth)
**Outcome:** Orders are protected behind authentication

### 5. Wire Up Stripe Webhook Properly (Agent)
**Why:** Payment confirmations from Stripe won't update order status.
**Type:** Agent-safe (install stripe package, implement signature verification, wire to order updates)
**Outcome:** Payment -> Order state transition works automatically

### 6. Connect Email Provider (Manual + Agent)
**Why:** Confirmation emails, delivery emails, follow-up emails are all console logs.
**Type:** Approval-gated (requires Resend or SendGrid account) + Agent (integration)
**Outcome:** Customers actually receive emails

### 7. Merge fix-cleanup to main (Agent)
**Why:** Design refinements are on a separate branch. Main only has the initial commit.
**Type:** Agent-safe
**Outcome:** Both branches unified, clear deployment target

### 8. Wire Storage Adapter into Delivery Flow (Agent)
**Why:** The storage adapter exists but nothing calls it. Delivery artifacts are stored nowhere.
**Type:** Agent-safe
**Outcome:** Reports can be stored and retrieved, delivery flow is complete

### 9. Deploy to Vercel (Manual + Agent)
**Why:** The app is local-only until deployed.
**Type:** Approval-gated (requires Vercel account) + Agent (deployment)
**Outcome:** Live, accessible web service

### 10. Add Basic Tests (Agent)
**Why:** Zero test coverage. No safety net for future changes.
**Type:** Agent-safe
**Outcome:** At minimum: type check in CI (already works), basic unit tests for order creation, validation

---

## 18. Reviewer Handoff Summary

### What to Inspect First
1. **docs/ directory** -- The documentation is the strongest part of the project. Reading `docs/business/01_company_overview.md` and `docs/ops/01_operator_model.md` will give the full picture of what this business is supposed to be and how it should operate.
2. **app/lib/types/order.ts** -- The single source of truth for all domain data.
3. **app/api/create-order/route.ts** -- The only API endpoint that does real work (validates and stores).
4. **app/lib/adapters/** -- All four adapters. Three are stubs, one is partial. This is where the biggest gaps exist.
5. **app/lib/db/local.ts** -- The entire persistence layer is an in-memory Map.

### Where the Biggest Uncertainty Is
The payment flow. The pricing UI and intake form are complete and polished, but they are not connected to actual payments. The intended flow is: Pricing -> Stripe Checkout -> Intake -> Order Confirmed. The actual flow is: Pricing -> Intake -> Order Created (no payment). Bridging this gap requires Stripe account creation, API key configuration, Stripe package installation, and either Checkout Links or Checkout Session creation.

### What Remains Open
- What is the business name and domain? (audit.dev is used in UI but not registered)
- What is the business structure? (sole prop, LLC, etc.)
- Which email provider to use? (Resend, SendGrid, etc.)
- Whether to start with ChatGPT Plus ($20) or Pro ($200)
- Whether to set up Supabase or use a simpler persistence solution
- Admin authentication approach (Vercel authentication? Simple token? GitHub OAuth?)

### Questions the Reviewer Should Ask
1. Is this intended to be a fully automated payment-to-delivery pipeline, or is it okay for payments to be manual (Stripe payment links sent via email)?
2. Should the admin panel have authentication before deployment, or is it fine to leave unprotected briefly while testing?
3. Should the database be Supabase (adds $25/mo) or is a simpler solution acceptable (SQLite via better-sqlite3, file-based, etc.)?
4. Should the Stripe integration be completed with the `stripe` npm package, or should Payment Links be used instead (simpler, no backend integration needed)?
