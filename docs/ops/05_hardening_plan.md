# Hardening Plan

**Created:** 2026-04-06
**Phase:** Prototype to Minimally Real Service + Broadened to AI Audit Service

---

## Critical Blockers (Must Fix Before Launch)

1. **No real payment flow** - Stripe adapter returns fake URLs. Intake creates orders without any payment. The entire business cannot function.
2. **In-memory data store** - `localDb` uses a Map. Every restart/redeploy loses all orders. Vercel cold starts wipe everything.
3. **Admin page has zero auth** - `/admin/orders` shows all customer data to anyone. Privacy violation risk.
4. **Stripe webhook is a no-op** - No signature verification, no order status updates. Payment confirmations ignored.
5. **Email adapter logs to console** - No real emails sent. No transactional notifications.

## Secondary Blockers (Should Fix Before Launch)

6. **ESLint CI failure** - `npm run lint` fails locally and will fail in CI. ESLint 9 flat config incompatibility.
7. **Storage adapter not wired into delivery flow** - Exists but never called. Delivery artifacts are dead fields.
8. **No tests** - Zero test coverage. No safety net.
9. **Branch split** - `fix-cleanup` has design refinements, `main` has initial commit. Unclear deployment target.

## Service Definition Changes Needed

The current service is narrowly framed as "AI project audit for codebases." Every customer-facing asset needs broadening:

- **README.md** - Says "codebase audits and build plans for developers" -> too narrow
- **app/page.tsx** - Landing page copy targets only "developers with codebases"
- **docs/business/01_company_overview.md** - Narrowly positioned
- **docs/business/02_service_offers.md** - Three tiers only for codebase audit
- **docs/sales/01_positioning.md** - Target customer = developers only
- **IntakeForm** - Fields only capture repoUrl, projectSummary - needs broader audit types
- **Order types** - IntakeData has no audit category, no context type (business/personal/local/dev/deployment)

## Corpus/Knowledge-Base Changes Needed

No internal audit knowledge base exists. Need to create `docs/corpus/` with:
- Audit taxonomy (categories, subcategories, classification rules)
- Common AI use/failure patterns across business, personal, local, dev, and deployment contexts
- Recommendation framework
- Report generation methodology

## Implementation Order

1. **Merge fix-cleanup to main** - Unify the codebase
2. **Fix ESLint** - CI should pass
3. **File-based persistence** - JSONL or SQLite-backed DB (fastest honest persistence, no external deps)
4. **Stripe Checkout integration** - Install stripe package, implement real checkout sessions
5. **Stripe webhook with signature verification** - Real webhook handling, order status updates
6. **Admin authentication** - Simple token-based via middleware or secret route
7. **Email adapter** - Pluggable interface with console fallback, ready for Resend/SendGrid
8. **Wire storage into delivery flow** - Local storage for now, S3 adapter documented as pending
9. **Service expansion** - Update types, intake, landing page, docs for broader AI audit
10. **Package refactor** - Reframe tiers around broader audit categories
11. **Corpus creation** - 10 foundational docs
12. **Boundary documentation** - What we do/don't do
13. **Tests** - Order creation, status transitions, webhook validation, intake validation

## What Will NOT Be Touched in This Phase

- No multi-tenant or SaaS architecture
- No user authentication/customer logins
- No custom admin dashboard (beyond the existing order list + auth)
- No PDF generation
- No analytics
- No Stripe account creation (manual owner action)
- No email provider account creation (manual owner action)
- No domain registration
- No actual deployment to Vercel (code will be deploy-ready, deployment is manual)
- No Vercel, Supabase, or S3 account creation
