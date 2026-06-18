"use client";

import { Bike, Receipt, Store, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { OrdersTable } from "@/components/OrdersTable";
import { WeatherControl } from "@/components/admin/WeatherControl";
import { Card } from "@/components/ui/Card";
import { demoOrders } from "@/lib/mock";
import { useManagedStores } from "@/lib/managedStores";

const WEEK = [
  { day: "Пн", value: 480000 },
  { day: "Вт", value: 620000 },
  { day: "Ср", value: 540000 },
  { day: "Чт", value: 710000 },
  { day: "Пт", value: 920000 },
  { day: "Сб", value: 1080000 },
  { day: "Вс", value: 860000 },
];

export default function AdminDashboard() {
  const { t } = useI18n();
  const stores = useManagedStores();
  const revenue = stores.reduce((s, x) => s + x.revenue, 0);
  const orders = stores.reduce((s, x) => s + x.orders, 0);

  return (
    <>
      <PageHeader title={t("nav.dashboard")} subtitle={t("role.admin")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(revenue)}
          delta="+16%"
        />
        <StatCard
          icon={Receipt}
          label={t("dash.ordersCount")}
          value={String(orders)}
          delta="+64"
        />
        <StatCard icon={Store} label={t("nav.stores")} value={String(stores.length)} />
        <StatCard icon={Bike} label={t("dash.activeCouriers")} value="3" />
      </div>

      {/* Revenue chart */}
      <Card className="mt-6 p-6">
        <h2 className="mb-5 font-display text-lg font-bold">{t("admin.revenueChart")}</h2>
        <div className="flex h-48 items-end justify-between gap-3">
          {WEEK.map((d) => {
            const max = Math.max(...WEEK.map((x) => x.value));
            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-brand transition-all"
                  style={{ height: `${(d.value / max) * 100}%` }}
                  title={formatPrice(d.value)}
                />
                <span className="text-xs text-muted">{d.day}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-6">
        <WeatherControl />
      </div>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("dash.recentOrders")}
      </h2>
      <OrdersTable orders={demoOrders} />
    </>
  );
}
