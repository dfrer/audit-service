import PricingSection from "@/components/PricingSection";
import FAQSection from "@/components/FAQSection";
import AsciiBackground from "@/components/AsciiBackground";
import ShoggothCanvas from "@/components/ShoggothCanvas";

const PILLARS = [
  { num: "01", label: "Business AI Operations", desc: "Tool sprawl, cost leakage, workflow gaps, privacy risk" },
  { num: "02", label: "Personal AI Workflows", desc: "Prompt hygiene, tool confusion, cognitive overload" },
  { num: "03", label: "Local / Self-Hosted AI", desc: "Model choice, hardware fit, deployment sanity" },
  { num: "04", label: "AI Coding Workflows", desc: "Agent orchestration, repo hygiene, testing bottlenecks" },
];

const STATS = [
  { val: "6", label: "Audit categories" },
  { val: "$75", label: "Starting price" },
  { val: "48h", label: "Fastest delivery" },
  { val: "100%", label: "Fixed price" },
];

const STEPS = [
  { step: "01", title: "Pick a package, fill intake", desc: "Choose your audit type, pay via Stripe, and tell us what you are working with." },
  { step: "02", title: "We run the audit", desc: "Structured analysis across your tools, workflows, costs, and gaps. Real findings, not theory." },
  { step: "03", title: "You get a report + plan", desc: "Prioritized findings, concrete recommendations, and an action plan you can follow." },
];

const WHY = [
  { title: "Honest, not flattering", desc: "We will tell you when a tool is wasted money. No vendor partnerships, no affiliate links." },
  { title: "Practical over academic", desc: "Actual findings from your actual setup. No generic AI best-practices slides." },
  { title: "Fast, not forever", desc: "48 hours for the basic audit. 5 days max with a roadmap. You will not wait weeks." },
];

const FAQS = [
  { q: "What exactly do you audit?", a: "We audit how you actually use AI in practice -- your tool stack, workflows, costs, automation gaps, privacy handling, and whether your setup is actually helping or just adding complexity. Business operations, personal workflows, local setups, coding workflows." },
  { q: "Do I need a codebase?", a: "Not necessarily. We audit AI usage across business, personal, local setups, and coding. A repo is optional for non-code audits." },
  { q: "What do I get back?", a: "A concrete report with findings ranked by impact, specific recommendations, and an action plan. Lite is a prioritized fix list. Standard adds a roadmap. Scaffold adds implementation scaffolding." },
  { q: "How fast?", a: "48 hours for Lite, 72 hours for Standard, 5 business days for Scaffold. Delivery starts after payment confirmation." },
  { q: "Is this generic advice?", a: "No. Every finding is specific to your actual tools, workflows, and setup. Not a templated best-practices deck." },
  { q: "Refund policy?", a: "If we have not started, yes. Once work has begun, we will make the deliverable useful for you." },
];

const ACCENT = "var(--accent)";
const ACCENT_DIM = "var(--accent-dim)";
const ACCENT_GLOW = "var(--accent-glow)";
const BG = "var(--bg)";
const SURFACE = "var(--surface)";
const BORDER = "var(--border)";
const TEXT = "var(--text)";
const TEXT_SEC = "var(--text-secondary)";
const TEXT_MUTED = "var(--text-muted)";

function Diamond({ className, style: s }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={`w-2.5 h-2.5 shrink-0 ${className || ""}`} viewBox="0 0 12 12" fill="currentColor" style={{ color: "var(--accent-dim)", ...s }}>
      <path d="M6 0L12 6L6 12L0 6Z" />
    </svg>
  );
}

