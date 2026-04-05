# Real-World AI Usage Patterns
## Practical Patterns of AI Use Across Contexts

### Business AI Usage Patterns

#### Pattern: The Tool Zoo
A business pays for ChatGPT Plus, Claude Pro, Midjourney, Otter.ai, Jasper, and a custom GPT. No one knows the total monthly bill. Different departments use different tools for overlapping purposes.

- **Signs:** >3 AI subscriptions, no central tracking, redundant capabilities
- **Root cause:** Individual tool discovery without organizational coordination
- **Cost impact:** Typically $200-$800/month in overlapping subscriptions

#### Pattern: Shadow AI
Employees use AI tools without IT knowledge. Data is pasted into chatbots including customer info, financials, or code. No policy exists.

- **Signs:** No AI usage policy, no DLP, employees using AI on personal accounts for work
- **Root cause:** Productivity pressure without guidance
- **Risk impact:** Data leaks, compliance violations, IP exposure

#### Pattern: The AI Suggestion Board
A company has an "AI strategy" document that is just a list of tools they might want to try eventually. No implementation plan, no use cases, no measurement.

- **Signs:** Strategy doc with no action items, no pilot projects, no success metrics
- **Root cause:** AI anxiety without AI understanding

#### Pattern: Single-Tool Dependency
An entire workflow depends on one AI tool. When the tool changes pricing, API, or goes down, the business process breaks.

- **Signs:** No fallback process, critical workflow through one tool, no monitoring
- **Risk impact:** Business disruption, vendor lock-in

### Personal AI Usage Patterns

#### Pattern: The Prompt Nomad
An individual copies prompts between ChatGPT, Claude, Gemini, and Perplexity without maintaining context. Each tool gets a different version of the conversation. No system prompts.

- **Signs:** Same question asked 4 times, no custom instructions, lost conversations
- **Impact:** Wasted time, inconsistent outputs, no leverage

#### Pattern: The Everything Assistant
Using AI for emails, research, meal planning, scheduling, writing, coding, analysis, therapy-adjacent conversations. Over-scope without organization.

- **Signs:** 10+ separate AI sessions daily, no templates, no saved prompts, context loss between sessions
- **Impact:** Cognitive overhead exceeds AI benefit

#### Pattern: The Verified Workflow
A person has a structured approach: research in Perplexity/AI, writing in Claude with custom instructions, code in Cursor, fact-checking via search. Each tool has a defined role.

- **Signs:** System prompts, tool-specific workflows, known strengths, regular templates
- **Impact:** High leverage, low friction

### Local / Self-Hosted AI Patterns

#### Pattern: The Model Hoarder
Downloads 20+ models to local storage. Uses 2-3. GPU memory is full. Cannot remember which models are for which task.

- **Signs:** 100GB+ in model files, cannot name the last model they actually used for something
- **Impact:** Storage waste, confusion, slower experimentation

#### Pattern: The Broken Local Setup
Ollama was working until a driver update. LM Studio crashes. Open WebUI lost its config. Nothing has been maintained in 2 weeks.

- **Signs:** Setup worked once, multiple tools installed, no documentation, "I will fix it later"
- **Impact:** Time sink, frustration, return to hosted tools

#### Pattern: The Local Stack
Clean Ollama + Open WebUI setup. 3-4 well-chosen models with defined roles (coding model, general model, embedding model). Config backed up.

- **Signs:** Documented setup, known models, backup config, regular updates
- **Impact:** Privacy, cost control, working system

### AI Coding Workflow Patterns

#### Pattern: The Prompt-and-Pray Developer
Pastes a vague requirement into Cursor or Claude Code, gets 200 lines of code, commits it without review. No tests. "It works" is the validation.

- **Signs:** Large single commits, no test additions, no code review of AI output
- **Risk impact:** Tech debt accumulation, bugs, security issues

#### Pattern: The Structured Agent Workflow
Uses AI with clear instructions, incremental changes, automated testing, and code review. The agent is a collaborator, not a code vending machine.

- **Signs:** Small commits, tests pass, code review of AI output, structured prompts with context

### Decision Criteria

When classifying a usage pattern:
1. **What tools are they using?** (count and purpose)
2. **Are roles assigned?** (does each tool have a job?)
3. **Is there structure?** (templates, system prompts, workflows)
4. **Is there measurement?** (cost tracking, time saved, quality assessment)
5. **Is there redundancy?** (overlapping tools, duplicate subscriptions)
6. **Is there maintenance?** (setup documented, updates applied, configs backed up)
