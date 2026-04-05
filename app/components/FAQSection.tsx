"use client";

import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly do I get for $75?",
    a: "A 5 to 8 page report with your project top risks, a prioritized list of the most impactful fixes, a recommended tech stack with rationale, and a realistic 2-week plan. In PDF and Markdown.",
  },
  {
    q: "Do I need to give you access to my code?",
    a: "Yes, but securely. You send me a GitHub repo URL. If it is private, either invite a read-only machine account for a limited window, or share a zip via a link you control. We never ask for passwords.",
  },
  {
    q: "How fast will I get my report?",
    a: "Audit Lite: 48 hours. Audit Standard: 72 hours. Audit plus Scaffold: 5 business days. These count from when you submit the intake form, not from payment.",
  },
  {
    q: "Is this consulting?",
    a: "No. Consulting is open-ended and expensive. This is a fixed-price, fixed-scope deliverable. You get a report, you decide what to do with it. No ongoing engagement required.",
  },
  {
    q: "What if I do not like the report?",
    a: "One round of clarifying questions is included within 7 days of delivery. If the repo cannot be analyzed (inaccessible, empty, non-standard), we contact you before proceeding. Refunds are available if deliverables were not provided.",
  },
  {
    q: "What tech stacks do you work with?",
    a: "Any stack. The audit is language-agnostic at the architecture and process level. We review code structure in any language. The scaffold PR will use your actual tech stack.",
  },
  {
    q: "Can I pay with crypto or invoicing?",
    a: "We use Stripe Checkout, which supports credit and debit cards. Invoicing is available for larger engagements such as implementation sprints. Contact us for alternatives.",
  },
  {
    q: "What happens after I get my audit?",
    a: "You have 7 days to ask follow-up questions. After that, the order is considered complete. If you want help implementing the recommendations, we offer fixed-price sprints and monthly retainers.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-zinc-100 border-t border-zinc-100">
      {FAQS.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left group"
          >
            <span className="text-sm font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors pr-4">
              {faq.q}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 group-hover:border-zinc-400 transition-colors">
              {open === i ? (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
              ) : (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              )}
            </span>
          </button>
          {open === i && (
            <div className="pb-5">
              <p className="text-sm leading-relaxed text-zinc-500">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