function NavPill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-3 py-1.5 text-xs mono transition-colors rounded"
      style={{ color: TEXT_SEC }}
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative" style={{ background: BG }}>
      <AsciiBackground opacity={0.9} zIndex={0} />
      <ShoggothCanvas />

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b" style={{ borderColor: BORDER, background: "rgba(12,12,12,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="mono text-sm font-medium tracking-wider" style={{ color: TEXT }}>
            audit<span style={{ color: ACCENT }}>.dev</span>
          </a>
          <div className="flex items-center gap-1">
            <NavPill href="#diagnose">DIAGNOSE</NavPill>
            <NavPill href="#pricing">PRICING</NavPill>
            <NavPill href="#faq">FAQ</NavPill>
            <a href="#pricing"
               className="ml-3 px-4 py-1.5 text-xs mono font-medium rounded transition-opacity"
               style={{ background: ACCENT, color: BG }}>
              GET STARTED
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 pt-32 pb-24 sm:pt-40">
        <div className="max-w-xl">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond />
            AI AUDIT SERVICE
          </div>
          <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ color: TEXT }}>
            You are using AI.
            <br />
            <span style={{ color: ACCENT }}>Is it actually working?</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed" style={{ color: TEXT_SEC }}>
            A practical audit of how you or your team actually uses AI --
            what is working, what is bleeding money, what is quietly broken,
            and what to fix first. Fixed price. No fluff.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {/* PRIMARY CTA TENDRIL ANCHOR */}
            <div data-shoggoth="cta-primary" className="contents">
              <a href="#pricing"
                 className="px-6 py-3 text-sm mono font-medium rounded transition-opacity hover:opacity-85"
                 style={{ background: ACCENT, color: BG }}>
                GET AN AUDIT
              </a>
            </div>
            <a href="#diagnose"
               className="px-6 py-3 text-sm mono font-medium rounded border transition-colors hover:text-zinc-100"
               style={{ borderColor: BORDER, color: TEXT_SEC }}>
              WHAT WE AUDIT
            </a>
          </div>
        </div>

        {/* STATS */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px" style={{ background: BORDER }}>
          {STATS.map((s, i) => (
            <div key={s.label} data-shoggoth={`stat-${i}`} className="px-6 py-5" style={{ background: SURFACE }}>
              <div className="text-2xl font-bold mono" style={{ color: ACCENT }}>{s.val}</div>
              <div className="text-xs mono mt-1" style={{ color: TEXT_MUTED }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* DIAGNOSE */}
      <section id="diagnose" className="border-y py-24" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond /> WHAT WE AUDIT
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4" style={{ color: TEXT }}>Where is AI failing you?</h2>
          <p className="max-w-xl text-sm leading-relaxed mb-12" style={{ color: TEXT_SEC }}>
            Pick the lane that matches your situation. Each audit produces
            concrete findings and a prioritized action plan.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div key={p.num} data-shoggoth={`diagnose-${p.num.slice(0, 1)}`}
                   className="border rounded-lg px-6 py-5 transition-colors"
                   style={{ borderColor: BORDER, background: SURFACE }}>
                <div className="flex items-start gap-4">
                  <span className="mono-sm mt-0.5" style={{ color: ACCENT_DIM }}>{p.num}</span>
                  <div>
                    <h3 className="text-sm font-medium mb-1" style={{ color: TEXT }}>{p.label}</h3>
                    <p className="text-xs" style={{ color: TEXT_MUTED }}>{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond /> PROCESS
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-12" style={{ color: TEXT }}>Three steps to clarity</h2>
          <div className="grid gap-px sm:grid-cols-3" style={{ background: BORDER }}>
            {STEPS.map((s, i) => (
              <div key={s.step} data-shoggoth={`step-${i}`} className="px-8 py-10" style={{ background: SURFACE }}>
                <div className="mono-sm mb-4" style={{ color: ACCENT }}>{s.step}</div>
                <h3 className="text-sm font-medium mb-2" style={{ color: TEXT }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="border-y py-24" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond /> PRICING
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4" style={{ color: TEXT }}>Fixed price. Fixed scope.</h2>
          <p className="max-w-xl text-sm leading-relaxed mb-12" style={{ color: TEXT_SEC }}>
            No hourly billing. No surprise invoices. You know the cost before you start.
          </p>
          {/* Pricing cards get data-shoggoth attributes from inside PricingSection -- we pass it through */}
          <PricingSection />
        </div>
      </section>

      {/* WHY */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond /> WHY THIS WORKS
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-12" style={{ color: TEXT }}>Built for people who use AI, not sell it</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {WHY.map((item, i) => (
              <div key={item.title} data-shoggoth={`why-${i}`} className="border rounded-lg px-6 py-6" style={{ borderColor: BORDER, background: SURFACE }}>
                <Diamond className="mb-3" />
                <h3 className="text-sm font-medium mb-2" style={{ color: TEXT }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_MUTED }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-y py-24" style={{ borderColor: BORDER }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mono-sm mb-6 flex items-center gap-2" style={{ color: ACCENT_DIM }}>
            <Diamond /> FAQ
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mb-12" style={{ color: TEXT }}>Questions, answered</h2>
          <div data-shoggoth="faq-section" className="max-w-2xl">
            <FAQSection />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section data-shoggoth="final-cta" className="py-24 relative overflow-hidden" style={{ background: SURFACE }}>
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 49px, var(--accent) 49px, var(--accent) 50px)", backgroundSize: "100% 50px" }} />
        <div className="mx-auto max-w-6xl px-6 text-center relative z-10">
          <h2 className="text-3xl font-semibold tracking-tight mb-4" style={{ color: TEXT }}>
            Stop wondering if your AI setup costs more than it helps.
          </h2>
          <p className="text-sm mb-8" style={{ color: TEXT_MUTED }}>
            Get a real audit. Start fixing what is actually broken.
          </p>
          <a href="#pricing"
             className="inline-flex px-8 py-3 text-sm mono font-medium rounded transition-opacity hover:opacity-85"
             style={{ background: ACCENT, color: BG }}>
            GET AN AUDIT
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-8" style={{ borderColor: BORDER, background: BG }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <p className="text-xs mono" style={{ color: TEXT_MUTED }}>2026 audit.dev</p>
          <div className="flex items-center gap-6 text-xs mono" style={{ color: TEXT_MUTED }}>
            <a href="/intake" className="hover:text-amber-500 transition-colors">INTAKE</a>
            <a href="/admin/orders" className="hover:text-amber-500 transition-colors">ADMIN</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
