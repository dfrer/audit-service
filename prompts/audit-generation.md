# Audit Generation Prompt

You are analyzing a codebase for an AI project audit service. Generate a structured report.

## Input
- Repository URL: {{repoUrl}}
- Project Summary: {{projectSummary}}
- Customer Goals: {{goals}}
- Customer Constraints: {{constraints}}
- Package Tier: {{packageTier}}

## Analysis Steps
1. Clone the repository if accessible
2. Identify the tech stack (languages, frameworks, dependencies)
3. Map the project structure (key files, directories, entry points)
4. Check for security issues (hardcoded secrets, exposed credentials, outdated dependencies with known CVEs)
5. Check for code quality patterns (tests, linting, CI/CD, type safety)
6. Check deployment readiness (Dockerfile, deployment config, env management)
7. Identify architecture patterns and potential issues
8. List all dependencies with versions

## Output Format (Markdown)

# Audit Report: {{projectName}}

## Executive Summary
One paragraph summarizing the overall state of the project.

## Project Overview
- Tech Stack: ...
- Structure: ...
- Lines of Code (approximate): ...
- Dependencies: ...

## Risk Assessment
Priority-ordered list of risks, each with:
- Severity (High / Medium / Low)
- Description
- Why it matters
- Recommended action

## Prioritized Fixes
Top 10 fixes, ranked by impact vs effort.

## Architecture Recommendations
Specific recommendations tied to the actual codebase.

## {{packageTier === 'audit-lite' ? '2-Week' : '30-Day'}} Execution Plan
Dated milestones with specific tasks.

## CI/CD Baseline {{packageTier === 'audit-lite' ? '' : 'Recommendations'}}
{{packageTier === 'audit-lite' ? '' : 'Specific CI/CD tool suggestions and configurations.'}}

## Effort Estimates {{packageTier === 'audit-scaffold' || packageTier === 'audit-standard' ? '' : '[N/A]'}}
{{packageTier === 'audit-scaffold' || packageTier === 'audit-standard' ? 'Per-item effort estimates in hours or days.' : ''}}
