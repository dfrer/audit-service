# Business Model

## Revenue Logic

Revenue = Number of audits per month x Average price per audit

**Revenue scenarios:**
| Audits/mo | Mix | Gross Revenue | Stripe Fees (~3%) | Net Revenue |
|---|---|---|---|---|
| 3 | 2x Lite + 1x Standard | $270 | ~$8 | ~$262 |
| 5 | 2x Lite + 2x Standard + 1x Scaffold | $615 | ~$18 | ~$597 |
| 10 | 3x Lite + 4x Standard + 3x Scaffold | $1,290 | ~$38 | ~$1,252 |

Upsell conversion (implementation sprints) would add $350–$900+ on top.

## Cost Logic

**Fixed monthly costs (conservative start):**
- ChatGPT Plus: $20
- Vercel Pro: $20
- **Total fixed: $40**

**Fixed monthly costs (realistic/proper stack):**
- ChatGPT Pro: $200
- Vercel Pro: $20
- Supabase Pro: $25
- Google Workspace: $8.40
- **Total fixed: $253.40**

**Variable costs:**
- Stripe: 2.9% + $0.30 per transaction
- OpenAI credits (if needed): $0.04/credit reference rate
- Domain: ~$12/year

## Pricing Assumptions

- Prices are set to be credible while remaining accessible to solo developers
- Each audit is scoped to be completable within SLA without overworking
- Pricing is deliberately low enough to remove purchase friction but high enough to signal quality
- These are starting prices — they can increase after demand is validated

## Constraints

- Vercel Hobby is non-commercial — Pro is required from day one ($20/mo)
- GitHub bot-created accounts are prohibited — root must be human-created
- Stripe requires KYC — the human owner must complete identity verification
- OpenAI ToS prohibits sharing credentials and reselling access — the service sells *deliverables*, not AI access
- The human owner must maintain their own backups; Vercel does not guarantee them

## What This Is NOT

- NOT a SaaS with user accounts and dashboards
- NOT a marketplace connecting clients to freelancers
- NOT a consulting firm (too much scope creep)
- NOT an agency (no team scaling)
- NOT an AI tool reseller (violates OpenAI ToS)
- NOT a get-rich-quick scheme — this is a real service with real costs and real SLAs

## Break-Even Analysis

At the conservative $40/mo stack:
- Need ~2 Lite audits/mo to break even
- Need ~1 Scaffold audit/mo to break even

At the realistic $253.40/mo stack:
- Need ~4 Lite audits/mo to break even
- Need ~2 Scaffold audits/mo to break even

**Recommended path:** Start conservative. Upgrade to Pro + proper stack when demand proves you're hitting limits.
