import { NextResponse, type NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { getStoreReport } from "@/lib/payments/ledger";

// Store-scoped finance report. A store admin only ever sees their OWN store —
// the slug comes from the verified JWT session, never from the query string.
export async function GET(req: NextRequest) {
  const session = await requireRole(req, "store_admin");
  if (!session || !session.storeSlug)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(getStoreReport(session.storeSlug));
}
