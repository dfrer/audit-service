# AI Audit Taxonomy

## Purpose
Classifies what we audit and how findings are structured. This is the internal taxonomy for the AI Audit Service.

## Audit Categories

Each intake maps to exactly one primary category and zero or more secondary categories.

### 1. Business AI Operations (`business-ops`)
AI usage in business contexts -- operations, support, content, research, internal processes.

**Subcategories:**
- Tool sprawl: too many AI tools paying for, underutilized, overlapping features
- Cost leakage: subscription waste, duplicate tools, paying for features not used
- Privacy / compliance: data exposure, shadow AI, regulatory risk
- Workflow gaps: manual processes that should be automated, broken chains
- Model/tool mismatch: wrong model for the task, over-engineering, under-specification
- Vendor lock-in: critical processes dependent on a single vendor with no fallback
- ROI unknown: no measurement of whether AI is actually helping or just being used

**Typical signals:** Multiple paid AI subscriptions, no unified policy, employees using whatever tools they find on Reddit, no privacy guidelines, no cost tracking.

### 2. Personal AI Workflows (`personal-workflow`)
How an individual uses AI in daily work and life.

**Subcategories:**
- Prompt/process hygiene: ad-hoc prompting, no system prompts, no templates
- Personal organization: using AI for notes, scheduling, planning without structure
- Research usage: AI-assisted research without verification, hallucination overreliance
- Life admin: taxes, emails, meal planning, shopping, scheduling via AI
- Cognitive overload: too many tools, context switching between different AI systems
- Tool confusion: not knowing which tool to use for which task
- Setup gaps: not using the right features (custom instructions, memory, API access when needed)

**Typical signals:** 4+ AI tools on daily rotation, no system prompts, switching between ChatGPT/Claude/Gemini/Midjourney/Suno without clear assignment of use cases, losing conversations.

### 3. Local / Self-Hosted AI (`local-selfhosted`)
Running AI models locally or on personal infrastructure.

**Subcategories:**
- Model choice: wrong model for the workload, outdated models, oversized models for the use case
- Hardware fit: GPU constraints, RAM limits, running models on underspecified hardware
- Privacy/performance tradeoffs: local vs hosted decision rationale, or lack thereof
- Deployment sanity: ad-hoc setups, no monitoring, broken after updates, no backup strategy
- Maintenance burden: spending more time maintaining the setup than using it
- Stack bloat: Open WebUI + LM Studio + Ollama + textgenwebui running simultaneously

**Typical signals:** Multiple model runners installed, models downloaded and never used, GPU memory management issues, local setup broken after driver updates, no clear answer to why local vs cloud.

### 4. AI Coding Workflows (`ai-coding`)
Using AI for code generation, review, testing, and development.

**Subcategories:**
- Cursor/Codex/Claude Code usage patterns: how the agent is used, prompting approach
- Repo hygiene: no linting, no tests, AI-generated code without review
- Prompting structure: vague instructions, no context window management, no examples
- Agent workflow design: sequential vs parallel, verification, review gates
- Testing bottlenecks: AI generates tests that pass but do not test the right things
- Tooling inefficiency: context switching between Claude, Cursor, terminal, Copilot
- Automation opportunities: CI/CD, code review, changelog generation, PR descriptions

**Typical signals:** Large PRs of AI-generated code, no code review of AI output, no unit test quality checks, "it works" as the only test criterion.

### 5. AI/ML Deployment Practicality (`ai-deployment`)
Whether an AI/ML setup makes sense at all, and if so, how to make it work.

**Subcategories:**
- Hosted vs local vs hybrid decision: cost, latency, privacy, data size considerations
- Production readiness: monitoring, fallback, rate limiting, error handling
- Cost/performance tradeoffs: token costs vs local compute costs, response time requirements
- Model serving practicality: vLLM, Triton, Ollama serving -- right tool for the job
- Maintenance complexity: who maintains the ML pipeline, what happens when it breaks
- Vendor dependency: what breaks if your AI provider changes pricing, rate limits, or disappears

**Typical signals:** RAG pipeline with unclear ROI, fine-tuning a model when prompting would work, building a custom model when an API is sufficient.

### 6. General AI Usage Audit (`general`)
Catch-all for audits that do not fit cleanly into one lane above.

**Subcategories:**
- Any combination of the above
- Unique situations classified during intake review

## Classification Rules

1. Always ask: what is the PRIMARY context? (business, personal, local, dev, deployment)
2. Secondary categories can apply but the main focus should map to one category
3. If client cannot identify, default to `general` and classify during the audit
4. Category determines which failure modes and recommendation patterns are prioritized

## Audit Severity Levels

When producing findings, tag each with:
- **CRITICAL**: Active risk, data exposure, cost hemorrhage, immediate action needed
- **HIGH**: Significant waste or risk, action within 1-2 weeks
- **MEDIUM**: Suboptimal pattern, action within 1 month
- **LOW**: Nice to improve, no urgency
- **INFO**: Observation, no action required but worth noting
