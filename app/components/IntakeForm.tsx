"use client";

import { useState, FormEvent } from "react";
import { PACKAGE_CONFIG, PackageTier } from "@/lib/types/order";

interface IntakeFormProps {
  preselectedPackage?: string;
  orderId?: string;
}

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
    if (!name.trim() || name.trim().length < 2) e.name = "Name is required (at least 2 characters)";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "A valid email is required";
    if (!repoUrl.trim()) e.repoUrl = "Repository URL is required";
    else {
      try {
        new URL(repoUrl);
      } catch {
        e.repoUrl = "Enter a valid URL (e.g. https://github.com/username/repo)";
      }
    }
    if (!summary.trim() || summary.trim().length < 20) e.summary = "Please describe your project in at least 20 characters";
    if (summary.length > 1000) e.summary = "Summary must be under 1000 characters";
    if (!acknowledged) e.acknowledged = "You must acknowledge the private repo policy";
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
          repoUrl,
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
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors({ submit: message });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-zinc-200 rounded-lg p-8 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h2 className="text-xl font-semibold mb-2">We got your order</h2>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Thanks, {name}. Your intake form has been submitted.
          We will review it and start your audit within 24 hours.
          You will hear from us with more details soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.name ? "border-red-300 bg-red-50" : "border-zinc-200"}`}
          placeholder="Your full name"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email <span className="text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.email ? "border-red-300 bg-red-50" : "border-zinc-200"}`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      {/* Repo URL */}
      <div>
        <label htmlFor="repo" className="block text-sm font-medium mb-1">
          Repository URL <span className="text-red-400">*</span>
        </label>
        <input
          id="repo"
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.repoUrl ? "border-red-300 bg-red-50" : "border-zinc-200"}`}
          placeholder="https://github.com/username/repo"
        />
        {errors.repoUrl && <p className="text-xs text-red-500 mt-1">{errors.repoUrl}</p>}
        <p className="text-xs text-zinc-400 mt-1">
          If your repo is private, you will be asked to invite our machine account after submission.
        </p>
      </div>

      {/* Project Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium mb-1">
          Project Summary <span className="text-red-400">*</span>
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className={`w-full border rounded-lg px-3 py-2 text-sm ${errors.summary ? "border-red-300 bg-red-50" : "border-zinc-200"}`}
          placeholder="What does this project do? What language and framework is it built with?"
        />
        <div className="flex justify-between mt-1">
          {errors.summary && <p className="text-xs text-red-500">{errors.summary}</p>}
          <span className="text-xs text-zinc-400">{summary.length}/1000</span>
        </div>
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="goals" className="block text-sm font-medium mb-1">
          Goals <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          rows={2}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm"
          placeholder="What do you want to achieve? e.g. ship to production, reduce tech debt, improve CI"
        />
      </div>

      {/* Constraints */}
      <div>
        <label htmlFor="constraints" className="block text-sm font-medium mb-1">
          Constraints <span className="text-zinc-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="constraints"
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          rows={2}
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm"
          placeholder="Timeline, budget limits, tech preferences, team size, etc."
        />
      </div>

      {/* Package Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Package <span className="text-red-400">*</span>
        </label>
        <div className="space-y-2">
          {(Object.keys(PACKAGE_CONFIG) as PackageTier[]).map((key) => {
            const c = PACKAGE_CONFIG[key];
            return (
              <label
                key={key}
                className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                  pkg === key
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  value={key}
                  checked={pkg === key}
                  onChange={() => setPkg(key)}
                  className="accent-zinc-900"
                />
                <div>
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="text-sm text-zinc-500 ml-2">${c.price}</span>
                  <span className="text-xs text-zinc-400 ml-2">-- {c.turnaround}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Private Repo Acknowledgment */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 accent-zinc-900"
          />
          <span className="text-sm text-zinc-600">
            I understand that if my repo is private, I will need to either invite your machine account
            as a collaborator (temporary, 7 days) or provide a zip/tarball via a link I control.
            No passwords will be shared.
          </span>
        </label>
        {errors.acknowledged && <p className="text-xs text-red-500 mt-1">{errors.acknowledged}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Intake Form"}
      </button>
    </form>
  );
}
