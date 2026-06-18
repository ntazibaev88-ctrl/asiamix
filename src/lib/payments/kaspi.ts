import "server-only";
import crypto from "node:crypto";
import { computeSplit, newTxnId } from "./split";
import { recordTransaction, recordError } from "./ledger";
import { demoStores } from "@/lib/mock";

// ── Kaspi Pay integration ─────────────────────────────────────────────────
//
// Two-phase flow (mirrors a real Kaspi acquiring integration):
//
//   1. INITIATE  — the app asks Kaspi to create a charge for the order total.
//                  Kaspi returns a QR / app deep-link the customer confirms.
//                  We hold the charge as `pending` (money not yet split).
//   2. WEBHOOK   — Kaspi calls us back when the customer has paid. We verify
//                  the HMAC signature, then the money (already captured into the
//                  PLATFORM WALLET) is split and the order is AUTO-CONFIRMED.
//
// All money math stays server-side; the webhook body is authenticated with an
// HMAC-SHA256 signature so a forged callback cannot confirm an order.

const SECRET =
  process.env.KASPI_WEBHOOK_SECRET ||
  process.env.AUTH_SECRET ||
  "dev-kaspi-secret-set-KASPI_WEBHOOK_SECRET";

export interface PendingCharge {
  txnId: string;
  orderId: string;
  storeSlug: string;
  subtotal: number;
  deliveryFee: number;
  amount: number;
  status: "pending" | "paid" | "failed";
  createdAt: number;
}

// In-memory pending charges + confirmed orders. In production these are rows in
// payment_transactions / orders (see supabase/schema.sql).
const pending = new Map<string, PendingCharge>();
const confirmed = new Set<string>();

/** Stable HMAC-SHA256 signature for a Kaspi webhook payload. */
export function signKaspi(txnId: string, status: string, amount: number): string {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${txnId}:${status}:${amount}`)
    .digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

/** Phase 1 — create a pending Kaspi charge and the QR / deep-link to confirm it. */
export function initiateKaspi(input: {
  orderId: string;
  storeSlug: string;
  subtotal: number;
  deliveryFee: number;
}): { txnId: string; amount: number; qrUrl: string; deeplink: string } {
  const store = demoStores.find((s) => s.slug === input.storeSlug);
  if (!store) throw new Error("store_not_found");

  // Amount is computed from the server's split (total the customer pays).
  const split = computeSplit({
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    commissionPct: store.commission,
  });
  const txnId = newTxnId();
  pending.set(txnId, {
    txnId,
    orderId: input.orderId,
    storeSlug: input.storeSlug,
    subtotal: input.subtotal,
    deliveryFee: input.deliveryFee,
    amount: split.total,
    status: "pending",
    createdAt: Date.now(),
  });

  const deeplink = `kaspi://pay?txn=${txnId}&amount=${split.total}`;
  // QR encodes the same deep-link; rendered client-side.
  const qrUrl = deeplink;
  return { txnId, amount: split.total, qrUrl, deeplink };
}

/**
 * Phase 2 — handle Kaspi's signed callback. On a verified `paid` status the
 * captured funds are split and the order is auto-confirmed. Returns the result.
 */
export function handleKaspiWebhook(body: {
  txnId: string;
  status: "paid" | "failed";
  signature: string;
}):
  | { ok: true; confirmed: boolean; orderId: string }
  | { ok: false; error: string } {
  const charge = pending.get(body.txnId);
  if (!charge) return { ok: false, error: "unknown_txn" };

  const expected = signKaspi(body.txnId, body.status, charge.amount);
  if (!safeEqual(expected, body.signature))
    return { ok: false, error: "bad_signature" };

  if (body.status !== "paid") {
    charge.status = "failed";
    recordError({ orderId: charge.orderId, txnId: body.txnId, message: "kaspi_failed" });
    return { ok: true, confirmed: false, orderId: charge.orderId };
  }

  const store = demoStores.find((s) => s.slug === charge.storeSlug);
  if (!store) return { ok: false, error: "store_not_found" };

  // Split the captured funds (idempotent: only the first paid callback records).
  if (charge.status !== "paid") {
    const split = computeSplit({
      subtotal: charge.subtotal,
      deliveryFee: charge.deliveryFee,
      commissionPct: store.commission,
    });
    recordTransaction({
      txnId: charge.txnId,
      orderId: charge.orderId,
      storeSlug: charge.storeSlug,
      storeName: store.name,
      paymentMethod: "kaspi",
      split,
    });
    charge.status = "paid";
    confirmed.add(charge.orderId); // order auto-confirmed
  }
  return { ok: true, confirmed: true, orderId: charge.orderId };
}

/** Whether an order has been auto-confirmed by a paid Kaspi callback. */
export function isOrderConfirmed(orderId: string): boolean {
  return confirmed.has(orderId);
}
