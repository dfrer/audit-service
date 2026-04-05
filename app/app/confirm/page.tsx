"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PACKAGE_CONFIG, type PackageTier } from "@/lib/types/order";
import Link from "next/link";

function ConfirmContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const packageTier = (params.get("packageTier") as PackageTier) || "audit-lite";
  const pkg = PACKAGE_CONFIG[packageTier];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <nav className="sticky top-0 z-50 border-b" style={{ borderColor: "var(--border)", background: "rgba(12,12,12,0.85)", backdropFilter: "blur(16px)" }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="mono text-sm font-medium tracking-wider" style={{ color: "var(--text)" }}>
            audit<span style={{ color: "var(--accent)" }}>.dev</span>
          </Link>
        </div>
      </nav>
      <main className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto w-16 h-16 mb-8 flex items-center justify-center rounded-full" style={{ background: "rgba(78,184,72,0.12)", border: "1px solid rgba(78,184,72,0.3)" }}>
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold mb-3" style={{ color: "var(--text)" }}>Order submitted</h1>
        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
          Your intake for <span style={{ color: "var(--accent)" }}>{pkg.name}</span> has been received.
        </p>
        {orderId && (
          <p className="mono text-xs mt-4 mb-1" style={{ color: "var(--text-muted)" }}>Order ID: {orderId}</p>
        )}
        <p className="text-xs mt-6 mb-10 mx-auto max-w-md" style={{ color: "var(--text-muted)" }}>
          You will receive an email with next steps once this order is reviewed and confirmed.
        </p>
        <Link href="/" className="inline-flex px-6 py-2.5 text-xs mono font-medium rounded transition-colors" style={{ background: "var(--accent)", color: "var(--bg)" }}>
          BACK HOME
        </Link>
      </main>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<p className="text-center p-20 text-xs mono" style={{ color: "var(--text-muted)" }}>Loading...</p>}>
      <ConfirmContent />
    </Suspense>
  );
}
