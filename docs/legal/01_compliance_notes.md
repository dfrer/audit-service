# Compliance Notes

## Purpose

This is not legal advice. This is a practical summary of operational constraints derived from platform terms of service and policies. The goal is to avoid actions that could get your business accounts suspended, flagged, or terminated.

## Platform-Specific Constraints

### GitHub

- **Bot-created accounts are prohibited.** You must be human. Accounts registered by bots or automated methods are not permitted.
- **Machine accounts are allowed** only if set up by a human who accepts the Terms and is responsible for the account's actions.
- **Free account limits apply** to machine accounts (may have rate limits on API usage).
- **Action:** Human owner creates all accounts. Hermes operates via tokens created by the owner.

### Vercel

- **Hobby plan is for personal or non-commercial use only.** A commercial paid service requires Pro ($20/mo) or higher.
- **Content on Hobby/trial Pro may be used for AI model training** by Vercel. Pro plan has different defaults.
- **Backups are your responsibility.** Vercel disclaims liability for data loss due to misconfiguration.
- **Action:** Use Vercel Pro from launch. Maintain own backups. Do not attempt to run commercial traffic on Hobby.

### Stripe

- **KYC/identity verification is required.** Legal entity and representative information must be provided.
- **Account holder is responsible for all actions** taken under their credentials, including by authorized representatives.
- **Verification documents may be requested** (government ID, proof of address).
- **Action:** Human owner completes KYC. Hermes configures products/prices via API only.

### OpenAI / ChatGPT

- **Credential sharing is prohibited.** Account credentials must not be shared.
- **Programmatic extraction and powering third-party services via ChatGPT is restricted.** Your service delivers output to customers -- it does not give them access to your AI tools.
- **Credits are non-refundable and non-transferable.** They expire one year after purchase/issuance.
- **You are responsible for all activity** under your account.
- **Action:** Never share credentials. Structure the service as deliverable-based, not access-based.

### Google / Gmail

- **Creating fake accounts or bypassing protective measures is prohibited.**
- **Action:** Human owner creates the email account. Hermes configures templates and routing afterward.

## Operational Rules (Derived from Above)

1. The human owner creates every root account manually
2. Hermes operates only with scoped tokens the owner provides
3. The service sells deliverables, not access to AI tools
4. No automation that circumvents platform limits
5. Backups are your responsibility -- maintain them
6. KYC cannot be delegated
7. Credentials are never stored in source control
8. If a platform's terms change, the operator model must be re-evaluated

## What "No Legal Cosplay" Means

This document is not a legal opinion. It does not establish legal compliance or non-compliance. It is a practical summary of platform terms that an operator should know before taking action. If you need legal advice, consult a qualified attorney in your jurisdiction.
