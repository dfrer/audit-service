// GET /api/health -- basic health check for monitoring
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
