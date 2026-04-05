# Runbooks

## Launch Runbook

**Prerequisites:**
- [ ] Human owner has created: GitHub account, Vercel account, Stripe account, OpenAI account, domain (if using)
- [ ] Human owner has configured: Stripe products/prices, Vercel project, GitHub repository
- [ ] Environment variables are set (see .env.example)
- [ ] Domain DNS is configured (if using custom domain)

**Steps:**
1. Deploy to Vercel: `vercel --prod`
2. Configure Stripe webhook endpoint pointing to `/api/stripe-webhook`
3. Set Stripe webhook secret in env: `STRIPE_WEBHOOK_SECRET`
4. Test payment flow with Stripe test mode
5. Test intake form submission
6. Verify order creation in admin
7. Test delivery flow (manual)
8. Switch Stripe to live mode
9. Disable test mode in environment: `NEXT_PUBLIC_STRIPE_MODE=live`
10. Monitor first real order closely

**Rollback plan:** Deploy previous working build via `vercel rollbacks` if issues arise.

---

## New Order Runbook

**Trigger:** Stripe webhook confirms payment -> order created with status `new`

1. Verify order record exists in admin
2. Check that redirect to intake form works (order ID pre-filled)
3. When intake form is submitted -> status changes to `intake-complete`
4. Hermes picks up order:
   - Clone/fetch repository
   - Run analysis pipeline
   - Generate report
   - Update status to `review`
5. Owner reviews report (Quality Gate E)
6. Owner approves -> Hermes delivers
7. Status changes to `delivered`
8. Follow-up timer starts (7 days)

---

## Delivery Runbook

**Trigger:** Order reaches `review` status, owner approves

1. Hermes renders final report (PDF + markdown)
2. Hermes stores report in delivery artifact location
3. Hermes sends delivery email to customer:
   - Subject: "Your [Package Name] audit is ready"
   - Body: See docs/product for delivery email template
   - Attachments: PDF report, markdown link
4. Update order status to `delivered`
5. Log delivery timestamp
6. Schedule follow-up email for day 14
7. Schedule archival for day 14 if no issues

---

## Incident Runbook

**Trigger:** System error, payment failure, delivery failure, customer complaint

1. Identify the incident
2. Check order records for affected orders
3. If payment failed: Stripe should retry automatically; notify customer if failed permanently
4. If delivery failed: Re-run delivery; if still failing, notify owner
5. If customer complaint: Forward to owner for resolution decision
6. Log incident with timestamp, description, resolution
7. If incident is systemic: Pause new order processing until root cause is fixed

**Communication:**
- Customers affected by payment issues: "There was an issue processing your payment. Please contact us."
- Customers affected by delivery delays: "Your audit is taking longer than expected. We'll have it to you by [new date]."
- Never blame technical issues — take responsibility and provide a new timeline.

---

## Rollback Runbook

**Trigger:** Bad deployment, broken feature, corrupted data

1. Identify what's broken
2. If code issue: Deploy last known good build
   - Via Vercel dashboard: Deployments -> Promote last good deployment
3. If data issue: Restore from backup (if Supabase) or fix manually
4. Verify rollback by testing the broken flow
5. Notify any affected customers
6. Document the incident and what caused it
7. Fix the root cause before attempting to re-deploy
