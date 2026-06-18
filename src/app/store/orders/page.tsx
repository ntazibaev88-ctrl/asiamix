"use client";

import { Check, ChefHat, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { useStoreOrders, setOrderStatus } from "@/lib/storeOrders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";

export default function StoreOrdersPage() {
  const { t } = useI18n();
  const store = useActiveStore();
  const orders = useStoreOrders(store.name);

  return (
    <>
      <PageHeader title={t("nav.orders")} subtitle={`${store.emoji} ${store.name}`} />
      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <Card key={o.num} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">#{o.num}</div>
                <div className="text-sm text-muted">{o.customer} · {o.items} ×</div>
              </div>
              <div className="text-right">
                <div className="font-display font-bold">{formatPrice(o.total)}</div>
                <Badge tone={statusTone[o.status]}>{t(`status.${o.status}`)}</Badge>
              </div>
            </div>
            {o.comment && (
              <div className="mt-2 rounded-xl bg-warning-soft px-3 py-1.5 text-xs text-warning">
                💬 {o.comment}
              </div>
            )}
            {/* Actions */}
            <div className="mt-3 flex gap-2 border-t border-border pt-3">
              {o.status === "pending" && (
                <>
                  <Button size="sm" className="flex-1" onClick={() => setOrderStatus(o.num, "accepted")}>
                    <Check size={16} /> {t("store.accept")}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => setOrderStatus(o.num, "cancelled")}>
                    <X size={16} /> {t("store.reject")}
                  </Button>
                </>
              )}
              {o.status === "accepted" && (
                <Button size="sm" className="flex-1" onClick={() => setOrderStatus(o.num, "ready")}>
                  <ChefHat size={16} /> {t("store.ready")}
                </Button>
              )}
              {(o.status === "ready" || o.status === "on_the_way" || o.status === "delivered") && (
                <span className="text-sm font-medium text-success">✓ {t(`status.${o.status}`)}</span>
              )}
              {o.status === "cancelled" && (
                <span className="text-sm font-medium text-danger">✕ {t("status.cancelled")}</span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
