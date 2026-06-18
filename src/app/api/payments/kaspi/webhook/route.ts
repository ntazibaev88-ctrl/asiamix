import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { handleKaspiWebhook } from "@/lib/payments/kaspi";
import { audit } from "@/lib/auth/audit";

// Phase 2 of Kaspi Pay: the signed server-to-server callback. This is NOT
// browser-facing — Kaspi calls it directly — so there is no same-origin check;
// instead the body is authenticated with an HMAC-SHA256 signature. A verified
// `paid` callback splits the captured funds and AUTO-CONFIRMS the order.
const schema = z.object({
  txnId: z.string().min(1).max(64),
  status: z.enum(["paid", "failed"]),
  signature: z.string().min(1).max(128),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const result = handleKaspiWebhook(parsed.data);
  if (!result.ok) {
    audit(req, "login_fail", { route: "kaspi/webhook", error: result.error });
    return NextResponse.json(result, { status: 400 });
  }
  audit(req, "login_success", {
    route: "kaspi/webhook",
    orderId: result.orderId,
    confirmed: result.confirmed,
  });
  return NextResponse.json(result);
}
