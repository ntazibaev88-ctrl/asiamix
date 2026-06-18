import "server-only";

// Payment provider abstraction — server-only.
//
// Online payments always land in the PLATFORM WALLET first, then the platform
// splits the money (goods → store, delivery → courier, commission + service
// fee → platform profit). This module is the seam where a real acquirer is
// plugged in: Kaspi Pay and a bank card-acquiring gateway both implement the
// same `PaymentProvider` contract, so the checkout flow never has to know which
// one settled the money.
//
// In the demo there is no network egress, so providers resolve deterministically
// and instantly. In production each `createCharge` would call the acquirer's
// API (Kaspi QR/Pay, or a 3-D Secure card form), and a webhook would later
// confirm the charge before the split is committed.

export type PaymentMethod = "kaspi" | "card" | "cash";

export interface ChargeRequest {
  /** order this charge settles */
  orderId: string;
  /** amount to capture, ₸ (integer) — equals the order total */
  amount: number;
  method: PaymentMethod;
  /** opaque idempotency key so a retried request never double-charges */
  idempotencyKey: string;
}

export interface ChargeResult {
  provider: string;
  /** acquirer-side charge id */
  chargeId: string;
  status: "captured" | "pending" | "failed";
  /** where the captured funds now sit before the platform splits them */
  settledTo: "platform_wallet";
  amount: number;
  /** for Kaspi/card flows that need the customer to confirm in-app */
  redirectUrl?: string;
}

export interface PaymentProvider {
  readonly id: string;
  supports(method: PaymentMethod): boolean;
  createCharge(req: ChargeRequest): Promise<ChargeResult>;
}

function chargeId(prefix: string) {
  const rand = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`)
    .replace(/-/g, "")
    .slice(0, 14)
    .toUpperCase();
  return `${prefix}-${rand}`;
}

// Kaspi Pay (QR / Kaspi.kz app). Real impl: POST to Kaspi acquiring API,
// return the deep-link/QR `redirectUrl`, confirm via webhook.
const kaspiProvider: PaymentProvider = {
  id: "kaspi",
  supports: (m) => m === "kaspi",
  async createCharge(req) {
    return {
      provider: "kaspi",
      chargeId: chargeId("KASPI"),
      status: "captured",
      settledTo: "platform_wallet",
      amount: req.amount,
      redirectUrl: `kaspi://pay?order=${encodeURIComponent(req.orderId)}`,
    };
  },
};

// Bank card acquiring (3-D Secure). Real impl: create a payment session with the
// acquiring bank, return the hosted-form/ACS `redirectUrl`, confirm via webhook.
const cardProvider: PaymentProvider = {
  id: "card-acquiring",
  supports: (m) => m === "card",
  async createCharge(req) {
    return {
      provider: "card-acquiring",
      chargeId: chargeId("CARD"),
      status: "captured",
      settledTo: "platform_wallet",
      amount: req.amount,
    };
  },
};

// Cash on delivery: no online capture; the courier collects and the platform
// reconciles the split off the recorded ledger entry.
const cashProvider: PaymentProvider = {
  id: "cash",
  supports: (m) => m === "cash",
  async createCharge(req) {
    return {
      provider: "cash",
      chargeId: chargeId("CASH"),
      status: "captured",
      settledTo: "platform_wallet",
      amount: req.amount,
    };
  },
};

const PROVIDERS: PaymentProvider[] = [kaspiProvider, cardProvider, cashProvider];

/** Picks the acquirer that handles a given payment method. */
export function providerFor(method: PaymentMethod): PaymentProvider {
  const p = PROVIDERS.find((p) => p.supports(method));
  if (!p) throw new Error(`no_provider_for_${method}`);
  return p;
}
