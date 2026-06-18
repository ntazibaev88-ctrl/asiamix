import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { sameOrigin, rateLimit, clientIp } from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";
import { computeSplit, newTxnId } from "@/lib/payments/split";
import { recordTransaction, recordError } from "@/lib/payments/ledger";
import { providerFor } from "@/lib/payments/providers";
import { demoStores } from "@/lib/mock";

// Customer checkout. The money flow is:
//   1. acquirer (Kaspi / card) captures the order total into the PLATFORM WALLET
//   2. the platform splits it server-side (goods → store, delivery → courier,
//      commission + service fee → platform profit)
//   3. the split is recorded atomically; if anything is off, nothing is credited
//
// The client never sends trusted money amounts: commission comes from the
// SERVER's store record, and the split must sum exactly to the captured total.
const schema = z.object({
  orderId: z.string().min(1).max(40),
  storeSlug: z.string().min(1).max(64),
  customerId: z.string().max(64).optional(),
  subtotal: z.number().int().min(0).max(100_000_000),
  deliveryFee: z.number().int().min(0).max(10_000_000),
  paymentMethod: z.enum(["cash", "card", "kaspi"]),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!rateLimit(`checkout:${clientIp(req)}`, 20, 60_000))
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const input = parsed.data;
  const txnId = newTxnId();

  try {
    // Commission is read from the SERVER's store record, never from the client.
    const store = demoStores.find((s) => s.slug === input.storeSlug);
    if (!store) throw new Error("store_not_found");

    const split = computeSplit({
      subtotal: input.subtotal,
      deliveryFee: input.deliveryFee,
      commissionPct: store.commission,
    });

    // 1. Capture the full total into the platform wallet via the acquirer.
    const charge = await providerFor(input.paymentMethod).createCharge({
      orderId: input.orderId,
      amount: split.total,
      method: input.paymentMethod,
      idempotencyKey: txnId,
    });
    if (charge.status === "failed") throw new Error("charge_failed");

    // 2 + 3. Split the captured funds and record the ledger entry.
    const receipt = recordTransaction({
      txnId,
      orderId: input.orderId,
      storeSlug: input.storeSlug,
      storeName: store.name,
      customerId: input.customerId,
      paymentMethod: input.paymentMethod,
      split,
    });

    audit(req, "login_success", {
      route: "payments/checkout",
      txnId,
      orderId: input.orderId,
      provider: charge.provider,
    });
    return NextResponse.json({
      ok: true,
      status: charge.status,
      provider: charge.provider,
      redirectUrl: charge.redirectUrl,
      receipt,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "payment_error";
    // Atomic guarantee: on any failure nothing is credited to any wallet.
    recordError({ orderId: input.orderId, txnId, message });
    audit(req, "login_fail", {
      route: "payments/checkout",
      orderId: input.orderId,
      error: message,
    });
    return NextResponse.json(
      { ok: false, status: "failed", error: message },
      { status: 422 },
    );
  }
}
