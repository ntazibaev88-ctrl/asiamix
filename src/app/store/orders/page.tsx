"use client";

import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/ui/PageHeader";
import { OrdersTable } from "@/components/OrdersTable";
import { demoOrders } from "@/lib/mock";

export default function StoreOrdersPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("nav.orders")} subtitle="NOMI Sushi" />
      <OrdersTable orders={demoOrders} showStore={false} />
    </>
  );
}
