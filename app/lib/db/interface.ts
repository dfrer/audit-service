import { Order, CreateOrderInput, UpdateOrderInput, OrderStatus } from "@/lib/types/order";

// Database interface -- implement this for any backend (local, Supabase, Postgres, etc.)
export interface OrdersDb {
  create(input: CreateOrderInput): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(status?: OrderStatus): Promise<Order[]>;
  update(id: string, input: UpdateOrderInput): Promise<Order>;
  delete(id: string): Promise<void>;
}
