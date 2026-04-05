import { PACKAGE_CONFIG, PackageTier } from "@/lib/types/order";
import Link from "next/link";

const TIERS: { tier: PackageTier; highlight: boolean; features: string[] }[] = [
  {
    tier: "audit-lite",
    highlight: false,
    features: [
      "Repository analysis and requirements intake",
      "Prioritized risk list",
      "Recommended tech stack with rationale",
      "Top 10 fixes ranked by impact",
      "Realistic 2-week execution plan",
      "PDF and Markdown report",
    ],
  },
  {
    tier: "audit-standard",
    highlight: true,
    features: [
      "Everything in Lite, plus:",
      "30-day execution plan with milestones",
      "Architecture diagram",
      "CI/CD baseline recommendations",
      "Effort estimates per action item",
      "Dependency vulnerability scan",
    ],
  },
  {
    tier: "audit-scaffold",
    highlight: false,
    features: [
      "Everything in Standard, plus:",
      "One PR adding repo hygiene (lint/format/test)",
      "Deployment-ready skeleton",
      "CI/CD workflow (GitHub Actions)",
      "Production readiness checklist",
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {TIERS.map(({ tier, highlight, features }) => {
        const config = PACKAGE_CONFIG[tier];
        return (
          <div
            key={tier}
            className={`relative flex flex-col rounded-xl p-6 ${
              highlight
                ? "border-2 border-zinc-900 bg-white shadow-lg shadow-zinc-900/5"
                : "border border-zinc-200 bg-white"
            }`}
          >
            {highlight && (
              <div className="absolute -top-3 left-6 px-2.5 py-0.5 text-xs font-medium text-white bg-zinc-900 rounded-full">
                Most popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-base font-medium text-zinc-900">{config.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-zinc-900">${config.price}</span>
                <span className="text-sm text-zinc-500 ml-1">one-time</span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">Turnaround: {config.turnaround}</p>
            </div>

            <div className="mb-8 flex flex-1 flex-col gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-sm text-zinc-600">{f}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/intake?package=${tier}`}
              className={`block w-full rounded-lg py-2.5 text-center text-sm font-medium transition-colors ${
                highlight
                  ? "bg-zinc-900 text-white hover:bg-zinc-800"
                  : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              }`}
            >
              Get This Audit
            </Link>
          </div>
        );
      })}
    </div>
  );
}
