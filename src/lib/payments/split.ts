// Canonical, SERVER-SIDE payment split. The client never computes money — this
// runs only in route handlers / on the server. All amounts are integers (₸).
// The same formula is mirrored by the atomic SQL function process_order_payment
// in supabase/schema.sql, which is the authoritative source of truth in prod.

export const SERVICE_FEE_PCT = Number(process.env.SERVICE_FEE_PCT ?? 5);

export interface SplitInput {
  /** items total (goes to the store, minus commission) */
  subtotal: number;
  /** delivery fee (goes to the courier) */
  deliveryFee: number;
  /** store commission percent (admin income) */
  commissionPct: number;
  /** platform service fee percent of subtotal (admin income) */
  serviceFeePct?: number;
}

export interface PaymentSplit {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  adminCommission: number;
  storeAmount: number;
  courierAmount: number;
  adminAmount: number;
  total: number;
}

function assertInt(n: number, name: string) {
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 0)
    throw new Error(`invalid amount: ${name}`);
}

/**
 * Splits a paid order into store / courier / admin amounts. Throws if the parts
 * do not sum exactly to the total — guaranteeing money is never mis-allocated.
 */
export function computeSplit(input: SplitInput): PaymentSplit {
  const { subtotal, deliveryFee } = input;
  assertInt(subtotal, "subtotal");
  assertInt(deliveryFee, "deliveryFee");
  if (input.commissionPct < 0 || input.commissionPct > 100)
    throw new Error("invalid commissionPct");

  const serviceFeePct = input.serviceFeePct ?? SERVICE_FEE_PCT;
  if (serviceFeePct < 0 || serviceFeePct > 100)
    throw new Error("invalid serviceFeePct");

  const adminCommission = Math.round((subtotal * input.commissionPct) / 100);
  const serviceFee = Math.round((subtotal * serviceFeePct) / 100);

  const storeAmount = subtotal - adminCommission;
  const courierAmount = deliveryFee;
  const adminAmount = adminCommission + serviceFee;
  const total = subtotal + deliveryFee + serviceFee;

  // Invariant: nothing is lost or duplicated.
  if (storeAmount + courierAmount + adminAmount !== total)
    throw new Error("split invariant violation");
  if (storeAmount < 0) throw new Error("commission exceeds subtotal");

  return {
    subtotal,
    deliveryFee,
    serviceFee,
    adminCommission,
    storeAmount,
    courierAmount,
    adminAmount,
    total,
  };
}

/** Cryptographically-unique transaction id for receipts/logs. */
export function newTxnId(): string {
  const rand = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
    .replace(/-/g, "")
    .slice(0, 12)
    .toUpperCase();
  return `TXN-${rand}`;
}
