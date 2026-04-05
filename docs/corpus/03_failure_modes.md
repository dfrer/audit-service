# Common AI Failure Modes
## Practical Failures in AI Deployments and Usage

### 1. Tool Sprawl
**What it is:** Too many AI tools with overlapping capabilities. Each was adopted independently without coordination.

**Symptoms:**
- Monthly AI spend exceeds $200/month for individual or $1000/month for small teams without clear ROI tracking
- Multiple tools that can do the same thing (e.g., 3 different AI writing tools)
- Nobody can name which tool does what
- Tool adoption happens via individual discovery, not evaluation

**Root cause:** Bottom-up tool adoption without central evaluation or coordination.

**Fix direction:** Consolidate. Assign clear roles. Cancel redundancies.

### 2. Model Mismatch
**What it is:** Using the wrong model or tool for the task. Over-specified or under-specified.

**Symptoms:**
- Running a 70B model locally for a task a 7B model handles fine
- Using Claude for quick factual queries where a search engine is faster
- Paying for API calls that could be cached
- Using a general-purpose model when a specialized tool exists (or vice versa)

**Root cause:** No model-to-task mapping, novelty-driven selection.

**Fix direction:** Map tasks to tools. Use the simplest adequate tool for each job.

### 3. Cost Leakage
**What it is:** Paying more for AI than the value it generates. Subscriptions without usage monitoring.

**Symptoms:**
- ChatGPT Plus used 2x/month but paid $20/month
- 5 team seats, 1 active user
- No idea what total AI spend is per month
- Auto-renewing subscriptions nobody reviews

**Root cause:** Set-and-forget subscriptions, no usage-to-value measurement.

**Fix direction:** Audit subscriptions quarterly. Tie to usage data.

### 4. Privacy Negligence
**What it is:** Feeding sensitive data into AI tools without understanding data handling.

**Symptoms:**
- Pasting customer data into ChatGPT
- Using public AI for code with API keys, credentials, or proprietary logic
- No AI usage policy at work
- No awareness of what the AI provider does with submitted data

**Root cause:** Convenience over caution, no policy, no awareness.

**Fix direction:** Data classification policy, approved tool list, local option for sensitive work.

### 5. Workflow Confusion
**What it is:** No clear process for which tool to use, when, and how. Ad-hoc prompting without templates.

**Symptoms:**
- Starting every conversation from scratch
- No system prompts or custom instructions
- Same prompts repeated across sessions
- Cannot reproduce a good output from last week

**Root cause:** No investment in workflow design, treating AI as a search engine.

**Fix direction:** System prompts, task-specific templates, saved conversation patterns.

### 6. Fake Automation
**What it is:** Calling something "automated" when it still requires manual intervention at every step.

**Symptoms:**
- "Automated" workflow that requires copying, pasting, and reviewing at each stage
- Zapier/Make chains that break weekly and need manual fixing
- More time managing the automation than doing the task manually

**Root cause:** Automation theater, not solving the underlying process problem.

**Fix direction:** Count manual touchpoints vs manual time. Only call it automation if it saves time net.

### 7. Brittle Local Setups
**What it is:** Local AI setup that works until something breaks and cannot be restored.

**Symptoms:**
- No documentation of how the setup was created
- No backup of configs, model paths, tool configurations
- "It worked last week but I changed something" with no git/config history
- Dependency hell with CUDA, drivers, Python versions

**Root cause:** No setup documentation, no version control for configs.

**Fix direction:** Docker containers or documented setup scripts. Config in git.

### 8. Hallucination Overreliance
**What it is:** Trusting AI outputs without verification, especially for facts, numbers, legal, medical, or financial content.

**Symptoms:**
- Publishing AI-generated content without fact-checking
- Using AI for research without cross-referencing
- Accepting incorrect code because "it looks right"
- Legal or financial decisions based on AI output

**Root cause:** Speed priority, verification seen as extra work.

**Fix direction:** Verification step in workflow, clear boundaries on what AI output is acceptable without review.

### 9. Lack of Review/Testing
**What it is:** AI-generated code, content, or decisions go directly into production or use without review.

**Symptoms:**
- No code review of AI-generated code
- No quality check of AI-generated content
- No testing strategy for AI-driven workflows
- "The AI wrote it, it must be good"

**Root cause:** False trust, speed over quality.

**Fix direction:** Review gates for all AI output, regardless of source.

### 10. Vendor Lock-in Without Reason
**What it is:** Building an entire process around a single AI tool with no fallback, no export capability, no alternative.

**Symptoms:**
- All prompts in one platform
- All data in one platform
- No export, no backup
- "What would we do if it shut down?" -- silence

**Root cause:** Convenience, platform lock-in marketing, no migration planning.

**Fix direction:** Export data regularly, maintain prompts in version control, keep an alternative tool identified.
