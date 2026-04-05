# AI Coding Workflows -- Patterns and Pitfalls
## Practical Guide for AI-Assisted Development

### Tool Landscape

| Tool | Strength | Best For |
|------|----------|----------|
| Cursor | IDE integration, context awareness | Daily coding, refactoring |
| Claude Code | Terminal-based agent, multi-step | Complex refactors, multi-file changes |
| GitHub Copilot | Inline completion, familiarity | Quick completions, writing tests |
| Codex CLI | Autonomous agent, repo context | Large-scale changes, migrations |
| Ollama + local | Privacy, cost, offline | Sensitive code, custom models |

### Workflow Patterns That Work

#### The Incremental Review Pattern
1. Ask AI to solve a specific sub-problem
2. Review the generated code before accepting
3. Run tests after each change
4. Commit with clear message about what changed
5. Repeat for next sub-problem

#### The Structured Prompt Pattern
1. Provide context: what file, what function, what should change
2. Provide constraints: language version, dependencies, testing requirements
3. Request: what to do, not just "fix this"
4. Review: check for security issues, edge cases, test coverage

#### The Agent Orchestration Pattern
1. Plan the changes in a spec first (AI-assisted)
2. Run agent on isolated task
3. Verify with tests
4. Review diff manually
5. Merge only after verification

### Common Failures in AI Coding

1. **The Big Bang Commit:** AI generates 300 lines across 10 files. Committed as one commit. No review.
2. **The Test Illusion:** AI writes tests that pass but test nothing meaningful. Coverage shows 100% but edge cases are untouched.
3. **The Context Gap:** AI does not have the full picture and generates code that does not fit the existing codebase structure.
4. **The Security Blind Spot:** AI introduces dependencies without checking them for vulnerabilities, or generates code with injection risks.
5. **The Prompt Amnesia:** Asking the same vague question repeatedly instead of giving the AI the context it needs.
6. **The Dependency Cascade:** AI adds new packages without checking if existing packages already handle the need.

### Assessment Checklist

1. Do you review AI-generated code before committing?
2. Do you have tests that run before AI changes are merged?
3. Do you give the AI context about your existing codebase structure?
4. do you check AI-added dependencies?
5. Do your commits describe what changed, or just "AI update"?
6. Do you have linting/formatting rules that catch AI code quality issues?
7. Can you trace a 3-month-old AI change back to what it was trying to solve?
