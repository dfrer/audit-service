// POST /api/create-checkout-session -- creates a Stripe Checkout session for an existing order
// The intake form creates the order first (status: intake-complete), then this endpoint
// redirects the customer to Stripe to pay.

import { db } from "@/lib/db/local";
import { createCheckoutSession } from "@/lib/adapters/stripe";
import { PACKAGE_CONFIG, type PackageTier } from "@/lib/types/order";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return Response.json({ error: "orderId is required" }, { status: 400 });
    }

    const order = await db.findById(orderId);
    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "intake-complete") {
      return Response.json({ error: "Order is not in a payable state" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const pkgConfig = PACKAGE_CONFIG[order.packageTier];

    const checkoutUrl = await createCheckoutSession({
      orderId: order.id,
      packageTier: order.packageTier,
      successUrl: `${baseUrl}/confirm?orderId=${order.id}&packageTier=${order.packageTier}`,
      cancelUrl: `${baseUrl}/intake?orderId=${order.id}`,
    });

    return Response.json({ checkoutUrl });
  } catch (err) {
    console.error("Checkout session error:", err);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
