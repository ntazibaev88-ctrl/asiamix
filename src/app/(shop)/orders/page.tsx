"use client";

import Link from "next/link";
import { Bike, Package } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { demoOrders } from "@/lib/mock";
import { useActiveOrder } from "@/lib/activeOrder";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function OrdersPage() {
  const { t } = useI18n();
  const active = useActiveOrder();
  const history = demoOrders.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("shop.tab.orders")}</h1>

      {/* Active order with live tracking */}
      {active && (
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-faint">
            {t("shop.activeOrder")}
          </h2>
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold">#{active.id}</div>
                <div className="text-sm text-muted">{active.store}</div>
              </div>
              <Badge tone="brand">
                <Bike size={12} /> {active.etaMin > 0 ? `~${active.etaMin} ${t("track.min")}` : t("track.delivered")}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold">{formatPrice(active.total)}</span>
              <Link href="/orders/track">
                <Button size="sm">{t("shop.track")} →</Button>
              </Link>
            </div>
          </Card>
        </section>
      )}

      {/* History */}
      <section>
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-faint">
          {t("shop.tab.orders")}
        </h2>
        {history.length === 0 ? (
          <div className="grid place-items-center py-16 text-center text-muted">
            <Package size={48} className="opacity-30" />
            <p className="mt-3">{t("shop.ordersEmpty")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((o) => (
              <div
                key={o.num}
                className="rounded-2xl border border-border bg-surface p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">#{o.num}</div>
                    <div className="text-sm text-muted">{o.store}</div>
                  </div>
                  <Badge tone={statusTone[o.status]}>{t(`status.${o.status}`)}</Badge>
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
      </section>
    </div>
  );
}
