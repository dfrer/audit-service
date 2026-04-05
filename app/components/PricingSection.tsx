import { PACKAGE_CONFIG, PackageTier } from "@/lib/types/order";
import Link from "next/link";

interface TierConfig {
  tier: PackageTier;
  highlight: boolean;
  features: string[];
  bestFor: string;
}

const TIERS: TierConfig[] = [
  {
    tier: "audit-lite",
    highlight: false,
    bestFor: "Quick diagnostic -- where are you bleeding time or money?",
    features: [
      "Tool and usage inventory",
      "Top risk and cost findings",
      "Prioritized fix list",
      "2-week action plan",
      "PDF + Markdown report",
    ],
  },
  {
    tier: "audit-standard",
    highlight: true,
    bestFor: "Full picture -- what is broken, what works, what to do next",
    features: [
      "Everything in Lite, plus:",
      "30-day roadmap with milestones",
      "Workflow and integration map",
      "Effort estimates per action item",
      "Cost and vendor dependency analysis",
      "Privacy and data handling review",
    ],
  },
  {
    tier: "audit-scaffold",
    highlight: false,
    bestFor: "Audit + implementation roadmap with scaffold deliverables",
    features: [
      "Everything in Standard, plus:",
      "Implementation scaffold (PR or guide)",
      "CI/CD or workflow automation setup",
      "Production readiness checklist",
      "7-day follow-up window",
    ],
  },
];

export default function PricingSection() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {TIERS.map(({ tier, highlight, features, bestFor }, idx) => {
        const config = PACKAGE_CONFIG[tier];
        return (
          <div
            key={tier}
            data-shoggoth={`pricing-card-${idx}`}
            className="relative flex flex-col rounded-lg border p-6 transition-colors"
            style={{
              borderColor: highlight ? "var(--accent)" : "var(--border)",
              background: "var(--surface)",
            }}
          >
            {highlight && (
              <div
                className="absolute -top-2.5 left-6 px-2.5 py-0.5 text-xs mono font-medium rounded-sm"
                style={{ background: "var(--accent)", color: "var(--bg)" }}
              >
                RECOMMENDED
              </div>
            )}

            <div className="mb-6">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  {config.name}
                </h3>
                <span className="mono-sm" style={{ color: highlight ? "var(--accent)" : "var(--text-muted)" }}>
                  ${config.price}
                </span>
              </div>
              <p className="text-xs mono mt-3 mb-1" style={{ color: "var(--text-secondary)" }}>
                {config.turnaround}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {bestFor}
              </p>
            </div>

            {/* Divider line */}
            <div className="h-px mb-6" style={{ background: "var(--border)" }} />

            <div className="mb-8 flex flex-1 flex-col gap-3">
              {features.map((f) => (
                <div key={f} className="flex items-start gap-2.5">
                  <div className="mt-0.5 w-1.5 h-1.5 shrink-0 rounded-sm" style={{ background: highlight ? "var(--accent)" : "var(--accent-dim)" }} />
                  <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {f}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href={`/intake?package=${tier}`}
              className="block w-full rounded-md py-2.5 text-center text-xs mono font-medium transition-colors"
              style={
                highlight
                  ? { background: "var(--accent)", color: "var(--bg)" }
                  : { border: "1px solid var(--border-hover)", color: "var(--text-secondary)" }
              }
            >
              GET THIS AUDIT
            </Link>
          </div>
        );
      })}
    </div>
  );
}
