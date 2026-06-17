"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { demoOrders } from "@/lib/mock";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function OrdersPage() {
  const { t } = useI18n();
  // Demo: show this customer's recent orders.
  const myOrders = demoOrders.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("shop.tab.orders")}</h1>

      {myOrders.length === 0 ? (
        <div className="grid place-items-center py-20 text-center text-muted">
          <Package size={48} className="opacity-30" />
          <p className="mt-3">{t("shop.ordersEmpty")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {myOrders.map((o) => (
            <div
              key={o.num}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">#{o.num}</div>
                  <div className="text-sm text-muted">{o.store}</div>
                </div>
                <Badge tone={statusTone[o.status]}>
                  {t(`status.${o.status}`)}
                </Badge>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm text-muted">
                  {o.items} {t("shop.items")} · {formatPrice(o.total)}
                </span>
                <Link href="/">
                  <Button variant="outline" size="sm">
                    {t("shop.repeat")}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
