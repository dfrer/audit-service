import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";

const CHECKS = [
  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", text: "Dependency inventory and vulnerability scan" },
  { icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", text: "Architecture and structure review" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Prioritized risk list with concrete fixes" },
  { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", text: "Realistic timeline you can actually follow" },
];

function CheckIcon({ d }: { d: string }) {
  return (
    <svg className="w-5 h-5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-900 ring-1 ring-inset ring-zinc-200">
          {num}
        </div>
        <h3 className="font-medium text-zinc-900">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-zinc-500 pl-16">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
            audit<span className="text-zinc-400">.dev</span>
          </a>
          <div className="flex items-center gap-1">
            <a href="#how-it-works" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-50">
              How it works
            </a>
            <a href="#pricing" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-50">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors rounded-md hover:bg-zinc-50">
              FAQ
            </a>
            <a
              href="#pricing"
              className="ml-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Get an Audit
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Ship with a plan.{" "}
            <span className="text-zinc-400">Stop guessing.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Send me your repo. I will analyze it, find the risks, and give you a{" "}
            prioritized execution plan with a realistic timeline. Not consulting,{" "}
            not vague feedback -- a concrete plan you can follow.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Get an Audit
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors"
            >
              See how it works
            </a>
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {CHECKS.map((c) => (
              <li key={c.text} className="flex items-start gap-3 text-sm text-zinc-600">
                <CheckIcon d={c.icon} />
                <span>{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-y border-zinc-100 bg-zinc-50/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How it works</h2>
            <p className="mt-3 text-zinc-500">Three steps between stuck and a plan.</p>
          </div>
          <div className="grid gap-12 sm:grid-cols-3">
            <StepCard num="1" title="Buy and fill out the intake form" desc="Pick a package, pay via Stripe, then tell me about your repo, goals, and any constraints." />
            <StepCard num="2" title="I analyze your codebase" desc="I run a structured audit: dependencies, architecture, security, maintainability. Then I write a report." />
            <StepCard num="3" title="You get a plan" desc="A PDF report with prioritized findings, recommendations ranked by impact, and a timeline. Scaffold tier includes a PR." />
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Pricing</h2>
            <p className="mt-3 text-zinc-500">Fixed price. Fixed scope. No surprises.</p>
          </div>
          <PricingSection />
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-zinc-100 bg-zinc-50/50 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Why this works</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: "Fixed price, fixed scope", desc: "You know exactly what you are getting and what it costs before you buy. No hourly billing, no scope creep." },
              { title: "Built for developers", desc: "No jargon, no vague best practices. You get concrete findings tied to your actual codebase." },
              { title: "Fast turnaround", desc: "48 hours for the basic audit, 5 days max for the full scaffold. You won't be waiting weeks." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-sm">
                <h3 className="font-medium text-zinc-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Frequently asked questions</h2>
            <p className="mt-3 text-zinc-500 mb-10">Everything you need to know before getting started.</p>
            <FAQSection />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-zinc-900 py-24 text-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Ready to stop guessing?</h2>
          <p className="mt-4 text-lg text-zinc-400">Pick a package and have your audit ready in 48 hours.</p>
          <a href="#pricing" className="mt-8 inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-zinc-900 bg-white rounded-lg hover:bg-zinc-100 transition-colors">
            Get an Audit
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <p className="text-sm text-zinc-500">2026 audit.dev. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="/intake" className="hover:text-zinc-900 transition-colors">Intake</a>
            <a href="/admin/orders" className="hover:text-zinc-900 transition-colors">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
