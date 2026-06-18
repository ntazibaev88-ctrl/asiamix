"use client";

import { useEffect, useState } from "react";
import { Percent, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

interface StoreReport {
  storeName: string;
  commissionPct: number;
  orders: number;
  totalSales: number;
  commission: number;
  availableBalance: number;
  monthly: {
    orders: number;
    sales: number;
    commission: number;
    payable: number;
    periodFrom: string;
  };
  history: {
    txnId: string;
    orderId: string;
    paymentMethod: string;
    subtotal: number;
    commission: number;
    net: number;
    createdAt: number;
  }[];
}

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });

export default function StoreFinancePage() {
  const { t } = useI18n();
  const [r, setR] = useState<StoreReport | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/payments/store")
      .then((res) => res.json())
      .then((data) => {
        if (active && !data.error) setR(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader title={t("nav.finance")} subtitle={r?.storeName ?? t("role.store")} />

      {/* Available balance hero */}
      <Card className="bg-brand p-6 text-brand-fg">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Wallet size={16} /> {t("fin.availableBalance")}
        </div>
        <div className="mt-2 font-display text-4xl font-bold">
          {formatPrice(r?.availableBalance ?? 0)}
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label={t("fin.totalSales")}
          value={formatPrice(r?.totalSales ?? 0)}
        />
        <StatCard
          icon={Percent}
          label={`${t("fin.commissionLabel")} · ${r?.commissionPct ?? 0}%`}
          value={formatPrice(r?.commission ?? 0)}
        />
        <StatCard
          icon={Wallet}
          label={t("fin.orders")}
          value={String(r?.orders ?? 0)}
        />
      </div>

      {/* Monthly report */}
      <Card className="mt-6 p-5">
        <h2 className="mb-4 font-display text-lg font-bold">
          {t("fin.monthlyReport")}
          {r && (
            <span className="ml-2 text-xs font-normal text-muted">
              {t("fin.payout")} · {r.monthly.periodFrom}
            </span>
          )}
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
          <Stat label={t("fin.orders")} value={String(r?.monthly.orders ?? 0)} />
          <Stat label={t("fin.totalSales")} value={formatPrice(r?.monthly.sales ?? 0)} />
          <Stat label={t("fin.commissionLabel")} value={formatPrice(r?.monthly.commission ?? 0)} />
          <Stat label={t("fin.net")} value={formatPrice(r?.monthly.payable ?? 0)} accent />
        </div>
      </Card>

      {/* Payment history */}
      <h2 className="mb-3 mt-8 font-display text-lg font-bold">
        {t("fin.paymentHistory")}
      </h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-4 py-3 font-semibold">{t("fin.order")}</th>
                <th className="px-4 py-3 font-semibold">{t("store.payment")}</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">{t("fin.totalSales")}</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">{t("fin.commissionLabel")}</th>
                <th className="px-4 py-3 font-semibold">{t("fin.net")}</th>
                <th className="px-4 py-3 text-right font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {(r?.history ?? []).map((h) => (
                <tr key={h.txnId} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">#{h.orderId}</td>
                  <td className="px-4 py-3 capitalize">{h.paymentMethod}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{formatPrice(h.subtotal)}</td>
                  <td className="hidden px-4 py-3 text-danger sm:table-cell">−{formatPrice(h.commission)}</td>
                  <td className="px-4 py-3 font-semibold text-success">{formatPrice(h.net)}</td>
                  <td className="px-4 py-3 text-right text-xs text-muted">{fmtDate(h.createdAt)}</td>
                </tr>
              ))}
              {r && r.history.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted">
                    {t("fin.noPayments")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className={`mt-0.5 font-bold ${accent ? "text-brand" : ""}`}>{value}</div>
    </div>
  );
}
