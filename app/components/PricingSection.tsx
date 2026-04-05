import { PACKAGE_CONFIG, PackageTier } from "@/lib/types/order";
import Link from "next/link";

const TIERS: { tier: PackageTier; highlight?: boolean; features: string[] }[] = [
  {
    tier: "audit-lite",
    features: [
      "Repository analysis & requirements intake",
      "Prioritized risk list",
      "Recommended tech stack with rationale",
      "Top 10 fixes ranked by impact",
      "Realistic 2-week execution plan",
      "PDF + Markdown report",
    ],
  },
  {
    tier: "audit-standard",
    highlight: true,
    features: [
      "Everything in Audit Lite",
      "30-day execution plan with milestones",
      "Architecture diagram",
      "CI/CD baseline recommendations",
      "Effort estimates per action item",
      "Dependency vulnerability scan",
    ],
  },
  {
    tier: "audit-scaffold",
    features: [
      "Everything in Audit Standard",
      "One PR adding repo hygiene (lint/format/test)",
      "Deployment-ready skeleton",
      "CI/CD workflow (GitHub Actions)",
      "Production readiness checklist",
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      {TIERS.map(({ tier, highlight, features }) => {
        const config = PACKAGE_CONFIG[tier];
        return (
          <div
            key={tier}
            className={`flex flex-col rounded-lg border p-6 ${
              highlight
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white"
            }`}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{config.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold">${config.price}</span>
              </div>
              <p className={`mt-1 text-xs ${highlight ? "text-zinc-300" : "text-zinc-500"}`}>
                Turnaround: {config.turnaround}
              </p>
            </div>

            <ul className="flex-1 space-y-2 mb-6">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 flex-shrink-0 ${highlight ? "text-green-300" : "text-green-600"}`}>
                    &#10003;
                  </span>
                  <span className={highlight ? "text-zinc-200" : "text-zinc-600"}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={`/intake?package=${tier}`}
              className={`block w-full text-center py-2.5 rounded-full text-sm font-medium transition-colors ${
                highlight
                  ? "bg-white text-zinc-900 hover:bg-zinc-100"
                  : "bg-zinc-900 text-white hover:bg-zinc-700"
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
