// Order and package type definitions for the AI Audit Service
// Broadened from "project audit" to full AI audit service.

export type AuditCategory =
  | "business-ops"       // Business AI Operations Audit
  | "personal-workflow"  // Personal AI Workflow Audit
  | "local-selfhosted"   // Local / Self-Hosted AI Audit
  | "ai-coding"          // AI Coding / Build Workflow Audit
  | "ai-deployment"      // AI/ML Deployment Practicality Audit
  | "general";           // General AI Usage Audit

export type PackageTier = "audit-lite" | "audit-standard" | "audit-scaffold";

export const PACKAGE_CONFIG: Record<PackageTier, { name: string; price: number; turnaround: string }> = {
  "audit-lite": {
    name: "AI Audit Lite",
    price: 75,
    turnaround: "48 hours",
  },
  "audit-standard": {
    name: "AI Audit Standard",
    price: 120,
    turnaround: "72 hours",
  },
  "audit-scaffold": {
    name: "AI Audit + Roadmap",
    price: 150,
    turnaround: "5 business days",
  },
};

export const AUDIT_CATEGORY_LABELS: Record<AuditCategory, string> = {
  "business-ops": "Business AI Operations",
  "personal-workflow": "Personal AI Workflows",
  "local-selfhosted": "Local / Self-Hosted AI",
  "ai-coding": "AI Coding / Build Workflows",
  "ai-deployment": "AI/ML Deployment Practicality",
  "general": "General AI Usage Audit",
};

export type OrderStatus =
  | "new"
  | "intake-complete"
  | "payment-confirmed"
  | "in-progress"
  | "review"
  | "delivered"
  | "archived";

export interface IntakeData {
  name: string;
  email: string;
  packageTier: PackageTier;
  auditCategory: AuditCategory;
  // Core description fields
  contextSummary: string;           // What are they auditing? Replaces projectSummary
  goals?: string;
  constraints?: string;
  // Tool/stack inventory
  toolsInUse?: string;              // AI tools/platforms currently used
  currentStack?: string;            // For dev/local: Ollama, vLLM, GPU setup, etc.
  // Pain points
  mainPainPoints?: string;
  // Optional fields for broader audit
  privacyConcerns?: string;
  budgetConcerns?: string;
  wantsImplementationHelp?: boolean;
  // Legacy field for backward compat
  repoUrl?: string;
  acknowledgedTerms: boolean;
}

export interface Order {
  id: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  status: OrderStatus;
  packageTier: PackageTier;
  intake: IntakeData | null;
  internalNotes: string;
  deliveryArtifacts: DeliveryArtifact[];
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  archivedAt?: string;
}

export interface DeliveryArtifact {
  type: "pdf" | "markdown" | "pr-link" | "download-url";
  url?: string;
  filename?: string;
  uploadedAt?: string;
}

export interface CreateOrderInput {
  packageTier: PackageTier;
  stripeSessionId?: string;
}

export interface UpdateOrderInput {
  status?: OrderStatus;
  internalNotes?: string;
  intake?: IntakeData;
  deliveryArtifacts?: DeliveryArtifact[];
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
}
