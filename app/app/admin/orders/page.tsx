"use client";

import { useEffect, useState } from "react";
import { AUDIT_CATEGORY_LABELS, PACKAGE_CONFIG, type Order, type OrderStatus } from "@/lib/types/order";

const STATUS_COLORS: Record<OrderStatus, string> = {
  "new": "#c49a3c",
  "intake-complete": "#4a9e6e",
  "payment-confirmed": "#4a9e6e",
  "in-progress": "#5b8dd9",
  "review": "#a05bd5",
  "delivered": "#4a9e6e",
  "archived": "#6b6860",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter !== "all") params.set("status", filter);
    const url = `/api/orders?${params.toString()}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load orders: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [filter]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="text-center">
          <p className="text-sm mb-2" style={{ color: "var(--red)" }}>{error}</p>
          <p className="text-xs mono" style={{ color: "var(--text-muted)" }}>Admin access required</p>
        </div>
      </div>
    );
  }

  const counts: Record<string, number> = { all: orders.length };
  orders.forEach((o) => {
    counts[o.status] = (counts[o.status] || 0) + 1;
  });

  return (
    <div className="min-h-screen py-8" style={{ background: "var(--bg)" }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-medium" style={{ color: "var(--text)" }}>Orders</h1>
          <a href="/" className="mono text-xs transition-colors hover:text-amber-500" style={{ color: "var(--text-muted)" }}>
            &larr; site
          </a>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(STATUS_COLORS) as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="px-3 py-1 rounded text-xs mono transition-colors"
              style={{
                background: filter === status ? "var(--accent-glow)" : "var(--surface)",
                borderColor: filter === status ? "var(--accent-dim)" : "var(--border)",
                color: filter === status ? "var(--accent)" : "var(--text-muted)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              {status} {counts[status] ? `(${counts[status]})` : ""}
            </button>
          ))}
          {filter !== "all" && (
            <button
              onClick={() => setFilter("all")}
              className="px-3 py-1 rounded text-xs mono transition-colors"
              style={{ color: "var(--text-secondary)", background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              all ({counts.all})
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-xs mono py-16 text-center" style={{ color: "var(--text-muted)" }}>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-xs mono py-16 text-center" style={{ color: "var(--text-muted)" }}>No orders found.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => {
              const pkgConfig = PACKAGE_CONFIG[order.packageTier];
              const statusColor = STATUS_COLORS[order.status] || "var(--text-muted)";
              return (
                <div key={order.id} className="border rounded p-4" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="mono text-xs font-medium" style={{ color: "var(--text)" }}>{order.id}</span>
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: statusColor }} />
                        <span className="mono text-xs" style={{ color: statusColor }}>{order.status}</span>
                      </div>
                      {order.intake && (
                        <div className="text-xs space-y-0.5" style={{ color: "var(--text-muted)" }}>
                          <div>{order.intake.name} -- {order.intake.email}</div>
                          <div className="mono text-xs" style={{ color: "var(--text-muted)" }}>
                            {AUDIT_CATEGORY_LABELS[order.intake.auditCategory]} -- {pkgConfig?.name}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="mono text-xs" style={{ color: "var(--text-muted)" }}>{order.createdAt.slice(0, 10)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
