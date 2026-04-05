# Manual Account Setup Checklist

## Accounts the Owner Must Create Manually

These cannot be automated. Platform terms require human creation and identity verification.

### 1. Primary Email (Google Account / Gmail)

- [ ] Create Google Account (or sign in with existing)
- [ ] Enable 2FA
- [ ] (Optional) Set up Google Workspace for professional email ($8.40/mo)
- [ ] Verify recovery email and phone number

**Data needed:** Desired email address, recovery email, phone number

**What Hermes can configure afterward:** Email templates, routing rules, filters, aliases

---

### 2. GitHub

- [ ] Create GitHub account (MUST be human -- bots are prohibited)
- [ ] Enable 2FA
- [ ] Create the service repository
- [ ] Create a fine-grained Personal Access Token for Hermes with scoped permissions
- [ ] (Optional) Create a machine account for repo access (created by you, used by Hermes)

**Data needed:** Username, email, 2FA method

**What Hermes can configure afterward:** Repos, PRs, issues, Actions config, branch protection rules

---

### 3. Vercel

- [ ] Create Vercel account (link to GitHub)
- [ ] Upgrade to Pro plan ($20/mo) -- Hobby is non-commercial
- [ ] Create the project for the audit service
- [ ] Generate an access token for Hermes (scoped to this project only)
- [ ] Configure custom domain (if using one)

**Data needed:** GitHub account to link, payment method

**What Hermes can configure afterward:** Environment variables, deployments, domain config, project settings

---

### 4. Stripe

- [ ] Create Stripe account
- [ ] Complete KYC verification (legal entity, representative info)
- [ ] Link bank account for payouts
- [ ] Create Products for: Audit Lite ($75), Audit Standard ($120), Audit + Scaffold ($150)
- [ ] Create Prices for each product
- [ ] Generate restricted API key for Hermes (read/write orders, no payout access)
- [ ] Configure webhook endpoint pointing to `/api/stripe-webhook`

**Data needed:** Legal name/entity, SSN/EIN (US) or equivalent, bank account, business address

**What Hermes can configure afterward:** Products, prices, checkout links, order queries (not payouts)

---

### 5. OpenAI / ChatGPT

- [ ] Subscribe to ChatGPT Plus ($20/mo) or Pro ($200/mo)
- [ ] Enable 2FA
- [ ] Set up billing preferences
- [ ] Note: Codex CLI or ChatGPT Codex mode will be used for audit analysis

**Data needed:** Payment method, phone for verification

**What Hermes can configure afterward:** Nothing directly -- operates within your sessions

---

### 6. Domain Registrar (if using custom domain)

- [ ] Register domain (Namecheap, Cloudflare, Google Domains, etc.)
- [ ] Configure DNS records (CNAME to Vercel)
- [ ] Enable domain lock and 2FA on registrar account

**Data needed:** Domain name, payment method, WHOIS contact info

**What Hermes can configure afterward:** DNS record updates (via API if supported by registrar)

---

### 7. Business Bank Account

- [ ] Open a separate business bank account (or dedicated personal account for business)
- [ ] Link to Stripe for payouts
- [ ] Set up separate tracking for business income/expenses

**Data needed:** Depends on jurisdiction and bank requirements

**What Hermes can configure afterward:** Nothing. Hermes should never have any access to banking.

---

## After Setup is Complete

Once all accounts are created, provide Hermes with:
1. GitHub PAT (fine-grained, repo-scoped)
2. Vercel access token (project-scoped)
3. Stripe restricted API key (no payout access)
4. Email API key (once configured)
5. Environment variables (via Vercel dashboard or .env.local)

Then run the bootstrap script: `./scripts/bootstrap.sh`
