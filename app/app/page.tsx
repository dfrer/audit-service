import Link from "next/link";
import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

const CHECKS = [
  "Dependency inventory & vulnerability scan",
  "Architecture & structure review",
  "Prioritized risk list with concrete fixes",
  "Realistic timeline you can actually follow",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">audit<span className="text-zinc-400">.dev</span></span>
          <div className="flex items-center gap-6 text-sm">
            <a href="#pricing" className="text-zinc-600 hover:text-zinc-900">Pricing</a>
            <a href="#faq" className="text-zinc-600 hover:text-zinc-900">FAQ</a>
            <a href="#pricing" className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-sm hover:bg-zinc-700 transition-colors">Get an Audit</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 pt-24 pb-20">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            Ship with a plan.{" "}
            <span className="text-zinc-400">Stop guessing.</span>
          </h1>
          <p className="mt-6 text-lg text-zinc-600 leading-relaxed">
            Send me your repo. I will analyze it, find the risks, and give you a
            prioritized execution plan with a realistic timeline. Not consulting,
            not vague feedback -- a concrete plan you can follow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#pricing"
              className="px-6 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
            >
              Get an Audit
            </a>
            <a
              href="#faq"
              className="px-6 py-3 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors"
            >
              Learn More
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-zinc-600">
            {CHECKS.map((c) => (
              <div key={c} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5 flex-shrink-0">&#10003;</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-zinc-100 py-16 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">How it works</h2>
          <p className="text-zinc-500 mb-10">Three steps between &quot;I&rsquo;m stuck&quot; and &quot;I have a plan.&quot;</p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Buy and fill out the intake form",
                desc: "Pick a package, pay via Stripe, then tell me about your repo, goals, and any constraints.",
              },
              {
                step: "2",
                title: "I analyze your codebase",
                desc: "I run a structured audit: dependencies, architecture, security, maintainability. Then I write a report.",
              },
              {
                step: "3",
                title: "You get a plan",
                desc: "A PDF report with prioritized findings, recommendations ranked by impact, and a timeline. Scaffold tier includes a PR.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-2">
                <span className="text-3xl font-bold text-zinc-200">{item.step}</span>
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold tracking-tight mb-2">Pricing</h2>
          <p className="text-zinc-500 mb-10">Fixed price. Fixed scope. No surprises.</p>
          <PricingSection />
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-zinc-100 py-16 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Why this works</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Fixed price, fixed scope",
                desc: "You know exactly what you are getting and what it costs before you buy. No hourly billing, no scope creep.",
              },
              {
                title: "Built for developers",
                desc: "No jargon, no vague &quot;best practices.&quot; You get concrete findings tied to your actual codebase.",
              },
              {
                title: "Fast turnaround",
                desc: "48 hours for the basic audit, 5 days max for the full scaffold. You won't be waiting weeks.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-1">
                <h3 className="font-medium">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-semibold tracking-tight mb-10">Frequently asked questions</h2>
          <FAQSection />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-zinc-100 py-16 bg-zinc-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Ready to stop guessing?</h2>
          <p className="text-zinc-500 mb-6">Pick a package and have your audit ready in 48 hours.</p>
          <a
            href="#pricing"
            className="inline-block px-8 py-3 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Get an Audit
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-400">
        <p>&copy; {new Date().getFullYear()} Audit Service. All rights reserved.</p>
      </footer>
    </div>
  );
}
