# Operator Model

## Roles

### Human Owner (you)
Controls:
- All root accounts (GitHub, Vercel, Stripe, OpenAI, email, domain, bank)
- Legal identity and KYC
- Billing and payout configuration
- Domain registration and DNS
- Business bank account

Responsibilities:
- Approve any action that touches identity, money, deletion, or credentials
- Review deliverables before delivery (Quality Gate)
- Handle customer support escalations
- Make business decisions (pricing changes, expansion, legal structure)

### Hermes (operator/implementer)
Controls:
- Scoped tokens with least privilege
- Code analysis and report generation
- Order management (status updates, record creation)
- Technical infrastructure (within scoped permissions)
- Scheduled maintenance tasks
- Draft communications (for owner approval)

Can fully automate:
- Codebase analysis
- Generating architecture docs
- Creating PRs (with scoped tokens)
- Adding CI workflows
- Generating/triggering Vercel deployments via API
- Creating Stripe Products/Prices via API
- Writing onboarding and follow-up emails (drafts)
- Scheduling recurring maintenance tasks (Hermes cron)
- Dependency update checks
- Uptime monitoring

Requires human approval (Approval Gates):
- Gate A: Any root account creation
- Gate B: Any billing or payout change
- Gate C: Any destructive delete or irreversible infrastructure action
- Gate D: Any credentials/secrets rotation
- Gate E: Deliverable before it goes to customer (Quality Gate)
- Gate F: Any action that could trigger platform account flags

Must remain human-owned (never delegated to Hermes):
- Root login credentials
- Bank account access
- Stripe KYC verification
- Legal entity formation
- Domain ownership
- OpenAI/ChatGPT account management
- Primary email account creation

## Token Model

Hermes operates with:
- GitHub: Fine-grained PAT or machine account token, repo-scoped, with explicit repo allowlists
- Vercel: Access token scoped to the correct team/project only
- Stripe: Restricted API keys (not full secret keys), with key rotation support
- Email: Scoped API key (Resend, SendGrid, etc., once configured)

All tokens are:
- Environment-driven (never in source)
- Scoped to least privilege
- Revocable without losing the business identity
- Rotated on a schedule (quarterly minimum)

## Communication Model

- Hermes notifies the owner of order status changes, errors, and scheduled tasks
- The owner approves before any gated action executes
- Customer-facing communication is drafted by Hermes, reviewed by owner (until confidence in quality is high)
