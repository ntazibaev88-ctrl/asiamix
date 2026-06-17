"use client";

import { Bike, Receipt, Store, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { OrdersTable } from "@/components/OrdersTable";
import { demoOrders } from "@/lib/mock";

export default function AdminDashboard() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("nav.dashboard")} subtitle={t("role.admin")} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(5480000)}
          delta="+16%"
        />
        <StatCard
          icon={Receipt}
          label={t("dash.ordersCount")}
          value="751"
          delta="+64"
        />
        <StatCard
          icon={Store}
          label={t("nav.stores")}
          value="4"
        />
        <StatCard
          icon={Bike}
          label={t("dash.activeCouriers")}
          value="3"
        />
      </div>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("dash.recentOrders")}
      </h2>
      <OrdersTable orders={demoOrders} />
    </>
  );
}
