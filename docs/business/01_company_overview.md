# Company Overview

## What This Company Is

A productized service business that delivers **AI project audits and build plans** to developers and small teams. Customers receive a practical, prioritized execution plan and optionally a baseline repository scaffold so they can ship with confidence.

## What It Sells

- **Audit Lite ($75)** — Risk list, recommended stack, top 10 fixes, 2-week plan
- **Audit Standard ($120)** — Everything in Lite + 30-day plan, architecture diagram, CI/CD baseline, effort estimates
- **Audit + Scaffold ($150)** — Everything in Standard + one PR adding repo hygiene, deployment skeleton, production checklist

## Who It Serves

- Solo developers and small teams who have started building something but feel stuck
- Founders with a repo full of code but no clear path to production
- Teams accumulating tech debt who need an outside perspective on what matters
- Anyone who wants "a plan I can actually follow" instead of vague advice

## Why the Model Is Lean

This is a **productized consulting pipeline**, not a SaaS. There are no user accounts, no dashboards, no real-time features, no multiplayer coordination. Each order follows a fixed flow: purchase -> intake -> audit -> delivery. The simplicity keeps costs low and execution fast.

**Monthly fixed costs at minimum viable scale:**
- ChatGPT Plus: $20/mo (sufficient to start)
- Vercel Pro: $20/mo (required for commercial use)
- Total: **$40/mo** fixed + Stripe processing fees (~2.9% + $0.30)

The service breaks even at 2-3 audits per month. Anything above that is profit or reinvestment.

This is intentional. The goal is to validate demand before adding complexity.

## Ownership Model

- **Human owner** controls all root accounts: email, GitHub, Vercel, Stripe, OpenAI billing, domain registrar, bank account
- **Hermes** acts as operator/implementer/admin assistant with scoped tokens
- All root credentials remain human-owned; Hermes receives fine-grained, revocable tokens
- Any action that touches identity, money, deletion, or credentials requires explicit human approval
- The human owner can revoke any Hermes token at any time without losing the business identity
- Hermes cannot create root accounts (platform terms prohibit bot-created accounts, especially GitHub)
- This structure is enforceable and platform-compliant — not a theoretical arrangement
