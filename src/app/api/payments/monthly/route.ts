import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { getMonthlyReport } from "@/lib/payments/ledger";

// Admin-only monthly commission report, computed on the server.
export async function GET(req: NextRequest) {
  const session = await requireRole(req, "super_admin");
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(getMonthlyReport());
}
