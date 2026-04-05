import { OrdersDb } from "./interface";
import { Order, CreateOrderInput, UpdateOrderInput, OrderStatus } from "@/lib/types/order";
import * as fs from "fs/promises";
import * as path from "path";

// JSONL-based persistence. Each order is one line in a JSONL file.
// Survives restarts and redeployments. No external dependencies.
// For production scaling, swap to SupabasePostgresDb by changing the export at the bottom.

const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), "..", "storage");
const ORDERS_FILE = path.join(STORAGE_DIR, "orders.jsonl");

async function ensureFile(): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
  try {
    await fs.access(ORDERS_FILE);
  } catch {
    await fs.writeFile(ORDERS_FILE, "");
  }
}

async function readAll(): Promise<Map<string, Order>> {
  await ensureFile();
  const content = await fs.readFile(ORDERS_FILE, "utf-8");
  const store = new Map<string, Order>();
  if (!content.trim()) return store;

  for (const line of content.trim().split("\n")) {
    if (!line.trim()) continue;
    try {
      const order: Order = JSON.parse(line);
      // Latest line wins for duplicate IDs (update writes append)
      store.set(order.id, order);
    } catch {
      // Skip malformed lines
    }
  }
  return store;
}

function now(): string {
  return new Date().toISOString();
}

function generateId(): string {
  return "ord_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// In-memory cache backed by JSONL file writes
let cache: Map<string, Order> | null = null;

async function getCache(): Promise<Map<string, Order>> {
  if (cache === null) {
    cache = await readAll();
  }
  return cache;
}

async function writeCache(store: Map<string, Order>): Promise<void> {
  await ensureFile();
  const lines = Array.from(store.values()).map(
    (o) => JSON.stringify(o)
  );
  await fs.writeFile(ORDERS_FILE, lines.join("\n") + (lines.length ? "\n" : ""));
  cache = store;
}

export const jsonlDb: OrdersDb = {
  async create(input: CreateOrderInput): Promise<Order> {
    const store = await getCache();
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
    await writeCache(store);
    return order;
  },

  async findById(id: string): Promise<Order | null> {
    const store = await getCache();
    return store.get(id) ?? null;
  },

  async findAll(status?: OrderStatus): Promise<Order[]> {
    const store = await getCache();
    const orders = Array.from(store.values());
    if (status) {
      return orders.filter((o) => o.status === status);
    }
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async update(id: string, input: UpdateOrderInput): Promise<Order> {
    const store = await getCache();
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
    await writeCache(store);
    return updated;
  },

  async delete(id: string): Promise<void> {
    const store = await getCache();
    store.delete(id);
    await writeCache(store);
  },
};

// The default DB instance. Switch implementations here.
// For production with credentials, replace with:
//   export const db: OrdersDb = supabaseDb;
// or
//   export const db: OrdersDb = postgresDb;
export const db: OrdersDb = jsonlDb;
