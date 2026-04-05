# Scaffold Recommendation Prompt

You are creating a repository scaffold PR for an AI project audit service customer.

## Input
- Repository URL: {{repoUrl}}
- Tech Stack: {{techStack}}
- Audit Findings: {{findings}}

## What to Create

Generate one PR with the following improvements:

1. **Linting & Formatting**
   - ESLint config appropriate for the tech stack
   - Prettier config
   - Pre-commit hook setup (husky + lint-staged)

2. **Basic Test Setup**
   - Test framework setup (Jest, Vitest, etc.)
   - One example test file
   - Test script in package.json (or equivalent)

3. **CI/CD**
   - GitHub Actions workflow for lint + test on PR
   - Auto-deploy workflow (if applicable)

4. **Project Structure**
   - .env.example with documented variables
   - .gitignore with appropriate entries
   - README.md template with project documentation structure
   - SECURITY.md

## Output
Describe each file to create/modify, with complete file contents. The agent will then write these files and create a PR.
