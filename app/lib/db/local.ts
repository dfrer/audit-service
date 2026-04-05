import { OrdersDb } from "./interface";
import { Order, CreateOrderInput, UpdateOrderInput, OrderStatus } from "@/lib/types/order";

// Local/mock implementation using in-memory Map.
// Replace this with SupabasePostgresDb or similar for production.
// Data is lost on server restart -- use only for development/testing.

const store = new Map<string, Order>();

function generateId(): string {
  return "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function now(): string {
  return new Date().toISOString();
}

export const localDb: OrdersDb = {
  async create(input: CreateOrderInput): Promise<Order> {
    const order: Order = {
      id: generateId(),
      stripeSessionId: input.stripeSessionId,
      status: "new",
      packageTier: input.packageTier,
      intake: null,
      internalNotes: "",
      deliveryArtifacts: [],
      createdAt: now(),
      updatedAt: now(),
    };
    store.set(order.id, order);
    return order;
  },

  async findById(id: string): Promise<Order | null> {
    return store.get(id) ?? null;
  },

  async findAll(status?: OrderStatus): Promise<Order[]> {
    const orders = Array.from(store.values());
    if (status) {
      return orders.filter((o) => o.status === status);
    }
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async update(id: string, input: UpdateOrderInput): Promise<Order> {
    const existing = store.get(id);
    if (!existing) {
      throw new Error(`Order not found: ${id}`);
    }
    const updated: Order = {
      ...existing,
      ...input,
      updatedAt: now(),
      ...(input.status === "delivered" && !existing.deliveredAt ? { deliveredAt: now() } : {}),
      ...(input.status === "archived" && !existing.archivedAt ? { archivedAt: now() } : {}),
    };
    store.set(id, updated);
    return updated;
  },

  async delete(id: string): Promise<void> {
    store.delete(id);
  },
};

// Re-export the default DB instance.
// Switch to Supabase or Postgres by changing this export.
export const db: OrdersDb = localDb;
