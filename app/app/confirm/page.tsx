import Link from "next/link";

export default function ConfirmPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
            audit<span className="text-zinc-400">.dev</span>
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-md px-6 py-32 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">Order submitted</h1>
        <p className="text-zinc-500 text-sm leading-relaxed mb-10">
          You will receive a confirmation email shortly. If you have not completed the intake form yet, please do so now.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/intake" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
            Fill out intake form
          </Link>
          <Link href="/" className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
