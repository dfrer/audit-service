"use client";

import { useState, FormEvent } from "react";
import { PACKAGE_CONFIG, AUDIT_CATEGORY_LABELS, type PackageTier, type AuditCategory } from "@/lib/types/order";

interface IntakeFormProps {
  preselectedPackage?: string;
  preselectedCategory?: string;
  orderId?: string;
}

const CATEGORY_DESCRIPTIONS: Record<AuditCategory, string> = {
  "business-ops": "AI tools, workflows, automation, content, research, operations",
  "personal-workflow": "Daily AI usage, prompt habits, personal organization, research",
  "local-selfhosted": "Ollama, Open WebUI, vLLM, local models, GPU setup",
  "ai-coding": "Cursor, Codex, Claude Code, agent workflows, repo patterns",
  "ai-deployment": "Hosted models, serving, cost/performance, production readiness",
  "general": "Does not fit a specific lane -- broad practical audit",
};

export default function IntakeForm({ preselectedPackage, preselectedCategory, orderId }: IntakeFormProps) {
  // Core
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Audit scope
  const [category, setCategory] = useState<AuditCategory>(
    (preselectedCategory as AuditCategory) || "general"
  );
  const [pkg, setPkg] = useState<PackageTier>(
    (preselectedPackage as PackageTier) || "audit-lite"
  );

  // Context
  const [contextSummary, setContextSummary] = useState("");
  const [toolsInUse, setToolsInUse] = useState("");
  const [currentStack, setCurrentStack] = useState("");
  const [mainPainPoints, setMainPainPoints] = useState("");

  // Optional
  const [goals, setGoals] = useState("");
  const [constraints, setConstraints] = useState("");
  const [privacyConcerns, setPrivacyConcerns] = useState("");
  const [budgetConcerns, setBudgetConcerns] = useState("");
  const [wantsImplementationHelp, setWantsImplementationHelp] = useState(false);

  // Legacy
  const [repoUrl, setRepoUrl] = useState("");

  // Form state
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!contextSummary.trim() || contextSummary.trim().length < 20) e.contextSummary = "At least 20 characters";
    if (contextSummary.length > 1000) e.contextSummary = "Under 1000 characters";
    if (!acknowledged) e.acknowledged = "Please acknowledge the terms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          name,
          email,
          packageTier: pkg,
          auditCategory: category,
          contextSummary,
          toolsInUse: toolsInUse || undefined,
          currentStack: currentStack || undefined,
          mainPainPoints: mainPainPoints || undefined,
          goals: goals || undefined,
          constraints: constraints || undefined,
          privacyConcerns: privacyConcerns || undefined,
          budgetConcerns: budgetConcerns || undefined,
          wantsImplementationHelp,
          repoUrl: repoUrl || undefined,
          acknowledgedTerms: acknowledged,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }
      const data = await res.json();
      // Redirect to Stripe checkout if orderId came back
      window.location.href = `/intake?step=checkout&orderId=${data.orderId}&packageTier=${pkg}`;
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full mb-6"
             style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)" }}>
          <svg className="h-8 w-8" style={{ color: "var(--accent)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-lg font-medium mb-2" style={{ color: "var(--text)" }}>Intake submitted</h2>
        <p className="text-xs max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Thanks, {name}. Redirecting you to payment...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {errors.submit && (
        <div className="rounded border p-4 text-xs" style={{ borderColor: "var(--red)", background: "rgba(196, 80, 74, 0.08)", color: "var(--red)" }}>
          {errors.submit}
        </div>
      )}

      {/* Section: Audit type */}
      <div>
        <div className="mono-sm mb-4" style={{ color: "var(--accent-dim)" }}>
          <span className="inline-block w-2 h-2 bg-amber-500 mr-2" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", backgroundColor: "var(--accent)" }} />
          AUDIT SCOPE
        </div>

        {/* Audit Category */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs mono font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            AUDIT CATEGORY <span style={{ color: "var(--red)" }}>*</span>
          </label>
          {(Object.keys(AUDIT_CATEGORY_LABELS) as AuditCategory[]).map((key) => {
            const selected = category === key;
            return (
              <button key={key} type="button" onClick={() => setCategory(key)}
                className="w-full flex items-start gap-3 border rounded px-4 py-3 text-left transition-colors"
                style={{
                  borderColor: selected ? "var(--accent-dim)" : "var(--border)",
                  background: selected ? "var(--accent-glow)" : "var(--surface)",
                }}>
                <div className="mt-0.5 w-2 h-2 shrink-0 rounded-sm"
                  style={{ background: selected ? "var(--accent)" : "var(--border-hover)" }} />
                <div className="min-w-0">
                  <div className="text-xs font-medium" style={{ color: selected ? "var(--text)" : "var(--text-secondary)" }}>
                    {AUDIT_CATEGORY_LABELS[key]}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {CATEGORY_DESCRIPTIONS[key]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Package */}
        <div>
          <label className="block text-xs mono font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            PACKAGE <span style={{ color: "var(--red)" }}>*</span>
          </label>
          <div className="space-y-2">
            {(Object.keys(PACKAGE_CONFIG) as PackageTier[]).map((key) => {
              const c = PACKAGE_CONFIG[key];
              const selected = pkg === key;
              return (
                <button key={key} type="button" onClick={() => setPkg(key)}
                  className="w-full flex items-center gap-4 border rounded px-4 py-3 text-left transition-colors"
                  style={{
                    borderColor: selected ? "var(--accent-dim)" : "var(--border)",
                    background: selected ? "var(--accent-glow)" : "var(--surface)",
                  }}>
                  <div className="mt-0.5 w-2 h-2 shrink-0 rounded-sm"
                    style={{ background: selected ? "var(--accent)" : "var(--border-hover)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: selected ? "var(--text)" : "var(--text-secondary)" }}>
                        {c.name}
                      </span>
                      <span className="text-xs mono" style={{ color: "var(--accent-dim)" }}>${c.price}</span>
                      <span className="text-xs mono" style={{ color: "var(--text-muted)" }}>-- {c.turnaround}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "var(--border)" }} />

      {/* Section: Context */}
      <div>
        <div className="mono-sm mb-4" style={{ color: "var(--accent-dim)" }}>
          <span className="inline-block w-2 h-2 mr-2" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", backgroundColor: "var(--accent)" }} />
          YOUR CONTEXT
        </div>

        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              NAME <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full rounded border px-3.5 py-2.5 text-sm bg-transparent transition-colors"
              style={{
                borderColor: errors.name ? "var(--red)" : "var(--border)",
                color: "var(--text)",
              }}
              placeholder="Your name" />
            {errors.name && <p className="text-xs mt-1.5" style={{ color: "var(--red)" }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              EMAIL <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3.5 py-2.5 text-sm bg-transparent transition-colors"
              style={{
                borderColor: errors.email ? "var(--red)" : "var(--border)",
                color: "var(--text)",
              }}
              placeholder="you@example.com" />
            {errors.email && <p className="text-xs mt-1.5" style={{ color: "var(--red)" }}>{errors.email}</p>}
          </div>

          {/* Context Summary */}
          <div>
            <label htmlFor="summary" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              WHAT ARE YOU USING AI FOR? <span style={{ color: "var(--red)" }}>*</span>
            </label>
            <textarea id="summary" value={contextSummary} onChange={(e) => setContextSummary(e.target.value)} rows={4}
              className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
              style={{
                borderColor: errors.contextSummary ? "var(--red)" : "var(--border)",
                color: "var(--text)",
              }}
              placeholder="Describe your current AI usage, what it is for, and what you want evaluated." />
            <div className="flex justify-between mt-1.5">
              {errors.contextSummary && <p className="text-xs" style={{ color: "var(--red)" }}>{errors.contextSummary}</p>}
              <span className="text-xs mono ml-auto" style={{ color: "var(--text-muted)" }}>{contextSummary.length}/1000</span>
            </div>
          </div>

          {/* Tools in use */}
          <div>
            <label htmlFor="tools" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              TOOLS / PLATFORMS IN USE
              <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
            </label>
            <textarea id="tools" value={toolsInUse} onChange={(e) => setToolsInUse(e.target.value)} rows={2}
              className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
              placeholder="ChatGPT, Claude, Cursor, Ollama, Midjourney, custom scripts..." />
          </div>

          {/* Current stack (for dev/local) */}
          <div>
            <label htmlFor="stack" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              TECH STACK / LOCAL SETUP
              <span className="font-normal" style={{ color: "var(--text-muted)" }}> (if applicable)</span>
            </label>
            <textarea id="stack" value={currentStack} onChange={(e) => setCurrentStack(e.target.value)} rows={2}
              className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
              placeholder="Ollama models, GPU setup, vLLM, langchain, langgraph, local vector DBs..." />
          </div>

          {/* Pain points */}
          <div>
            <label htmlFor="pain" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              MAIN PAIN POINTS
              <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
            </label>
            <textarea id="pain" value={mainPainPoints} onChange={(e) => setMainPainPoints(e.target.value)} rows={2}
              className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
              placeholder="What is not working? Too many tools? Cost? Bad outputs? Broken automations?" />
          </div>

          {/* Goals and Constraints (shorter) */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="goals" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                GOALS
                <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
              </label>
              <textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} rows={2}
                className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="What would a successful audit look like?" />
            </div>
            <div>
              <label htmlFor="constraints" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                CONSTRAINTS
                <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
              </label>
              <textarea id="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} rows={2}
                className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="Budget limits, timeline, team size, existing commitments..." />
            </div>
          </div>

          {/* Privacy and budget concerns */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="privacy" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                PRIVACY / SECURITY CONCERNS
                <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
              </label>
              <textarea id="privacy" value={privacyConcerns} onChange={(e) => setPrivacyConcerns(e.target.value)} rows={2}
                className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="Data handling, compliance requirements, sensitive data exposure..." />
            </div>
            <div>
              <label htmlFor="budget" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                BUDGET CONCERNS
                <span className="font-normal" style={{ color: "var(--text-muted)" }}> (optional)</span>
              </label>
              <textarea id="budget" value={budgetConcerns} onChange={(e) => setBudgetConcerns(e.target.value)} rows={2}
                className="w-full rounded border px-3.5 py-2.5 text-sm resize-none bg-transparent transition-colors"
                style={{ borderColor: "var(--border)", color: "var(--text)" }}
                placeholder="Too much spending on subscriptions? ROI unclear?" />
            </div>
          </div>

          {/* Repo URL (optional, for code audits) */}
          <div>
            <label htmlFor="repo" className="block text-xs mono font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              REPOSITORY URL
              <span className="font-normal" style={{ color: "var(--text-muted)" }}> (if applicable)</span>
            </label>
            <input id="repo" type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full rounded border px-3.5 py-2.5 text-sm bg-transparent transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
              placeholder="https://github.com/username/repo" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ background: "var(--border)" }} />

      {/* Implementation help */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={wantsImplementationHelp} onChange={(e) => setWantsImplementationHelp(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-amber-500" />
          <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
            I would also like help implementing the audit recommendations (implementation support is a separate engagement, billed after the audit).
          </span>
        </label>
      </div>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded accent-amber-500" />
          <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
            I understand this is a fixed-price audit service. Payment is required before work begins. My data will be used only for the purpose of this audit.
          </span>
        </label>
        {errors.acknowledged && <p className="text-xs mt-1.5" style={{ color: "var(--red)" }}>{errors.acknowledged}</p>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={submitting}
        className="w-full py-3 rounded text-xs mono font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "var(--accent)", color: "var(--bg)" }}>
        {submitting ? "SUBMITTING..." : "SUBMIT INTAKE & PROCEED TO PAYMENT"}
      </button>
    </form>
  );
}
