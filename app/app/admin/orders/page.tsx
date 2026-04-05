import type { Metadata } from "next";
import { db } from "@/lib/db/local";
import { OrderStatus } from "@/lib/types/order";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin -- Orders",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  "new": "bg-blue-100 text-blue-700",
  "intake-complete": "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-purple-100 text-purple-700",
  "review": "bg-orange-100 text-orange-700",
  "delivered": "bg-green-100 text-green-700",
  "archived": "bg-zinc-100 text-zinc-600",
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const filterStatus = (params.status as OrderStatus) || undefined;
  const orders = await db.findAll(filterStatus);

  return (
    <div className="min-h-screen bg-zinc-50">
      <nav className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
          <a href="/" className="font-semibold text-lg tracking-tight">
            audit<span className="text-zinc-400">.dev</span>
          </a>
          <span className="text-sm text-zinc-400">Admin</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Filter:</span>
            {(["all", "new", "intake-complete", "in-progress", "review", "delivered", "archived"] as const).map((s) => (
              <Link
                key={s}
                href={`/admin/orders${s === "all" ? "" : `?status=${s}`}`}
                className={`px-2 py-1 rounded ${
                  (!filterStatus && s === "all") || filterStatus === s
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100"
                }`}
              >
                {s === "all" ? "All" : s}
              </Link>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 text-sm">
            No orders found.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="bg-white border border-zinc-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <code className="text-xs bg-zinc-100 px-2 py-1 rounded">{order.id}</code>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                    <span className="text-sm font-medium">{order.packageTier}</span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {order.intake && (
                  <div className="mt-2 text-sm text-zinc-500">
                    <span className="font-medium text-zinc-700">{order.intake.name}</span>
                    {" "}-- {order.intake.email}
                    {" "}--<span className="text-zinc-400 ml-1">{order.intake.repoUrl}</span>
                  </div>
                )}
                {order.deliveryArtifacts.length > 0 && (
                  <div className="mt-2 text-xs text-zinc-400">
                    {order.deliveryArtifacts.length} file(s) delivered
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
