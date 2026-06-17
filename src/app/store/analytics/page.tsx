"use client";

import { Receipt, TrendingUp, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { products } from "@/lib/mock";

export default function StoreAnalyticsPage() {
  const { t, locale } = useI18n();
  const top = [...products]
    .filter((p) => p.tag === "HIT")
    .concat(products.slice(0, 3))
    .slice(0, 5);

  return (
    <>
      <PageHeader title={t("nav.analytics")} subtitle="NOMI Sushi" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(2840000)}
          delta="+14%"
        />
        <StatCard
          icon={Receipt}
          label={t("dash.ordersCount")}
          value="312"
          delta="+22"
        />
        <StatCard icon={Users} label="Клиентов" value="186" delta="+8" />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-lg font-bold">ТОП-5</h2>
        <div className="flex flex-col gap-3">
          {top.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                {i + 1}
              </span>
              <span className="text-xl">{p.emoji}</span>
              <span className="flex-1 truncate text-sm font-medium">
                {p.name[locale]}
              </span>
              <span className="text-sm font-semibold text-muted">
                {formatPrice(p.price)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
