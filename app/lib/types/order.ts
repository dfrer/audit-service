// Order and package type definitions for the audit service

export type PackageTier = "audit-lite" | "audit-standard" | "audit-scaffold";

export const PACKAGE_CONFIG: Record<PackageTier, { name: string; price: number; turnaround: string }> = {
  "audit-lite": {
    name: "Audit Lite",
    price: 75,
    turnaround: "48 hours",
  },
  "audit-standard": {
    name: "Audit Standard",
    price: 120,
    turnaround: "72 hours",
  },
  "audit-scaffold": {
    name: "Audit + Scaffold",
    price: 150,
    turnaround: "5 business days",
  },
};

export type OrderStatus =
  | "new"
  | "intake-complete"
  | "in-progress"
  | "review"
  | "delivered"
  | "archived";

export interface IntakeData {
  name: string;
  email: string;
  repoUrl: string;
  projectSummary: string;
  goals?: string;
  constraints?: string;
  packageTier: PackageTier;
  acknowledgedPrivateRepoPolicy: boolean;
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
  type: "pdf" | "markdown" | "pr-link";
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
}
