import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Submitted -- AI Project Audit",
};

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center">
          <a href="/" className="font-semibold text-lg tracking-tight">
            audit<span className="text-zinc-400">.dev</span>
          </a>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-6 text-green-600">&#10003;</div>
        <h1 className="text-2xl font-semibold tracking-tight mb-3">Order submitted</h1>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-md mx-auto">
          Thanks for your order. You will receive a confirmation email shortly.
          If you have not already done so, please complete the intake form so we can begin your audit.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/intake"
            className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            Fill Out Intake Form
          </a>
          <a
            href="/"
            className="px-6 py-2.5 rounded-full border border-zinc-200 text-sm font-medium hover:bg-zinc-50 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
