# Handoff Protocol

## How Future Agents Should Read This Project

### First 5 Files to Read
1. `README.md` -- Project overview and quick start
2. `docs/business/01_company_overview.md` -- What the company is and does
3. `docs/ops/01_operator_model.md` -- What Hermes can and cannot do
4. `docs/security/02_approval_gates.md` -- Approval gates (non-negotiable)
5. `app/.env.example` -- What configuration is needed

### Key Directories to Understand
- `docs/` -- All documentation. Read here before making business decisions.
- `app/app/` -- Next.js app router pages and API routes.
- `app/components/` -- React components for the frontend.
- `app/lib/` -- TypeScript types, database interface, integration adapters.
- `scripts/` -- Operational scripts (bootstrap, seed, export, maintenance).
- `prompts/` -- Agent prompt templates for audit generation, scaffolding, etc.

## How to Work Safely

### Do
- Read existing documentation before making changes
- Follow the approval gates (docs/security/02_approval_gates.md)
- Use the database interface, not direct Map/database manipulation
- Update documentation when you change behavior
- Test changes locally before anything goes to production
- Use `./scripts/bootstrap.sh` to verify the environment is configured

### Do Not
- Commit secrets or .env.local
- Change approval gates without owner agreement
- Delete order records or customer data without approval (Gate C)
- Change Stripe payout/bank settings (Gate B)
- Modify root account configurations
- Rotate credentials without owner approval (Gate D)

## When Something Is Broken

1. Read the incident runbook (docs/ops/02_runbooks.md)
2. If rollback is needed, use the rollback runbook
3. Never guess -- if uncertain, flag for owner review
4. Log everything

## Context for New Agents

If you are a new agent reading this for the first time:
- This is a productized service business, not a SaaS
- The human owner controls all root accounts
- You operate with scoped tokens
- The service sells audit deliverables, not AI access
- Keep everything lean and practical -- do not over-engineer
- When in doubt, ask the owner
