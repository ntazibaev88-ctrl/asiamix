import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { getCourierReport } from "@/lib/payments/ledger";

// Courier-scoped earnings report. Scoped to the courier in the verified JWT.
export async function GET(req: NextRequest) {
  const session = await requireRole(req, "courier");
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(getCourierReport(session.name));
}
