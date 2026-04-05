# Approval Gates

## Gate Definitions

### Gate A: Root Account Creation
**Trigger:** Any attempt to create a new account on GitHub, Vercel, Stripe, OpenAI, Google Workspace, domain registrar, or bank
**Who approves:** Human owner (must create manually)
**Why:** Platform terms prohibit bot-created accounts. GitHub explicitly forbids it. Identity verification requires the actual human.
**Action:** Documented as a checklist item — not automated.

### Gate B: Billing/Payout Changes
**Trigger:** Changing Stripe products/prices, updating payout bank account, modifying Vercel plan, changing OpenAI plan
**Who approves:** Human owner
**Why:** Financial changes affect revenue and could lock funds or trigger KYC reviews.
**Action:** Hermes drafts the change; owner reviews and executes, or approves Hermes to execute via API.

### Gate C: Destructive Deletes
**Trigger:** Deleting orders, reports, customer data, repositories, Vercel deployments, or Stripe records
**Who approves:** Human owner
**Why:** Irreversible. Could cause data loss, compliance issues, or customer trust damage.
**Action:** Hermes flags the action; owner approves before execution. Data backups should exist before deletion.

### Gate D: Credential Rotation
**Trigger:** Rotating API keys, changing GitHub PATs, updating Stripe keys, refreshing Vercel tokens
**Who approves:** Human owner
**Why:** Compromised credentials need immediate rotation. Scheduled rotation should not break operations.
**Action:** Owner rotates the credential at the provider; Hermes receives the new value via environment update. Hermes can recommend rotation on a timeline.

### Gate E: Quality Gate (Deliverables)
**Trigger:** Before any audit report is sent to a customer
**Who approves:** Human owner
**Why:** The human owner is responsible for deliverable quality. Hermes drafts; owner reviews.
**Action:** Hermes generates the report and puts it in `review` status. Owner reads it, approves or requests changes. On approval, Hermes sends.

### Gate F: Platform-Risk Actions
**Trigger:** Any action that could trigger account flags, suspension, or terms-of-service enforcement (e.g., high-volume automated activity, scraping, bulk API calls)
**Who approves:** Human owner
**Why:** If an account gets flagged, the business stops. Prevention is critical.
**Action:** Hermes estimates risk level. If risk is non-trivial, owner decides whether to proceed.

## Quick Reference

| Gate | What | Owner Does | Hermes Does |
|---|---|---|---|
| A | Create accounts | Create manually | Documents the checklist |
| B | Billing changes | Approve or execute | Drafts the proposal |
| C | Delete data | Approve | Identifies what to delete and why |
| D | Rotate secrets | Rotate at provider | Recommends schedule, detects need |
| E | Send deliverables | Review and approve | Generates the report |
| F | Risk actions | Decide | Estimates risk, waits |

## What Hermes Can Do Without Approval

Everything not listed above. Specifically:
- Analyze codebases
- Generate reports
- Update order statuses
- Create PRs on allowed repos
- Trigger deployments within scope
- Draft emails and communications
- Run scheduled maintenance
- Check dependencies for updates
- Monitor uptime and log errors
