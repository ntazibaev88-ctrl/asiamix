"use client";

import { Gift, Star, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

const week = [
  { day: "Пн", value: 8200 },
  { day: "Вт", value: 11400 },
  { day: "Ср", value: 9600 },
  { day: "Чт", value: 14200 },
  { day: "Пт", value: 18400 },
  { day: "Сб", value: 21000 },
  { day: "Вс", value: 16800 },
];

export default function CourierEarningsPage() {
  const { t } = useI18n();
  const max = Math.max(...week.map((d) => d.value));

  return (
    <>
      <PageHeader title={t("nav.earnings")} subtitle={t("role.courier")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(99600)}
          delta="+18%"
        />
        <StatCard icon={Gift} label="Бонус" value={formatPrice(4500)} />
        <StatCard icon={Star} label={t("dash.rating")} value="4.9" />
      </div>

      <Card className="mt-6 p-6">
        <h2 className="mb-5 font-display text-lg font-bold">7 дней</h2>
        <div className="flex items-end justify-between gap-3 h-48">
          {week.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-brand transition-all"
                style={{ height: `${(d.value / max) * 100}%` }}
                title={formatPrice(d.value)}
              />
              <span className="text-xs text-muted">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
