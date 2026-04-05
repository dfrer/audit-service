# Access Model

## Root Accounts vs Scoped Tokens

### Never Share Root Credentials

Root credentials (login + password + 2FA) are NEVER stored in the repository, NEVER shared with Hermes, and NEVER used for API operations. The human owner creates and manages root accounts.

### Scoped Tokens for Hermes

Hermes operates exclusively through scoped, revocable tokens:

| System | Token Type | Scope | Rotation |
|---|---|---|---|
| GitHub | Fine-grained Personal Access Token | Repo-scoped, read-only on customer repos, write access only to the service's own repos | Quarterly |
| Vercel | Access Token | Project-scoped to the audit service only | Quarterly |
| Stripe | Restricted API Key | Create/read orders, products, prices — no payout access | Quarterly |
| Email | API Key (Resend/SendGrid) | Send-only to verified domain | Quarterly |

### Why This Model

- If a Hermes token is compromised, the attacker gets limited access to one system at a limited scope
- The human owner can revoke any token without affecting any other system
- The business identity (accounts, domain, bank) remains intact
- This is the minimum-viable security posture for an agent-operated system

## Approval Gates

See [Approval Gates](./02_approval_gates.md) for the complete list. In summary:

- **Gate A:** Root account creation
- **Gate B:** Billing/payout changes
- **Gate C:** Destructive deletes
- **Gate D:** Credential rotation
- **Gate E:** Quality gate (deliverables before sending)
- **Gate F:** Actions that could trigger platform flags

## Secret Handling

1. Secrets are NEVER committed to the repository
2. `.env.local` is in `.gitignore`
3. Environment variables are set via Vercel dashboard (or CI secrets for GitHub Actions)
4. Stripe webhook secrets, API keys, and database URLs are all environment-only
5. Hermes reads secrets from environment at runtime; it does not write or store them
6. If a secret is suspected to be compromised:
   - Owner rotates the secret immediately
   - Old secret is revoked at the provider level
   - Hermes receives the new secret via environment variable update
   - The compromise is logged

## No Credential Sharing

This is not a formality — it's a security boundary:
- Hermes does not know the human owner's passwords
- The human owner should not reuse passwords across services
- 2FA is required on all root accounts
- Hermes has no ability to create new accounts on platforms (GitHub explicitly prohibits this)

## Least Privilege Principles

1. Every token is scoped to the minimum permissions needed
2. Tokens are not shared between services
3. Production and development use separate tokens where possible
4. Token scopes are reviewed during quarterly rotation
5. If Hermes needs elevated access temporarily, the owner grants it and the token is revoked afterward
