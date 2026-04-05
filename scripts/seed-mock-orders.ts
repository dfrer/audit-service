// Seed mock orders for development/testing
// Run with: npx tsx scripts/seed-mock-orders.ts

import { db } from "../app/lib/db/local";
import { PackageTier } from "../app/lib/types/order";

async function seed() {
  console.log("Seeding mock orders...");

  const mockOrders = [
    {
      packageTier: "audit-lite" as PackageTier,
      intake: {
        name: "Alice Developer",
        email: "alice@example.com",
        repoUrl: "https://github.com/alice/my-app",
        projectSummary: "A Next.js e-commerce app with Stripe integration and a custom cart system.",
        goals: "Scale to 10k users and add international shipping.",
        constraints: "Small team, 2 devs. Budget-conscious.",
        acknowledgedPrivateRepoPolicy: true,
      },
    },
    {
      packageTier: "audit-standard" as PackageTier,
      intake: {
        name: "Bob Engineer",
        email: "bob@example.com",
        repoUrl: "https://github.com/bob/api-service",
        projectSummary: "A Go microservice API with PostgreSQL. Handles user auth and data processing.",
        goals: "Add caching, improve test coverage, set up CI/CD.",
        constraints: "Must maintain backwards compatibility.",
        acknowledgedPrivateRepoPolicy: true,
      },
    },
    {
      packageTier: "audit-scaffold" as PackageTier,
      intake: {
        name: "Carol Startup",
        email: "carol@example.com",
        repoUrl: "https://github.com/carol/saas-starter",
        projectSummary: "A SaaS starter kit with auth, billing, and user dashboard. Built with React and Express.",
        goals: "Get from prototype to production ready.",
        constraints: "Solo founder, needs everything to be simple and maintainable.",
        acknowledgedPrivateRepoPolicy: true,
      },
    },
  ];

  for (const mock of mockOrders) {
    const order = await db.create({ packageTier: mock.packageTier });
    await db.update(order.id, {
      intake: mock.intake as any,
      status: "intake-complete",
      internalNotes: "Seed data for development",
    });
    console.log(`  Created order: ${order.id} (${order.packageTier})`);
  }

  console.log(`Seeded ${mockOrders.length} orders.`);
}

seed().catch(console.error);
