// GET /api/orders -- returns orders list (protected by admin token)
// Used by the admin orders page.

import { db } from "@/lib/db/local";
import { OrderStatus } from "@/lib/types/order";

const ADMIN_TOKEN = process.env.ADMIN_SECRET || "admin-dev-only-token";

export async function GET(req: Request) {
  // Check admin token from header or query param
  const { searchParams } = new URL(req.url);
  const token = req.headers.get("x-admin-token") || searchParams.get("token");

  if (!token || token !== ADMIN_TOKEN) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = searchParams.get("status") as OrderStatus | undefined;
  try {
    const orders = await db.findAll(status);
    return Response.json({ orders });
  } catch (err) {
    console.error("Error listing orders:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
