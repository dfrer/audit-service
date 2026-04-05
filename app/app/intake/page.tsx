import IntakeForm from "@/components/IntakeForm";

export default function IntakePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(12,12,12,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="/" className="mono text-sm font-medium tracking-wider" style={{ color: "var(--text)" }}>
            audit<span style={{ color: "var(--accent)" }}>.dev</span>
          </a>
          <a href="/" className="mono text-xs transition-colors hover:text-amber-500" style={{ color: "var(--text-muted)" }}>
            BACK TO SITE
          </a>
        </div>
      </nav>

      {/* FORM */}
      <main className="mx-auto max-w-2xl px-6 py-16">
        <div className="mb-8">
          <div className="mono-sm mb-2" style={{ color: "var(--accent-dim)" }}>INTAKE FORM</div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text)" }}>Tell us about your AI setup</h1>
          <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
            We will use this to scope your audit. Be honest -- the more we know, the better the findings.
          </p>
        </div>
        <IntakeForm />
      </main>
    </div>
  );
}
