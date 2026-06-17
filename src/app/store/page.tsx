"use client";

import { Banknote, CreditCard, Plus, Receipt, Star, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrdersTable } from "@/components/OrdersTable";
import { demoOrders } from "@/lib/mock";
import Link from "next/link";

export default function StoreDashboard() {
  const { t } = useI18n();
  const store = useActiveStore();
  const storeOrders = demoOrders.filter((o) => o.store === store.name);

  return (
    <>
      <PageHeader
        title={t("nav.dashboard")}
        subtitle={`${store.emoji} ${store.name} · ${store.address}`}
        action={
          <Link href="/store/products">
            <Button>
              <Plus size={18} /> {t("dash.addProduct")}
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label={t("dash.revenue")} value={formatPrice(284000)} delta="+9%" />
        <StatCard icon={Receipt} label={t("dash.ordersCount")} value="48" delta="+5" />
        <StatCard icon={Wallet} label={t("dash.avgCheck")} value={formatPrice(5900)} />
        <StatCard icon={Star} label={t("dash.rating")} value={String(store.rating)} />
      </div>

      {/* Payment breakdown: online vs cash */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CreditCard size={16} className="text-brand" /> {t("store.online")}
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {formatPrice(191000)}
          </div>
          <div className="mt-1 text-xs text-faint">67% · 32 {t("nav.orders").toLowerCase()}</div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Banknote size={16} className="text-success" /> {t("store.cashPay")}
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {formatPrice(93000)}
          </div>
          <div className="mt-1 text-xs text-faint">33% · 16 {t("nav.orders").toLowerCase()}</div>
        </Card>
      </div>

      <h2 className="mt-8 mb-4 font-display text-lg font-bold">
        {t("dash.recentOrders")}
      </h2>
      <OrdersTable orders={storeOrders} showStore={false} />
    </>
  );
}
