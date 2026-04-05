---
title: "Business Model -- AI Audit Service"
updated: "2026-04-06"
---

# Business Model

## Revenue

### Primary Revenue: Audit Services

| Package | Price | Margin (after platform costs) |
|---------|-------|-------------------------------|
| AI Audit Lite | $75 | ~$70 (after ~$3 Stripe + platform) |
| AI Audit Standard | $120 | ~$114 |
| AI Audit + Roadmap | $150 | ~$143 |

### Add-On Revenue

| Add-On | Price |
|--------|-------|
| Follow-up Audit (30-90 days later) | $50 |
| Team Audit (3-5 people) | $300 |
| Emergency Review (24h turnaround) | $150 |
| Implementation Sprint | Custom |

### Revenue Scenarios

| Orders/Month | Avg Package | Gross Revenue | Annual |
|--------------|-------------|---------------|--------|
| 5 | $100 | $500/mo | $6,000 |
| 10 | $100 | $1,000/mo | $12,000 |
| 20 | $100 | $2,000/mo | $24,000 |

At 20 orders/month, this is side-income level for a single operator working a few hours per audit. At 40+/month, it approaches full-time equivalent.

## Costs

### Fixed Monthly Costs

| Item | Cost | Required? |
|------|------|-----------|
| Vercel Pro | ~$20/mo | Recommended |
| Domain | ~$12/year | Yes |
| Platform costs | $0 | Until scale |

Total fixed: ~$21/mo if using Vercel Pro and a domain.

### Variable Costs

| Item | Cost |
|------|------|
| Stripe per transaction | ~2.9% + $0.30 |
| Email (Resend free tier) | $0 for 3,000/mo |
| Storage (JSONL) | $0 |
| Supabase (if used later) | $25/mo from Free tier |

### Platform Costs Scenarios

| Plan | Monthly Cost | Max Bandwidth |
|------|--------------|---------------|
| Vercel Hobby | $0 | 100GB |
| Vercel Pro | $20 | - |
| Supabase Free | $0 | 500MB database |
| Supabase Pro | $25 | 8GB database |

## Break-Even

- At Hobby plan ($0 fixed): Every order is profit after Stripe fees
- At Pro plan ($45/mo with Supabase): Break-even at ~1 order/month
- At Pro plan + Resend Pro ($35/mo email): Break-even at ~2 orders/month

## What This Service Is NOT

- **Not a consultancy:** No custom engagements, no hourly billing, no scope creep
- **Not a SaaS:** No user accounts, no subscriptions, no dashboards
- **Not an AI agency:** We do not build custom AI applications
- **Not a training company:** We audit, we do not teach
- **Not a managed service:** We do not run or maintain systems

The business works because it is scoped, priced, and delivered as a product -- not a service contract.

## Constraints

1. **Single operator + agent:** Cannot handle more audits than one person can review and deliver
2. **Fixed price only:** No custom pricing per engagement
3. **Human review gate:** Every delivered audit is reviewed by the owner before sending
4. **No paid ads initially:** Growth through direct outreach, word of mouth, and content
5. **Platform dependency:** Dependent on Stripe, Vercel, email provider -- all have outage risk

## Growth Path

1. **Months 1-3:** 5-10 audits/month via direct outreach. Validate pricing and process.
2. **Months 4-6:** Refine packages based on actual demand. Add team audit and follow-up audits.
3. **Months 6-12:** Scale to 15-20 audits/month. Consider hiring a second analyst if demand exceeds capacity.
4. **Year 2:** Productize findings into templates, guides, or a course. Higher margin, same audience.

## Pricing Rationale

$75/$120/$150 pricing is intentional:
- Low enough to be a low-risk purchase decision
- High enough to signal quality (not a $20 Fiverr gig)
- Spread covers the value difference between tiers
- Implementation sprint is separate engagement (higher value, custom priced)

Prices can be adjusted after 20+ orders based on:
- Actual time per audit (if too low, raise)
- Demand vs capacity (if always maxed, raise)
- Customer feedback on perceived value