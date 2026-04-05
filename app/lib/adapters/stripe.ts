// Stripe adapter -- real implementation using the stripe npm package.
// Reads Stripe credentials from environment variables.
// Falls back to logged placeholder when credentials are not configured.

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

// Stripe Price IDs from env, with placeholders as fallback
const PRICE_MAP: Record<string, string> = {
  "audit-lite": process.env.STRIPE_PRICE_LITE || "price_PLACEHOLDER_lite",
  "audit-standard": process.env.STRIPE_PRICE_STANDARD || "price_PLACEHOLDER_standard",
  "audit-scaffold": process.env.STRIPE_PRICE_SCAFFOLD || "price_PLACEHOLDER_scaffold",
};

export interface CreateCheckoutSessionParams {
  orderId: string;
  priceId?: string;
  packageTier: string;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<string> {
  // If no Stripe secret key is configured, return a placeholder URL
  if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.includes("PLACEHOLDER")) {
    console.warn(
      `[Stripe] No real API key configured. Using placeholder checkout for order ${params.orderId}`
    );
    return `https://checkout.stripe.com/PLACEHOLDER?price=${
      params.priceId || "not_configured"
    }&metadata_orderId=${params.orderId}`;
  }

  // Dynamic import to avoid crash if stripe is not installed
  const { Stripe } = await import("stripe");
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });

  const priceId =
    params.priceId || PRICE_MAP[params.packageTier] || PRICE_MAP["audit-lite"];

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    client_reference_id: params.orderId,
    metadata: {
      orderId: params.orderId,
      packageTier: params.packageTier,
    },
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout session URL");
  }

  return session.url;
}

export async function verifyStripeWebhook(
  payload: string | Buffer,
  sig: string
): Promise<{ id: string; type: string; paymentIntentId?: string }> {
  if (!STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook credentials not configured");
  }

  const { Stripe } = await import("stripe");
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
  });

  const event = stripe.webhooks.constructEvent(
    payload,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  const result: { id: string; type: string; paymentIntentId?: string } = {
    id: event.id,
    type: event.type,
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    result.paymentIntentId = session.payment_intent;
  }

  return result;
}
