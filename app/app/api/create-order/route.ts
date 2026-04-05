// POST /api/create-order -- handles intake form submission
// Creates a new order with intake data and returns orderId for Stripe checkout redirect.

import { db } from "@/lib/db/local";
import { IntakeData, PackageTier, AuditCategory, PACKAGE_CONFIG, AUDIT_CATEGORY_LABELS } from "@/lib/types/order";
import { sendEmail } from "@/lib/adapters/email";

const validCategories: AuditCategory[] = ["business-ops", "personal-workflow", "local-selfhosted", "ai-coding", "ai-deployment", "general"];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      orderId,
      name,
      email,
      packageTier,
      auditCategory,
      contextSummary,
      toolsInUse,
      currentStack,
      mainPainPoints,
      goals,
      constraints,
      privacyConcerns,
      budgetConcerns,
      wantsImplementationHelp,
      repoUrl,
      acknowledgedTerms,
    } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!PACKAGE_CONFIG[packageTier as PackageTier]) {
      return Response.json({ error: "Invalid package tier" }, { status: 400 });
    }
    if (!auditCategory || !validCategories.includes(auditCategory as AuditCategory)) {
      return Response.json({ error: "Valid audit category is required" }, { status: 400 });
    }
    if (!contextSummary || contextSummary.trim().length < 20) {
      return Response.json({ error: "Context summary is required (min 20 chars)" }, { status: 400 });
    }
    if (!acknowledgedTerms) {
      return Response.json({ error: "You must acknowledge the terms" }, { status: 400 });
    }

    const intake: IntakeData = {
      name,
      email,
      packageTier: packageTier as PackageTier,
      auditCategory: auditCategory as AuditCategory,
      contextSummary,
      toolsInUse: toolsInUse || undefined,
      currentStack: currentStack || undefined,
      mainPainPoints: mainPainPoints || undefined,
      goals: goals || undefined,
      constraints: constraints || undefined,
      privacyConcerns: privacyConcerns || undefined,
      budgetConcerns: budgetConcerns || undefined,
      wantsImplementationHelp: wantsImplementationHelp || false,
      repoUrl: repoUrl || undefined,
      acknowledgedTerms,
    };

    let order;
    if (orderId) {
      // Update existing order (e.g. from Stripe checkout flow)
      order = await db.update(orderId, { intake, status: "intake-complete" });
    } else {
      // Fresh submission
      order = await db.create({ packageTier: packageTier as PackageTier });
      order = await db.update(order.id, { intake, status: "intake-complete" });
    }

    // Send confirmation email (non-blocking)
    const pkgConfig = PACKAGE_CONFIG[order.packageTier];
    const catLabel = AUDIT_CATEGORY_LABELS[order.intake!.auditCategory];
    sendEmail({
      to: email,
      subject: `AI Audit order received -- ${pkgConfig.name}`,
      text: `Hi ${name},\n\nYour ${pkgConfig.name} audit (${catLabel}) has been received.\n\nOrder ID: ${order.id}\n\nComplete payment to begin. We will start your audit within 24 hours of payment confirmation.`,
    }).catch((err) => {
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
