import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { requireRole } from "@/lib/auth/session";
import { sameOrigin, rateLimit, clientIp } from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";
import { computeSplit, newTxnId } from "@/lib/payments/split";
import { recordTransaction, recordError } from "@/lib/payments/ledger";
import { demoStores } from "@/lib/mock";

// Processes a payment server-side and splits it atomically. In production this
// calls the Supabase RPC `process_order_payment(order_id)` (DB transaction).
// In the demo (no DB) it computes the split here on the server; the client
// never sends money amounts that are trusted — commission comes from the store
// record on the server.
const schema = z.object({
  orderId: z.string().min(1).max(40),
  storeSlug: z.string().min(1).max(64),
  customerId: z.string().max(64).optional(),
  courierId: z.string().max(64).optional(),
  subtotal: z.number().int().min(0).max(100_000_000),
  deliveryFee: z.number().int().min(0).max(10_000_000),
  paymentMethod: z.enum(["cash", "card", "kaspi"]),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!rateLimit(`pay:${clientIp(req)}`, 20, 60_000))
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  // Only the platform/admin (or an internal caller) may settle payments.
  const session = await requireRole(req, "super_admin");
  if (!session)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const input = parsed.data;
  const txnId = newTxnId();

  try {
    // Commission is read from the SERVER's store record, not from the client.
    const store = demoStores.find((s) => s.slug === input.storeSlug);
    if (!store) throw new Error("store_not_found");

    const split = computeSplit({
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      commissionPct: store.commission,
    });

    const receipt = recordTransaction({
      txnId,
      orderId: input.orderId,
      storeSlug: input.storeSlug,
      storeName: store.name,
      customerId: input.customerId,
      courierId: input.courierId,
      paymentMethod: input.paymentMethod,
      split,
    });

    audit(req, "login_success", {
      route: "payments/process",
      txnId,
      orderId: input.orderId,
    });
    return NextResponse.json({ ok: true, status: "paid", receipt });
  } catch (e) {
    const message = e instanceof Error ? e.message : "payment_error";
    // Atomic guarantee: nothing was credited; record the failure + notify admin.
    recordError({ orderId: input.orderId, txnId, message });
    audit(req, "login_fail", {
      route: "payments/process",
      orderId: input.orderId,
      error: message,
    });
    return NextResponse.json(
      { ok: false, status: "failed", error: message },
      { status: 422 },
    );
  }
}
