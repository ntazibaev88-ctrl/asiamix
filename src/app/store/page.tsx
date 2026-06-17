"use client";

import { Plus, Receipt, Star, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { OrdersTable } from "@/components/OrdersTable";
import { demoOrders } from "@/lib/mock";

export default function StoreDashboard() {
  const { t } = useI18n();
  const storeOrders = demoOrders.filter((o) => o.store === "NOMI Sushi");

  return (
    <>
      <PageHeader
        title={t("nav.dashboard")}
        subtitle="NOMI Sushi · Алматы"
        action={
          <Button>
            <Plus size={18} /> {t("dash.addProduct")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label={t("dash.revenue")}
          value={formatPrice(284000)}
          delta="+9%"
        />
        <StatCard
          icon={Receipt}
          label={t("dash.ordersCount")}
          value="48"
          delta="+5"
        />
        <StatCard
          icon={Wallet}
          label={t("dash.avgCheck")}
          value={formatPrice(5900)}
        />
        <StatCard icon={Star} label={t("dash.rating")} value="4.8" />
      </div>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("dash.recentOrders")}
      </h2>
      <OrdersTable orders={storeOrders} showStore={false} />
    </>
  );
}
