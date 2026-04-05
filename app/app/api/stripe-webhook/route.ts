// POST /api/stripe-webhook -- receives Stripe webhook events
// Verifies signature, updates order status based on payment events.

import { db } from "@/lib/db/local";
import { verifyStripeWebhook } from "@/lib/adapters/stripe";
import { sendEmail } from "@/lib/adapters/email";
import { PACKAGE_CONFIG, AUDIT_CATEGORY_LABELS } from "@/lib/types/order";

export async function POST(req: Request) {
  try {
    const rawBody = await req.arrayBuffer();
    const body = Buffer.from(rawBody);
    const sig = req.headers.get("stripe-signature") || "";

    // Verify the webhook signature
    let event;
    try {
      event = await verifyStripeWebhook(body, sig);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const orderId = event.id; // Stripe session ID
      const paymentIntentId = event.paymentIntentId;

      // Find order by stripeSessionId
      const allOrders = await db.findAll();
      const order = allOrders.find(
        (o) => o.stripeSessionId === orderId
      );

      if (!order) {
        console.warn(`[Webhook] No order found for stripe session: ${orderId}`);
        return Response.json({ received: true });
      }

      // Update order status
      await db.update(order.id, {
        status: "payment-confirmed",
        stripePaymentIntentId: paymentIntentId,
      });

      // Send payment confirmation email
      const pkgConfig = PACKAGE_CONFIG[order.packageTier];
      const catLabel = AUDIT_CATEGORY_LABELS[order.intake!.auditCategory];
      sendEmail({
        to: order.intake!.email,
        subject: `Payment confirmed -- ${pkgConfig.name}`,
        text: `Hi ${order.intake!.name},\n\nPayment received for your ${pkgConfig.name} (${catLabel}).\n\nOrder ID: ${order.id}\n\nWe will start your audit now. You will be notified when it is ready.`,
      }).catch(console.error);
    }

    // Handle checkout.session.expired
    if (event.type === "checkout.session.expired") {
      const allOrders = await db.findAll("intake-complete");
      const session = (await req.clone().json())?.data?.object;
      if (session?.client_reference_id) {
        const order = await db.findById(session.client_reference_id);
        if (order && order.status === "intake-complete") {
          console.log(`[Webhook] Checkout expired for order: ${order.id}`);
          // Keep as intake-complete so they can retry
        }
      }
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return Response.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
