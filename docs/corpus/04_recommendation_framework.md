# Recommendation Framework
## Principles for Audit Recommendations

When producing recommendations, apply these filters:

### 1. Cost First
Always start with cost. If a tool or subscription is costing money without generating measurable value, the recommendation is to cut it.

- Cancel unused subscriptions
- Downgrade tiers where features are not used
- Consolidate overlapping tools
- Calculate the monthly savings

### 2. Safety Second
Privacy and data handling recommendations come before productivity improvements.

- Classify data (public, internal, sensitive, confidential)
- Map which tools touch which data classes
- Recommend local options for sensitive data
- Flag any tools handling data without clear privacy terms

### 3. Simplicity Over Sophistication
The best recommendation is usually to use fewer things more effectively.

- Fewer tools, used better > more tools, used poorly
- One well-configured AI assistant > 5 mediocres
- Established patterns > constant tool experimentation
- Documented workflows > ad hoc usage

### 4. Practicality Over Theory
Recommendations must be immediately actionable.

- "You should have an AI strategy" is not a recommendation
- "Cancel these 3 subscriptions, keep these 2, use them for X and Y" is
- "Implement proper prompt engineering" is not a recommendation
- "Use this system prompt template for research tasks" is
- Include time estimates for each recommendation

### 5. Maintainability
Recommendations should create systems that last, not setups that break.

- Docker over "just install everything locally"
- Documented configs over "it is set up on my machine"
- Standard tools over niche alternatives that nobody else uses
- Backup strategies for local setups

### 6. Measurable Outcomes
Every recommendation should include how to measure success.

- "This saves $X/month" 
- "This reduces review time by Y%"
- "This eliminates Z tool"
- "This takes N hours to implement"

### Recommendation Structure

Each recommendation follows this format:
```
## [ID]: [Title]
- **Severity:** CRITICAL / HIGH / MEDIUM / LOW / INFO
- **Category:** [from taxonomy]
- **Finding:** What is wrong or suboptimal
- **Impact:** Concrete impact (time, money, risk)
- **Recommendation:** What to do
- **Effort:** Time estimate
- **Metric:** How to verify improvement
```

### What We Do NOT Recommend

- "Explore AI more broadly" -- too vague
- "Adopt a multi-agent architecture" -- over-engineered without evidence it is needed
- "Build a custom model" -- almost never the right answer for business users
- "Invest in AI literacy training" -- not our scope, point to resources
- "Migrate everything to platform X" -- vendor recommendation is a conflict of interest
