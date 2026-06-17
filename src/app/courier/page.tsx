"use client";

import { useState } from "react";
import { Package, Star, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
import { demoOrders } from "@/lib/mock";

export default function CourierDashboard() {
  const { t } = useI18n();
  const [online, setOnline] = useState(true);

  const available = demoOrders.filter(
    (o) => o.status === "pending" || o.status === "accepted",
  );

  return (
    <>
      <PageHeader
        title={t("nav.dashboard")}
        subtitle={t("role.courier")}
        action={
          <Button
            variant={online ? "outline" : "primary"}
            onClick={() => setOnline((v) => !v)}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                online ? "bg-success" : "bg-faint"
              }`}
            />
            {online ? t("dash.goOffline") : t("dash.goOnline")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(18400)}
          delta="+12%"
        />
        <StatCard
          icon={Package}
          label={t("dash.deliveriesToday")}
          value="14"
          delta="+3"
        />
        <StatCard icon={Star} label={t("dash.rating")} value="4.9" />
        <StatCard
          icon={Wallet}
          label={t("nav.balance")}
          value={formatPrice(42600)}
        />
      </div>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("nav.orders")}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((o) => (
          <Card key={o.num} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold">#{o.num}</div>
                <div className="text-sm text-muted">{o.store}</div>
              </div>
              <Badge tone={statusTone[o.status]}>{t(`status.${o.status}`)}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold">
                {formatPrice(o.total)}
              </span>
              <Button size="sm" disabled={!online}>
                {t("dash.acceptOrder")}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
