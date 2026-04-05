// POST /api/stripe-webhook -- handles Stripe webhook events
// PLACEHOLDER: Requires stripe npm package for real verification

export async function POST(req: Request) {
  try {
    // PLACEHOLDER: In production, verify the webhook signature:
    // const sig = req.headers.get("stripe-signature") || "";
    // const raw = await req.text();
    // const event = await constructWebhookEvent(raw, sig);
    // (see lib/adapters/stripe.ts)

    const body = await req.json().catch(() => ({}));
    const eventType = body.type || "unknown";

    console.log(`[Stripe Webhook] Event: ${eventType}`, body.id || "");

    // Handle checkout.session.completed
    if (eventType === "checkout.session.completed") {
      const session = body.data?.object || {};
      const orderId = session.metadata?.orderId;
      const customerEmail = session.customer_email;

      if (orderId) {
        // Order is already created via intake or will be created here
        // In a full implementation, update order status and send confirmation
        console.log(`[Stripe Webhook] Payment confirmed for order ${orderId}`);
      }

      if (customerEmail && !orderId) {
        // If no order ID, create one from the session metadata
        console.log(`[Stripe Webhook] New payment from ${customerEmail}, no order ID in metadata`);
      }
    }

    // Handle checkout.session.expired
    if (eventType === "checkout.session.expired") {
      console.log("[Stripe Webhook] Checkout session expired");
    }

    // Handle payment_intent.payment_failed
    if (eventType === "payment_intent.payment_failed") {
      console.log("[Stripe Webhook] Payment failed");
      // In production: notify customer, set order status appropriately
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Error:", err);
    return Response.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
