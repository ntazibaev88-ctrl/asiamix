import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sameOrigin, rateLimit, clientIp } from "@/lib/auth/security";
import { initiateKaspi } from "@/lib/payments/kaspi";

// Phase 1 of Kaspi Pay: create a pending charge and return the QR / deep-link
// the customer confirms in the Kaspi.kz app. The amount is computed server-side.
const schema = z.object({
  orderId: z.string().min(1).max(40),
  storeSlug: z.string().min(1).max(64),
  subtotal: z.number().int().min(0).max(100_000_000),
  deliveryFee: z.number().int().min(0).max(10_000_000),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!rateLimit(`kaspi:${clientIp(req)}`, 20, 60_000))
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  try {
    const result = initiateKaspi(parsed.data);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const error = e instanceof Error ? e.message : "kaspi_error";
    return NextResponse.json({ ok: false, error }, { status: 422 });
  }
}
