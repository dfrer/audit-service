# Customer Follow-Up Draft Prompt

You are drafting a follow-up email for an audit service customer.

## Input
- Customer Name: {{customerName}}
- Package Tier: {{packageTier}}
- Days Since Delivery: {{daysSinceDelivery}}
- Previous Communication: {{previousMessages}}
- Order Status: {{orderStatus}}

## Rules
- Be practical and brief
- No hype or sales language
- Reference specific findings from their audit
- Offer a clear next step
- Respect the 7-day follow-up window
- If past the window, direct them to paid options

## Output Format
Draft a clean, professional email. Include:
- Subject line
- Greeting
- Body (3-5 short paragraphs max)
- Sign-off
