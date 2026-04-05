"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "What exactly do you audit?",
    a: "We audit how you actually use AI in practice -- your tool stack, workflows, costs, automation gaps, privacy handling, and whether your setup is actually helping or just adding complexity. This covers business operations, personal workflows, local/self-hosted setups, and AI coding workflows.",
  },
  {
    q: "Do I need a codebase or repo for this?",
    a: "Not necessarily. The audit covers much more than codebases. If you are a business owner using AI tools, a developer with an AI coding setup, or someone running local models -- all of those are valid audit targets. Repo URL is optional for non-code audits.",
  },
  {
    q: "What do I get back?",
    a: "A concrete report with findings ranked by impact, specific recommendations, and an action plan. Lite gives you a prioritized fix list. Standard adds a 30-day roadmap and cost analysis. Scaffold adds implementation scaffolding and a follow-up window.",
  },
  {
    q: "Is this just generic AI advice?",
    a: "No. Every finding is specific to your actual tools, workflows, and setup. We do not send you a templated best-practices deck. You get concrete analysis of what you are actually doing.",
  },
  {
    q: "How fast will I get my report?",
    a: "48 hours for Lite, 72 hours for Standard, 5 business days for Scaffold. Delivery starts after we receive your completed intake form.",
  },
  {
    q: "What if my repo is private?",
    a: "We will ask you to grant temporary read access (7 days max) or share a zip of relevant files. We do not ask for passwords or write access to your repos.",
  },
  {
    q: "Do you implement the fixes for me?",
    a: "The audit gives you a prioritized plan. If you want help implementing, the Scaffold tier includes a starter PR or setup guide. For deeper implementation work, we can discuss that separately after delivery.",
  },
  {
    q: "Can I get a refund if I am not satisfied?",
    a: "If we have not started the audit yet, yes. Once work has begun, we will work with you to make the deliverable useful. We stand behind the quality of our analysis.",
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 5L7 9L11 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between py-4 text-left transition-colors"
              style={{ color: isOpen ? "var(--text)" : "var(--text-secondary)" }}
              onMouseEnter={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { if (!isOpen) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              <span className="text-sm font-medium pr-4">{faq.q}</span>
              <Chevron open={isOpen} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-60 pb-4" : "max-h-0"}`}
            >
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {faq.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
