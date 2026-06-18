import "server-only";
import { computeSplit, type PaymentSplit, newTxnId } from "./split";
import { demoOrders, demoStores } from "@/lib/mock";

// Server-side ledger. In production this is the Supabase tables/RPC from
// schema.sql. Here it keeps an in-memory ledger seeded deterministically from
// demo orders so the admin reports show real, server-computed numbers without a
// database. Money is only ever computed here on the server.

export interface Receipt {
  txnId: string;
  orderId: string;
  storeSlug: string;
  storeName: string;
  customerId?: string;
  courierId?: string;
  courierName: string;
  paymentMethod: string;
  status: "paid" | "failed";
  subtotal: number;
  deliveryFee: number;
  storeAmount: number;
  adminCommission: number;
  serviceFee: number;
  total: number;
  createdAt: number;
}

interface ErrorEntry {
  orderId: string;
  txnId: string;
  message: string;
  createdAt: number;
}

const transactions: Receipt[] = [];
const errors: ErrorEntry[] = [];
let seeded = false;

const COURIERS = ["Ерлан Б.", "Санжар М.", "Нурлан Т."];

function seed() {
  if (seeded) return;
  seeded = true;
  const DELIVERY = 500;
  demoOrders.forEach((o, i) => {
    if (o.status === "cancelled") return;
    const store = demoStores.find((s) => s.name === o.store);
    if (!store) return;
    const subtotal = Math.max(0, o.total - DELIVERY);
    const split = computeSplit({
      subtotal,
      deliveryFee: DELIVERY,
      commissionPct: store.commission,
    });
    transactions.push({
      txnId: newTxnId(),
      orderId: String(o.num),
      storeSlug: store.slug,
      storeName: store.name,
      courierName: COURIERS[i % COURIERS.length],
      paymentMethod: i % 3 === 0 ? "cash" : "kaspi",
      status: "paid",
      ...split,
      createdAt: Date.now() - i * 3_600_000,
    });
  });
}

export function recordTransaction(input: {
  txnId: string;
  orderId: string;
  storeSlug: string;
  storeName: string;
  customerId?: string;
  courierId?: string;
  paymentMethod: string;
  split: PaymentSplit;
}): Receipt {
  const r: Receipt = {
    txnId: input.txnId,
    orderId: input.orderId,
    storeSlug: input.storeSlug,
    storeName: input.storeName,
    customerId: input.customerId,
    courierId: input.courierId,
    courierName: "—",
    paymentMethod: input.paymentMethod,
    status: "paid",
    ...input.split,
    createdAt: Date.now(),
  };
  transactions.push(r);
  return r;
}

export function recordError(input: {
  orderId: string;
  txnId: string;
  message: string;
}) {
  errors.push({ ...input, createdAt: Date.now() });
}

export interface MonthlyRow {
  store: string;
  orders: number;
  sales: number;
  commissionPct: number;
  commission: number;
  payable: number;
  refunds: number;
  net: number;
}

export function getMonthlyReport() {
  seed();
  const now = new Date();
  const periodFrom = new Date(now.getFullYear(), now.getMonth(), 1);
  const periodTo = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const paid = transactions.filter((t) => t.status === "paid");

  const rows: MonthlyRow[] = Object.values(
    paid.reduce<Record<string, MonthlyRow>>((acc, r) => {
      const store = demoStores.find((s) => s.slug === r.storeSlug);
      const pct = store?.commission ?? 3;
      (acc[r.storeSlug] ??= {
        store: r.storeName,
        orders: 0,
        sales: 0,
        commissionPct: pct,
        commission: 0,
        payable: 0,
        refunds: 0,
        net: 0,
      });
      const row = acc[r.storeSlug];
      row.orders += 1;
      row.sales += r.subtotal + r.deliveryFee;
      row.commission += r.adminCommission;
      row.payable += r.storeAmount;
      row.net = row.payable - row.refunds;
      return acc;
    }, {}),
  );

  return {
    periodFrom: periodFrom.toISOString().slice(0, 10),
    periodTo: periodTo.toISOString().slice(0, 10),
    rows,
    totals: {
      orders: rows.reduce((s, r) => s + r.orders, 0),
      sales: rows.reduce((s, r) => s + r.sales, 0),
      commission: rows.reduce((s, r) => s + r.commission, 0),
      payable: rows.reduce((s, r) => s + r.payable, 0),
      net: rows.reduce((s, r) => s + r.net, 0),
    },
  };
}

export function getReport() {
  seed();
  const paid = transactions.filter((t) => t.status === "paid");
  const sum = (f: (r: Receipt) => number) => paid.reduce((s, r) => s + f(r), 0);

  const byStore = Object.values(
    paid.reduce<Record<string, { name: string; amount: number; orders: number }>>(
      (acc, r) => {
        (acc[r.storeSlug] ??= { name: r.storeName, amount: 0, orders: 0 });
        acc[r.storeSlug].amount += r.storeAmount;
        acc[r.storeSlug].orders += 1;
        return acc;
      },
      {},
    ),
  );

  const byCourier = Object.values(
    paid.reduce<Record<string, { name: string; amount: number; orders: number }>>(
      (acc, r) => {
        (acc[r.courierName] ??= { name: r.courierName, amount: 0, orders: 0 });
        acc[r.courierName].amount += r.deliveryFee;
        acc[r.courierName].orders += 1;
        return acc;
      },
      {},
    ),
  );

  return {
    paidToStores: sum((r) => r.storeAmount),
    paidToCouriers: sum((r) => r.deliveryFee),
    commissionIncome: sum((r) => r.adminCommission),
    serviceFeeIncome: sum((r) => r.serviceFee),
    grossRevenue: sum((r) => r.total),
    adminIncome: sum((r) => r.adminCommission + r.serviceFee),
    byStore,
    byCourier,
    failedCount: errors.length,
    transactions: [...paid]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 12),
  };
}
