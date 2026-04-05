# Audit Report Method
## How to Structure Audit Reports Consistently

### Report Structure

Every audit report follows this structure:

```
# AI Audit Report -- [Client/Project Name]
# [Audit Category]: [Specific Category from Taxonomy]
# Package: [Lite/Standard/Scaffold]
# Date: [YYYY-MM-DD]
# Order ID: [ord_xxx]

## Executive Summary
### Context
[Brief description of what was audited and why]

### Key Findings (TL;DR)
1. [Finding] -- [Severity]
2. [Finding] -- [Severity]
3. [Finding] -- [Severity]

## Detailed Findings

### Finding [ID]: [Title]
- **Category:** [from taxonomy]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW / INFO
- **What Is Happening:** [description]
- **Impact:** [concrete impact: time, money, risk]
- **Evidence:** [specific items from the audit]
- **Recommendation:** [actionable recommendation]
- **Effort:** [time estimate: hours/days]
- **Metric:** [how to measure improvement]

## Prioritized Action Plan

### Immediate (This Week)
- [Item 1] -- [Finding ID]
- [Item 2] -- [Finding ID]

### Short-Term (Next 2 Weeks)
- [Item 3] -- [Finding ID]
- [Item 4] -- [Finding ID]

### Medium-Term (Next Month)
- [Item 5] -- [Finding ID]
- [Item 6] -- [Finding ID]

### Optional / Nice to Have
- [Item 7] -- [Finding ID]

## Appendix
### Tools Analyzed
[List of tools/services assessed]

### References
[Links to documentation, policies, relevant resources]
```

### Writing Principles

1. **Finding-first:** Start with what is wrong, not generalities.
2. **Severity-tagged:** Every finding has a severity level from the taxonomy.
3. **Concreteness over abstraction:** "You pay $47/month for Jasper but last used it 6 weeks ago" beats "You have underutilized subscriptions."
4. **Actionable over advisory:** "Cancel these 3 tools" beats "Review your subscriptions."
5. **Evidence-backed:** Every finding points to specific evidence from the audit.
6. **Prioritized:** The action plan is ordered by impact/effort ratio.
7. **Honest:** Include "this is fine" assessments too, not just problems.

### What Every Audit Must Include

Regardless of category or package tier:
- A prioritized action plan
- Cost analysis (current spend vs optimized spend)
- At least one finding in each of: cost, workflow, risk (even if the finding is "this is fine")

### Lite vs Standard vs Scaffold Differences

**Lite:** Executive summary + key findings + prioritized action plan. Concise.
**Standard:** Lite + detailed findings with evidence + effort estimates + cost projection.
**Scaffold:** Standard + implementation artifacts (code configs, setup scripts, PR templates).
