"use client";

import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface CourierReport {
  availableBalance: number;
  deliveries: number;
  history: {
    txnId: string;
    orderId: string;
    store: string;
    amount: number;
    createdAt: number;
  }[];
}

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });

export default function CourierBalancePage() {
  const { t } = useI18n();
  const [r, setR] = useState<CourierReport | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/payments/courier")
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
      <PageHeader title={t("nav.balance")} subtitle={t("role.courier")} />

      <Card className="bg-brand p-6 text-brand-fg">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Wallet size={16} /> {t("fin.availableBalance")}
        </div>
        <div className="mt-2 font-display text-4xl font-bold">
          {formatPrice(r?.availableBalance ?? 0)}
        </div>
        <Button variant="secondary" className="mt-5">
          {t("dash.withdraw")}
        </Button>
      </Card>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("fin.paymentHistory")}
      </h2>
      <div className="flex flex-col gap-3">
        {(r?.history ?? []).map((p) => (
          <Card key={p.txnId} className="flex items-center justify-between p-4">
            <div>
              <div className="font-semibold">{formatPrice(p.amount)}</div>
              <div className="text-xs text-faint">
                #{p.orderId} · {p.store}
              </div>
            </div>
            <div className="text-xs text-muted">{fmtDate(p.createdAt)}</div>
          </Card>
        ))}
        {r && r.history.length === 0 && (
          <p className="py-6 text-center text-sm text-muted">{t("fin.noPayments")}</p>
        )}
      </div>
    </>
  );
}
