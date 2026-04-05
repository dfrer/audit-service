// Stripe adapter -- uses Stripe Checkout.
// Requires STRIPE_SECRET_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
// Products and prices should be created in Stripe dashboard or via API.

const PRICE_IDS: Record<string, string> = {
  "audit-lite": process.env.STRIPE_PRICE_LITE || "price_PLACEHOLDER_lite",
  "audit-standard": process.env.STRIPE_PRICE_STANDARD || "price_PLACEHOLDER_standard",
  "audit-scaffold": process.env.STRIPE_PRICE_SCAFFOLD || "price_PLACEHOLDER_scaffold",
};

const STRIPE_MODE = process.env.NEXT_PUBLIC_STRIPE_MODE || "test";

export interface CreateCheckoutSessionParams {
  priceId: string;
  orderId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  domain: string;
}

// PLACEHOLDER: This function requires the stripe npm package.
// Install with: npm install stripe
// Then uncomment the implementation below.

/*
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function createCheckoutSession(params: CreateCheckoutSessionParams): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerEmail,
    metadata: { orderId: params.orderId },
  });

  if (!session.url) {
    throw new Error("Failed to create Stripe Checkout session");
  }
  return session.url;
}
*/

export async function createCheckoutSession(_params: CreateCheckoutSessionParams): Promise<string> {
  // Placeholder -- returns the Stripe Checkout URL template
  // Replace with real implementation once stripe package is installed
  console.warn("[Stripe] createCheckoutSession is a placeholder. Install stripe package to enable.");
  return `https://checkout.stripe.com/PLACEHOLDER?price=${_params.priceId}&metadata_orderId=${_params.orderId}`;
}

export async function constructWebhookEvent(body: string, signature: string) {
  // PLACEHOLDER: Requires stripe package
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });
  // return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  console.warn("[Stripe] constructWebhookEvent is a placeholder. Install stripe package to enable.");
  return { type: "checkout.session.completed", data: { object: {} } };
}

export function getPriceId(packageTier: string): string {
  return PRICE_IDS[packageTier] || PRICE_IDS["audit-lite"];
}

export function getStripeMode(): string {
  return STRIPE_MODE;
}
