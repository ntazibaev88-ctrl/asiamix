"use client";

import { useEffect, useState } from "react";
import {
  Banknote,
  Bike,
  Percent,
  Store as StoreIcon,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

interface Report {
  paidToStores: number;
  paidToCouriers: number;
  commissionIncome: number;
  serviceFeeIncome: number;
  grossRevenue: number;
  adminIncome: number;
  failedCount: number;
  byStore: { name: string; amount: number; orders: number }[];
  byCourier: { name: string; amount: number; orders: number }[];
  transactions: {
    txnId: string;
    orderId: string;
    storeName: string;
    total: number;
    storeAmount: number;
    deliveryFee: number;
    adminCommission: number;
    serviceFee: number;
    paymentMethod: string;
    status: string;
  }[];
}

export default function AdminFinancePage() {
  const { t } = useI18n();
  const [r, setR] = useState<Report | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/payments/report")
      .then((res) => res.json())
      .then((data) => {
        if (active) setR(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title={t("nav.finance")} subtitle={t("role.admin")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={StoreIcon} label={t("fin.toStores")} value={formatPrice(r?.paidToStores ?? 0)} />
        <StatCard icon={Bike} label={t("fin.toCouriers")} value={formatPrice(r?.paidToCouriers ?? 0)} />
        <StatCard icon={Percent} label={t("fin.commission")} value={formatPrice(r?.commissionIncome ?? 0)} />
        <StatCard icon={Banknote} label={t("fin.serviceFee")} value={formatPrice(r?.serviceFeeIncome ?? 0)} />
        <StatCard icon={Wallet} label={t("fin.adminIncome")} value={formatPrice(r?.adminIncome ?? 0)} />
        <StatCard icon={TrendingUp} label={t("fin.gross")} value={formatPrice(r?.grossRevenue ?? 0)} />
      </div>

      {/* Per-store / per-courier */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="mb-3 font-display text-lg font-bold">{t("fin.toStores")}</h2>
          <div className="flex flex-col gap-2">
            {(r?.byStore ?? []).map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="text-muted">{s.name}</span>
                <span className="font-semibold">{formatPrice(s.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="mb-3 font-display text-lg font-bold">{t("fin.toCouriers")}</h2>
          <div className="flex flex-col gap-2">
            {(r?.byCourier ?? []).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-sm">
                <span className="text-muted">{c.name}</span>
                <span className="font-semibold">{formatPrice(c.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transactions / receipts */}
      <h2 className="mb-3 mt-8 font-display text-lg font-bold">
        {t("fin.transactions")}
        {r && r.failedCount > 0 && (
          <span className="ml-2 rounded-full bg-danger-soft px-2 py-0.5 text-xs font-bold text-danger">
            {t("fin.failed")}: {r.failedCount}
          </span>
        )}
      </h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-semibold">Txn ID</th>
                <th className="px-4 py-3 font-semibold">{t("role.store")}</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">{t("fin.toStores")}</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">{t("fin.toCouriers")}</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">{t("fin.commission")}</th>
                <th className="px-4 py-3 font-semibold">{t("common.total")}</th>
              </tr>
            </thead>
            <tbody>
              {(r?.transactions ?? []).map((tx) => (
                <tr key={tx.txnId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{tx.txnId}</td>
                  <td className="px-4 py-3">{tx.storeName}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{formatPrice(tx.storeAmount)}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{formatPrice(tx.deliveryFee)}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{formatPrice(tx.adminCommission + tx.serviceFee)}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(tx.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
