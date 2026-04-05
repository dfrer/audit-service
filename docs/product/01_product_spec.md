# Product Specification

## Service Flow

```
Visitor -> Landing Page -> Select Package -> Stripe Checkout -> Intake Form -> 
Hermes Audit Pipeline -> Deliverables Generated -> Delivery Email -> Follow-up Window
```

## States

### Order States

| State | Description | Trigger |
|---|---|---|
| `new` | Payment completed, awaiting intake | Stripe webhook confirms payment |
| `intake-complete` | Intake form submitted | Customer submits intake |
| `in-progress` | Audit is being performed | Hermes begins audit |
| `review` | Draft ready, pending owner review | Hermes completes audit |
| `delivered` | Report sent to customer | Delivery email sent |
| `archived` | Order closed (follow-up window expired) | 7 days post-delivery, no open issues |

### Edge Cases

| Edge Case | Handling |
|---|---|
| Customer pays but doesn't submit intake | Reminder email at 48h, archive at 14 days |
| Repo is inaccessible (private, no invite) | Email customer with instructions; pause SLA clock |
| Repo is empty or non-standard | Ask customer for clarification; pause SLA clock |
| Customer requests major revision after follow-up window | Offer paid retainer or new audit |
| Refund requested before audit starts | Process refund; archive order |
| Refund requested after delivery | Owner decision on case-by-case basis |

## Inputs

### Intake Form Fields
- Full name (required)
- Email (required, validated)
- Repository URL (required, validated as git URL)
- Project summary (required, 50–1000 chars)
- Goals (optional, what they want to achieve)
- Constraints (optional, timeline, budget, tech preferences)
- Package selection (required: lite / standard / scaffold)
- Private repo handling acknowledgment (required checkbox)

**Private repo handling:** Customer either invites the GitHub machine account as a collaborator for 7 days, OR provides a zip/tarball via a self-hosted link. No password sharing.

## Outputs

### Per Tier
- **Lite:** 5–8 page report with risk list, recommendations, 2-week plan
- **Standard:** 10–15 page report with everything in Lite plus architecture diagram, CI/CD baseline, 30-day plan, effort estimates
- **Scaffold:** Everything in Standard plus one PR with repo hygiene improvements

### File Formats
- PDF (primary deliverable)
- Markdown (for customer reference)
- PR link (scaffold tier only)

## Order Lifecycle

1. Customer clicks "Buy" on landing page
2. Stripe Checkout handles payment
3. On successful payment, create order record with status `new`
4. Redirect to intake form (pre-filled with order ID)
5. Customer submits intake form -> status changes to `intake-complete`
6. Hermes picks up order -> status changes to `in-progress`
7. Hermes generates report -> status changes to `review`
8. Owner reviews (or auto-approves if configured) -> status changes to `delivered`
9. Delivery email sent with report attachment and follow-up instructions
10. After 7-day follow-up window -> status changes to `archived`

## What the MVP Does

- Displays landing page with pricing and FAQ
- Handles Stripe Checkout payments
- Collects intake information via a form
- Stores order records in a lightweight persistence layer
- Provides admin view of orders
- Supports delivery of PDF and markdown reports
- Sends email notifications (via adapter)

## What the MVP Does NOT Do

- User accounts or login
- Real-time dashboards
- Customer-facing order tracking (email-based updates are sufficient)
- Multi-currency support
- Subscription billing
- Automated report generation (Hermes generates reports; the system stores and delivers them)
- Complex admin roles (single owner/operator model)
