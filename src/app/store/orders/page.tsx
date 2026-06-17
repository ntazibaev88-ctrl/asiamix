"use client";

import { useI18n } from "@/lib/i18n";
import { useActiveStore } from "@/lib/activeStore";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrdersTable } from "@/components/OrdersTable";
import { demoOrders } from "@/lib/mock";

export default function StoreOrdersPage() {
  const { t } = useI18n();
  const store = useActiveStore();
  const orders = demoOrders.filter((o) => o.store === store.name);

  return (
    <>
      <PageHeader title={t("nav.orders")} subtitle={`${store.emoji} ${store.name}`} />
      <OrdersTable orders={orders} showStore={false} />
    </>
  );
}
