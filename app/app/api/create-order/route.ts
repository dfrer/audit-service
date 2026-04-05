// POST /api/create-order -- handles intake form submission
// Creates or updates an order with intake data

import { db } from "@/lib/db/local";
import { IntakeData, PackageTier, PACKAGE_CONFIG } from "@/lib/types/order";
import { sendOrderConfirmationEmail } from "@/lib/adapters/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      name,
      email,
      repoUrl,
      projectSummary,
      goals,
      constraints,
      packageTier,
      acknowledgedPrivateRepoPolicy,
    } = body;

    // Validation
    if (!name || name.length < 2) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!repoUrl) {
      return Response.json({ error: "Repository URL is required" }, { status: 400 });
    }
    if (!projectSummary || projectSummary.length < 20) {
      return Response.json({ error: "Project summary is required (min 20 chars)" }, { status: 400 });
    }
    if (!PACKAGE_CONFIG[packageTier as PackageTier]) {
      return Response.json({ error: "Invalid package tier" }, { status: 400 });
    }
    if (!acknowledgedPrivateRepoPolicy) {
      return Response.json({ error: "You must acknowledge the private repo policy" }, { status: 400 });
    }

    const intake: IntakeData = {
      name,
      email,
      repoUrl,
      projectSummary,
      goals: goals || undefined,
      constraints: constraints || undefined,
      packageTier: packageTier as PackageTier,
      acknowledgedPrivateRepoPolicy,
    };

    let order;
    if (orderId) {
      // Update existing order from Stripe checkout
      order = await db.update(orderId, { intake, status: "intake-complete" });
    } else {
      // Create new order (free entry point, payment handled separately)
      order = await db.create({ packageTier: packageTier as PackageTier });
      order = await db.update(order.id, { intake, status: "intake-complete" });
    }

    // Send confirmation email (async, non-blocking for the response)
    const intakeUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/intake?orderId=${order.id}`;
    sendOrderConfirmationEmail(order.id, email, intakeUrl).catch((err) => {
      console.error("Failed to send confirmation email:", err);
    });

    return Response.json({ orderId: order.id, status: "intake-complete" });
  } catch (err) {
    console.error("Order creation error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
