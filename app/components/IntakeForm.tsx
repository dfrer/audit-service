"use client";

import { useState, FormEvent } from "react";
import { PACKAGE_CONFIG, type PackageTier } from "@/lib/types/order";

interface IntakeFormProps {
  preselectedPackage?: string;
  orderId?: string;
}

const PACKAGE_FEATURES: Record<PackageTier, string[]> = {
  "audit-lite": ["Risk list, top 10 fixes, 2-week plan", "PDF and Markdown report"],
  "audit-standard": ["Everything in Lite plus 30-day plan", "Architecture diagram, CI/CD baseline", "Effort estimates, vulnerability scan"],
  "audit-scaffold": ["Everything in Standard plus a PR", "Lint/format/test, deployment skeleton", "CI/CD workflow, production checklist"],
};

export default function IntakeForm({ preselectedPackage, orderId }: IntakeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [goals, setGoals] = useState("");
  const [constraints, setConstraints] = useState("");
  const [pkg, setPkg] = useState<PackageTier>(
    (preselectedPackage as PackageTier) || "audit-lite"
  );
  const [acknowledged, setAcknowledged] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "Name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (!repoUrl.trim()) e.repoUrl = "Repository URL required";
    else { try { new URL(repoUrl); } catch { e.repoUrl = "Must be a valid URL"; } }
    if (!summary.trim() || summary.trim().length < 20) e.summary = "At least 20 characters";
    if (summary.length > 1000) e.summary = "Under 1000 characters";
    if (!acknowledged) e.acknowledged = "Please acknowledge the private repo policy";
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
          orderId, name, email, repoUrl,
          projectSummary: summary,
          goals: goals || undefined,
          constraints: constraints || undefined,
          packageTier: pkg,
          acknowledgedPrivateRepoPolicy: acknowledged,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Submission failed" }));
        throw new Error(err.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setErrors({ submit: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">We got your order</h2>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          Thanks, {name}. Your intake form has been submitted and we will start your audit within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.submit && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{errors.submit}</div>
      )}

      {/* Package Selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-900 mb-3">Choose your package <span className="text-red-400">*</span></label>
        <div className="space-y-2">
          {(Object.keys(PACKAGE_CONFIG) as PackageTier[]).map((key) => {
            const c = PACKAGE_CONFIG[key];
            const selected = pkg === key;
            return (
              <button key={key} type="button" onClick={() => setPkg(key)}
                className={`w-full flex items-center gap-4 border rounded-lg px-4 py-3 text-left transition-all ${selected ? "border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900" : "border-zinc-200 hover:bg-zinc-50"}`}>
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"}`}>
                  {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-900">{c.name}</span>
                    <span className="text-sm font-semibold text-zinc-900">${c.price}</span>
                    <span className="text-xs text-zinc-400">-- {c.turnaround}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{PACKAGE_FEATURES[key][0]}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8">
        <p className="text-sm text-zinc-500 mb-6">Now tell us about your project.</p>
        <div className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-900 mb-1.5">Name <span className="text-red-400">*</span></label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${errors.name ? "border-red-300 bg-red-50" : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"}`}
              placeholder="Your full name" />
            {errors.name && <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-900 mb-1.5">Email <span className="text-red-400">*</span></label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${errors.email ? "border-red-300 bg-red-50" : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"}`}
              placeholder="you@example.com" />
            {errors.email && <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>}
          </div>

          {/* Repo URL */}
          <div>
            <label htmlFor="repo" className="block text-sm font-medium text-zinc-900 mb-1.5">Repository URL <span className="text-red-400">*</span></label>
            <input id="repo" type="url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${errors.repoUrl ? "border-red-300 bg-red-50" : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"}`}
              placeholder="https://github.com/username/repo" />
            {errors.repoUrl && <p className="text-xs text-red-600 mt-1.5">{errors.repoUrl}</p>}
            <p className="text-xs text-zinc-400 mt-1.5">If your repo is private, we will ask you to invite our machine account after submission.</p>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-zinc-900 mb-1.5">Project Summary <span className="text-red-400">*</span></label>
            <textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm resize-none transition-colors ${errors.summary ? "border-red-300 bg-red-50" : "border-zinc-300 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"}`}
              placeholder="What does this project do? What language and framework?" />
            <div className="flex justify-between mt-1.5">
              {errors.summary && <p className="text-xs text-red-600">{errors.summary}</p>}
              <span className="text-xs text-zinc-400 ml-auto">{summary.length}/1000</span>
            </div>
          </div>

          {/* Goals */}
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-zinc-900 mb-1.5">Goals <span className="text-zinc-400 font-normal">(optional)</span></label>
            <textarea id="goals" value={goals} onChange={(e) => setGoals(e.target.value)} rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm resize-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
              placeholder="What do you want to achieve? e.g. ship to production, reduce tech debt" />
          </div>

          {/* Constraints */}
          <div>
            <label htmlFor="constraints" className="block text-sm font-medium text-zinc-900 mb-1.5">Constraints <span className="text-zinc-400 font-normal">(optional)</span></label>
            <textarea id="constraints" value={constraints} onChange={(e) => setConstraints(e.target.value)} rows={2}
              className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm resize-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
              placeholder="Timeline, budget, tech preferences, team size" />
          </div>
        </div>
      </div>

      {/* Acknowledgment */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" checked={acknowledged} onChange={(e) => setAcknowledged(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-zinc-900" />
        <span className="text-sm text-zinc-600 leading-snug">
          I understand that if my repo is private, I will need to invite your machine account (temporary, 7 days) or share a zip. No passwords will be shared.
        </span>
      </label>
      {errors.acknowledged && <p className="text-xs text-red-600 -mt-4">{errors.acknowledged}</p>}

      {/* Submit */}
      <button type="submit" disabled={submitting}
        className="w-full py-3 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </span>
        ) : "Submit Intake Form"}
      </button>
    </form>
  );
}
