import type { Metadata } from "next";
import IntakeForm from "@/components/IntakeForm";

export const metadata: Metadata = {
  title: "Complete Your Intake Form -- AI Project Audit",
};

export default async function IntakePage(props: { searchParams: Promise<{ package?: string; orderId?: string }> }) {
  const params = await props.searchParams;
  const preselectedPackage = params.package || undefined;
  const orderId = params.orderId || undefined;

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <a href="/" className="font-semibold text-lg tracking-tight">
            audit<span className="text-zinc-400">.dev</span>
          </a>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Intake form</h1>
          <p className="mt-2 text-zinc-500 text-sm">
            Tell us about your project so we can start the audit. This takes about 2 minutes.
          </p>
          {orderId && (
            <p className="mt-1 text-xs text-zinc-400">Order: {orderId}</p>
          )}
        </div>
        <IntakeForm preselectedPackage={preselectedPackage} orderId={orderId} />
      </main>
    </div>
  );
}
