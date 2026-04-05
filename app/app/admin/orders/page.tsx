import type { Metadata } from "next";
import { db } from "@/lib/db/local";
import { OrderStatus } from "@/lib/types/order";
import Link from "next/link";

export const metadata: Metadata = { title: "Admin -- Orders" };

const STATUS_CONFIG: Record<OrderStatus, { label: string; dot: string }> = {
  "new": { label: "New", dot: "bg-blue-500" },
  "intake-complete": { label: "Intake done", dot: "bg-yellow-500" },
  "in-progress": { label: "In progress", dot: "bg-violet-500" },
  "review": { label: "In review", dot: "bg-orange-500" },
  "delivered": { label: "Delivered", dot: "bg-green-500" },
  "archived": { label: "Archived", dot: "bg-zinc-400" },
};

function fmtPkg(pkg: string): string {
  return pkg.replace("audit-", "").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const filterStatus = (params.status as OrderStatus) || undefined;
  const allOrders = await db.findAll();
  const filtered = filterStatus ? allOrders.filter((o) => o.status === filterStatus) : allOrders;

  const statusFilters: { key: string; label: string }[] = [
    { key: "all", label: "All" },
    { key: "new", label: "New" },
    { key: "intake-complete", label: "Intake" },
    { key: "in-progress", label: "In Progress" },
    { key: "review", label: "Review" },
    { key: "delivered", label: "Delivered" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50/50">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <a href="/" className="text-lg font-semibold tracking-tight text-zinc-900">
            audit<span className="text-zinc-400">.dev</span>
          </a>
          <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">Admin</span>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Orders</h1>
            <p className="text-sm text-zinc-500 mt-1">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {statusFilters.map((sf) => {
              const count = sf.key === "all" ? allOrders.length : allOrders.filter((o) => o.status === sf.key).length;
              const isActive = (!filterStatus && sf.key === "all") || filterStatus === sf.key;
              if (count === 0 && sf.key !== "all") return null;
              return (
                <Link
                  key={sf.key}
                  href={`/admin/orders${sf.key === "all" ? "" : `?status=${sf.key}`}`}
                  className={`px-3 py-1.5 rounded-md font-medium text-xs transition-colors inline-flex items-center gap-1.5 ${
                    isActive ? "bg-zinc-900 text-white" : "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
                  }`}>
                  {sf.label}
                  <span className="opacity-60">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <svg className="mx-auto h-12 w-12 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
            </svg>
            <p className="mt-4 text-sm text-zinc-400">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="bg-white border border-zinc-200 rounded-xl p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                      <span className="text-sm font-medium text-zinc-900">{cfg.label}</span>
                      <span className="text-xs text-zinc-300">--</span>
                      <code className="text-xs bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-mono">{order.id}</code>
                    </div>
                    <time className="text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </time>
                  </div>
                  <div className="flex items-center justify-between">
                    {order.intake ? (
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-zinc-900">{order.intake.name}</span>
                        <span className="text-sm text-zinc-500 ml-2">{order.intake.email}</span>
                        <p className="text-xs text-zinc-400 mt-0.5 truncate">{order.intake.repoUrl}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-zinc-400 italic">Awaiting intake form</span>
                    )}
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-md">{fmtPkg(order.packageTier)}</span>
                      {order.deliveryArtifacts.length > 0 && (
                        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
