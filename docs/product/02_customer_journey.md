# Customer Journey

## Stage 1: Visitor (Discovery)

**Where they come from:**
- Direct outreach (DMs, emails, posts — see docs/sales/02_outreach_templates.md)
- Referrals from past customers
- Organic (SEO, social posts, GitHub profile)

**What they see:**
- Landing page explaining the service in plain language
- Three clear pricing tiers with deliverables listed
- FAQ addressing common concerns
- No signup wall, no demo requests, no calendar booking

**Conversion trigger:** Clicking "Get This Audit" on their chosen tier

---

## Stage 2: Buyer (Payment)

**What happens:**
- Clicked CTA redirects to Stripe Checkout
- Stripe handles payment securely (we never touch card data)
- On success: redirect to intake form with order ID pre-filled

**Key design principle:** Minimum friction between "I want this" and "I paid for this." No account creation, no email verification before payment.

---

## Stage 3: Intake (Information Gathering)

**What they do:**
- Fill out intake form (name, email, repo URL, project summary, goals, constraints, package)
- Acknowledge private repo handling policy
- Submit

**What happens next:**
- They see a confirmation page: "We got your order. You'll hear from us within 24 hours."
- They receive a confirmation email with their order summary
- Order appears in admin panel with status `intake-complete`

**SLA clock starts ticking at this point.**

---

## Stage 4: Audit (The Work)

**What happens (mostly Hermes-operated):**
1. Hermes fetches/clones the repository
2. Runs analysis: dependencies, structure, security scan, architecture inference
3. Generates prioritized findings
4. Creates report (markdown first, then PDF)
5. For Scaffold tier: creates PR with repo hygiene improvements
6. Updates order status to `review`
7. Notifies owner

**Customer doesn't see anything during this stage.** That's by design — they paid for results, not visibility into the process.

---

## Stage 5: Delivery

**What happens:**
- Owner reviews the report (brief quality check)
- Hermes sends delivery email with:
  - Report attached (PDF)
  - Markdown version linked
  - PR link (scaffold tier)
  - "Reply to this email within 7 days with follow-up questions"
- Order status changes to `delivered`

**What the customer experiences:**
- Clean email with the deliverable
- Clear next steps
- Defined follow-up window (no open-ended ambiguity)

---

## Stage 6: Follow-Up

**During the 7-day window:**
- Customer can reply with clarifying questions
- Hermes drafts responses for owner review
- Owner approves and sends

**After the window closes:**
- Order status changes to `archived`
- Customer is directed to paid retainer if they need more help
- Upsell offers are presented (implementation sprint, CI/CD setup)

---

## Re-engagement

**When it happens:**
- Customer has shipped something new
- Customer has another project
- Customer knows someone else who needs an audit

**How:**
- Follow-up email at 14 days ("Have you shipped anything since your audit?")
- Follow-up email at 60 days ("Need another audit?")
- Referral incentive (future, optional)
