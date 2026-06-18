"use client";

import { useEffect, useState } from "react";
import { CalendarDays, CalendarRange, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";

interface CourierReport {
  today: number;
  week: number;
  month: number;
  deliveries: number;
  history: {
    txnId: string;
    orderId: string;
    store: string;
    amount: number;
    createdAt: number;
  }[];
}

export default function CourierEarningsPage() {
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

  // Group the recent deliveries by day to draw a simple earnings bar chart.
  const byDay = (r?.history ?? []).reduce<Record<string, number>>((acc, h) => {
    const key = new Date(h.createdAt).toLocaleDateString("ru-RU", {
      weekday: "short",
    });
    acc[key] = (acc[key] ?? 0) + h.amount;
    return acc;
  }, {});
  const days = Object.entries(byDay).slice(-7);
  const max = Math.max(1, ...days.map(([, v]) => v));

  return (
    <>
      <PageHeader title={t("nav.earnings")} subtitle={t("role.courier")} />

      <div className="grid grid-cols-3 gap-4">
        <StatCard icon={TrendingUp} label={t("fin.today")} value={formatPrice(r?.today ?? 0)} />
        <StatCard icon={CalendarDays} label={t("fin.week")} value={formatPrice(r?.week ?? 0)} />
        <StatCard icon={CalendarRange} label={t("fin.month")} value={formatPrice(r?.month ?? 0)} />
      </div>

      {days.length > 0 && (
        <Card className="mt-6 p-6">
          <h2 className="mb-5 font-display text-lg font-bold">{t("fin.deliveries")}</h2>
          <div className="flex h-48 items-end justify-between gap-3">
            {days.map(([day, value]) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-brand transition-all"
                  style={{ height: `${(value / max) * 100}%` }}
                  title={formatPrice(value)}
                />
                <span className="text-xs text-muted">{day}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
