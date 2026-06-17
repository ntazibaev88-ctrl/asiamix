"use client";

import { Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const payouts = [
  { id: 1, amount: 35000, date: "12.06", status: "delivered" as const },
  { id: 2, amount: 28000, date: "05.06", status: "delivered" as const },
  { id: 3, amount: 12000, date: "01.06", status: "pending" as const },
];

export default function CourierBalancePage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("nav.balance")} subtitle={t("role.courier")} />

      <Card className="bg-brand p-6 text-brand-fg">
        <div className="flex items-center gap-2 text-sm opacity-80">
          <Wallet size={16} /> {t("nav.balance")}
        </div>
        <div className="mt-2 font-display text-4xl font-bold">
          {formatPrice(42600)}
        </div>
        <Button variant="secondary" className="mt-5">
          {t("dash.withdraw")}
        </Button>
      </Card>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("dash.withdraw")}
      </h2>
      <div className="flex flex-col gap-3">
        {payouts.map((p) => (
          <Card
            key={p.id}
            className="flex items-center justify-between p-4"
          >
            <div>
              <div className="font-semibold">{formatPrice(p.amount)}</div>
              <div className="text-xs text-faint">{p.date}</div>
            </div>
            <Badge tone={p.status === "delivered" ? "success" : "warning"}>
              {t(`status.${p.status}`)}
            </Badge>
          </Card>
        ))}
      </div>
    </>
  );
}
