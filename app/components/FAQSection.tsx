"use client";

import { useState } from "react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "What exactly do I get for $75?",
    a: "A 5-8 page report with your project's top risks, a prioritized list of the most impactful fixes, a recommended tech stack with rationale, and a realistic 2-week plan. In PDF and Markdown.",
  },
  {
    q: "Do I need to give you access to my code?",
    a: "Yes, but securely. You send me a GitHub repo URL. If it's private, either invite a read-only machine account for a limited window, or share a zip via a link you control. We never ask for passwords.",
  },
  {
    q: "How fast will I get my report?",
    a: "Audit Lite: 48 hours. Audit Standard: 72 hours. Audit + Scaffold: 5 business days. These count from when you submit the intake form, not from payment.",
  },
  {
    q: "Is this consulting?",
    a: "No. Consulting is open-ended and expensive. This is a fixed-price, fixed-scope deliverable. You get a report, you decide what to do with it. No ongoing engagement required.",
  },
  {
    q: "What if I don't like the report?",
    a: "One round of clarifying questions is included within 7 days of delivery. If the repo cannot be analyzed (inaccessible, empty, non-standard), we contact you before proceeding. Refunds are available if deliverables were not provided.",
  },
  {
    q: "What tech stacks do you work with?",
    a: "Any stack. The audit is language-agnostic at the architecture and process level. We review code structure in any language. The scaffold PR will use your project's actual tech stack.",
  },
  {
    q: "Can I pay with crypto or invoicing?",
    a: "We use Stripe Checkout, which supports credit and debit cards. Invoicing is available for larger engagements (implementation sprints). Contact us for alternatives.",
  },
  {
    q: "What happens after I get my audit?",
    a: "You have 7 days to ask follow-up questions. After that, the order is considered complete. If you want help implementing the recommendations, we offer fixed-price sprints ($350-$900) and monthly retainers.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-zinc-100">
      {FAQS.map((faq, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between text-left group"
          >
            <span className="font-medium text-sm group-hover:text-zinc-600 transition-colors pr-4">
              {faq.q}
            </span>
            <span className="text-zinc-400 flex-shrink-0 text-lg">
              {open === i ? "-" : "+"}
            </span>
          </button>
          {open === i && (
            <p className="mt-3 text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
