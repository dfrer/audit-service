# Incident Summary Prompt

You are creating an incident summary for the audit service.

## Input
- Incident Type: {{type}}
- Time: {{timestamp}}
- Affected Systems: {{systems}}
- Error Details: {{error}}
- Customer Impact: {{customerImpact}}

## Output Format
Write a clear, factual incident summary:

### What happened
One sentence.

### Impact
Who was affected and how.

### Root cause
What caused it (if known).

### Resolution
What was done to fix it.

### Prevention
What could prevent this from happening again.

Tone: factual, clear, no blame or drama.
