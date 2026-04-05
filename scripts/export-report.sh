#!/usr/null/env bash
# Export a report package for delivery
# Usage: ./scripts/export-report.sh <order-id>

ORDER_ID=${1:?'Order ID is required'}
DELIVERY_DIR="./storage/deliveries/${ORDER_ID}"

echo "=== Export Report for Order: ${ORDER_ID} ==="

if [ ! -d "${DELIVERY_DIR}" ]; then
  echo "ERROR: No delivery directory found at ${DELIVERY_DIR}"
  echo "Make sure the report has been generated and stored."
  exit 1
fi

echo "Contents of ${DELIVERY_DIR}:"
ls -la "${DELIVERY_DIR}"

echo ""
echo "To deliver: attach the PDF and share the Markdown link with the customer."
