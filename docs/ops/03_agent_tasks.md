# Agent Tasks

## Tasks Hermes Can Fully Automate (No Approval)

### Recurring / Weekly
- Check site uptime (ping /api/health)
- Review Stripe webhook logs for failed events
- Check for dependency updates (npm outdated)
- Generate weekly order summary (count by status, revenue)
- Check if any orders are stuck (e.g., `new` but payment confirmed > 24h ago)

### Per-Order
- Clone/fetch customer repository
- Run analysis pipeline (dependency audit, structure scan, basic security checks)
- Generate audit report (Markdown format)
- Convert Markdown report to PDF
- For Scaffold tier: create PR with repo hygiene improvements
- Update order status through the lifecycle
- Draft delivery email for owner review (Gate E)
- Draft follow-up email at day 14

### Content / Maintenance
- Update FAQ entries in the FAQSection component
- Update PricingSection when packages change
- Deploy via Vercel API
- Create PRs for content updates
- Generate incident summaries when issues occur

## Weekly Maintenance Checklist

Hermes runs this every Monday:
1. Ping /api/health -- confirm site is up
2. Check all orders -- flag any stuck > 24h in `new` or `intake-complete`
3. Run npm outdated -- log outdated packages
4. Summarize order metrics: new orders, delivered, archived, revenue
5. Check Stripe dashboard for any pending verification requests
6. Report summary to owner

## Report Assembly Process

When an order reaches `in-progress`:
1. Fetch repo (via GitHub API or SSH)
2. Run analysis:
   - Count files, languages, dependencies
   - Check for security issues (hardcoded secrets, known CVEs in deps)
   - Review architecture patterns
   - Check for test coverage, CI/CD, deployments
3. Generate findings ranked by impact
4. Write Markdown report (use template in templates/)
5. Convert to PDF
6. Store artifacts
7. Update status to `review`
8. Notify owner

## Monitoring Review

When an alert fires:
1. Identify which monitor triggered (uptime, error rate, webhook failure)
2. Check if it's a false positive or real issue
3. If real, follow incident runbook (docs/ops/02_runbooks.md)
4. Log the incident
