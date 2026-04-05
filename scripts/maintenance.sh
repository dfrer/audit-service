#!/usr/bin/env bash
# Weekly maintenance script -- run via Hermes cron
# This script is safe and does not modify production data.

set -e

cd "$(dirname "$0")/.."

echo "=== Weekly Maintenance Check ==="
echo ""

# 1. Health check
echo "[1/4] Health check..."
HEALTH_URL="${NEXT_PUBLIC_APP_URL:-http://localhost:3000}/api/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${HEALTH_URL}" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
  echo "  Site is up (HTTP ${STATUS})"
else
  echo "  WARNING: Site health check failed (HTTP ${STATUS})"
fi

# 2. Dependency check
echo "[2/4] Checking for outdated dependencies..."
cd app
npm outdated 2>/dev/null | head -20 || echo "  npm outdated command not available or no issues"

# 3. Storage cleanup (old dev artifacts)
echo "[3/4] Checking storage directory..."
if [ -d "./storage/deliveries" ]; then
  COUNT=$(find ./storage/deliveries -maxdepth 1 -type d | wc -l)
  echo "  ${COUNT} order directories in storage"
else
  echo "  No storage directory found (may not have any deliveries yet)"
fi

# 4. Git status
echo "[4/4] Git status..."
cd ..
git status --porcelain 2>/dev/null | head -10 || echo "  Not a git repo or git not available"

echo ""
echo "=== Maintenance check complete ==="
