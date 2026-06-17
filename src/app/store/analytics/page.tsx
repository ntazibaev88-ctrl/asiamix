"use client";

import { Receipt, TrendingUp, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { productsForStore } from "@/lib/mock";

export default function StoreAnalyticsPage() {
  const { t, locale } = useI18n();
  const store = useActiveStore();
  const top = productsForStore(store.slug)
    .filter((p) => p.tag === "HIT")
    .concat(productsForStore(store.slug).slice(0, 3))
    .slice(0, 5);

  return (
    <>
      <PageHeader title={t("nav.analytics")} subtitle={`${store.emoji} ${store.name}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon={TrendingUp} label={t("dash.revenue")} value={formatPrice(2840000)} delta="+14%" />
        <StatCard icon={Receipt} label={t("dash.ordersCount")} value="312" delta="+22" />
        <StatCard icon={Users} label="Клиентов" value="186" delta="+8" />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 font-display text-lg font-bold">ТОП-5</h2>
        <div className="flex flex-col gap-3">
          {top.map((prod, i) => (
            <div key={prod.id} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                {i + 1}
              </span>
              <span className="text-xl">{prod.emoji}</span>
              <span className="flex-1 truncate text-sm font-medium">
                {prod.name[locale]}
              </span>
              <span className="text-sm font-semibold text-muted">
                {formatPrice(prod.price)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
