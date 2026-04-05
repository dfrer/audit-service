# AI Audit Report Template

## Report Structure

Every audit report follows this consistent format. Adjust depth based on tier:
- **Lite**: Executive Summary + Top 5 Findings + Prioritized Action Plan
- **Standard**: Full report with all sections
- **Scaffold**: Full report + implementation artifacts

```markdown
# AI Audit Report -- {client_name_or_project}

**Audit Category:** {category}
**Package:** {tier}
**Order ID:** {order_id}
**Date:** {date}

---

## Executive Summary

{Brief 3-4 sentence overview of findings. Focus on the 2-3 most critical issues and the top recommendation.}

**Key metrics:**
- **Audit scope:** {what was audited}
- **Findings:** {total} ({critical} critical, {high} high, {medium} medium, {low} low)
- **Estimated savings/impact:** {cost, time, or risk reduction}

---

## Context & Scope

{What the client described in the intake. This section confirms we understood their situation.}

**What they are using AI for:** {from intake}
**Tools/platforms identified:** {list}
**Stated goals:** {from intake goals}
**Stated constraints:** {from intake constraints}

---

## Findings

Each finding includes:
1. **Title** -- what the issue is
2. **Severity** -- CRITICAL, HIGH, MEDIUM, LOW, or INFO
3. **Summary** -- 2-3 sentences describing the finding
4. **Evidence** -- concrete details from the audit (screenshots, data, examples)
5. **Impact** -- cost, risk, time, or quality impact
6. **Recommendation** -- specific, actionable recommendation
7. **Est. effort** -- time required to address (hours/days)

### 1. [Finding Title] -- {severity}

{summary}

**Evidence:**
{concrete evidence}

**Impact:**
{cost, risk, time}

**Recommendation:**
{specific recommendation}

**Effort:** {time estimate}

---

## Prioritized Action Plan

{Numbered list ordered by impact/urgency. Each item maps to a finding above.}

### Week 1: {theme -- e.g., "Cost Control"}
1. [{Finding ID}] {Action} -- {est effort}
2. [{Finding ID}] {Action} -- {est effort}

### Week 2-3: {theme -- e.g., "Workflow Cleanup"}
3. [{Finding ID}] {Action} -- {est effort}
4. [{Finding ID}] {Action} -- {est effort}

### Month 1: {theme -- e.g., "Systematic Improvement"}
5. [{Finding ID}] {Action} -- {est effort}
6. [{Finding ID}] {Action} -- {est effort}

### Optional / Future
{Lower-priority items that improve the setup but are not urgent}

---

## Appendix

### Tool Inventory
{Complete list of tools identified, with usage assessment}

### Cost Analysis
{Current cost vs optimized cost, if available}

### References
{Links to relevant docs, alternatives, migration guides}
```

## Delivery Process

### 1. Generate
- Use the audit-generation prompt in prompts/ with intake data
- Review generated findings against corpus documents for accuracy
- Ensure each finding has evidence, not speculation

### 2. Review (Human Gate E)
- Owner reviews the report before delivery
- Checks: accuracy, tone (factual not judgmental), actionability
- Verify findings are specific to the client's actual setup

### 3. Deliver
- Save report to storage: `./storage/deliveries/{order_id}/audit-report.md`
- Convert to PDF: `./storage/deliveries/{order_id}/audit-report.pdf`
- Update order status to "delivered"
- Send delivery email via sendEmail()

### 4. Follow-Up
- Standard/Scaffold: follow up 7 days after delivery
- Ask if findings were actionable, if anything was unclear
- Offer implementation help as a separate engagement

## Quality Standards

- Every finding must be specific -- no generic advice
- All recommendations must be actionable within the stated effort estimate
- Severity ratings must match the impact/cost/risk
- Reports should be 8-15 pages (Standard), 5-8 pages (Lite)
- Write for the client's technical level as indicated in intake
- Tone: factual, direct, helpful -- not judgmental