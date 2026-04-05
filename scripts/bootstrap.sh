#!/usr/bin/env bash
# Bootstrap script -- validates environment and sets up the project
# Run after cloning and before first deployment.

set -e

echo "=== Audit Service Bootstrap ==="
echo ""

# Check if we are in the right directory
cd "$(dirname "$0")/.."

# Check Node.js
echo "[1/6] Checking Node.js..."
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed. Install it first."
  exit 1
fi
echo "  Node.js: $(node --version)"

# Check npm
echo "[2/6] Checking npm..."
if ! command -v npm &> /dev/null; then
  echo "ERROR: npm is not installed."
  exit 1
fi
echo "  npm: $(npm --version)"

# Install dependencies
echo "[3/6] Installing dependencies..."
cd app
if [ -d "node_modules" ]; then
  echo "  Dependencies already installed. Run npm install to update."
else
  npm install
fi

# Check environment
echo "[4/6] Checking environment..."
if [ -f ".env.local" ]; then
  echo "  .env.local found."
else
  if [ -f ".env.example" ]; then
    echo "  WARNING: No .env.local found. Copy .env.example to .env.local and fill in values."
    echo "  Run: cp .env.example .env.local"
  fi
fi

# Check critical env vars (non-fatal, just warnings)
echo "[5/6] Checking critical configuration..."
if [ -f ".env.local" ]; then
  if ! grep -q "NEXT_PUBLIC_STRIPE_MODE" .env.local; then
    echo "  WARNING: NEXT_PUBLIC_STRIPE_MODE not set in .env.local"
  fi
else
  echo "  Skipping env validation (no .env.local)"
fi

# Run typecheck
echo "[6/6] Running TypeScript type check..."
npx tsc --noEmit 2>/dev/null && echo "  Type check passed." || echo "  WARNING: Type check has errors. Review above."

echo ""
echo "=== Bootstrap complete ==="
echo ""
echo "Next steps:"
echo "  1. Run: npm run dev (start dev server)"
echo "  2. Complete manual account setup: see docs/legal/02_manual_account_setup_checklist.md"
echo "  3. Set up Stripe webhook: see docs/ops/02_runbooks.md"
