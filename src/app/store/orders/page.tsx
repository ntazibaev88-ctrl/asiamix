"use client";

import { useState } from "react";
import { Check, ChefHat, ChevronDown, Minus, Plus, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { useStoreOrders, setOrderStatus } from "@/lib/storeOrders";
import { useAdjustedOrder, setLineQty } from "@/lib/storeOrderItems";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";
import type { DemoOrder } from "@/lib/mock";

export default function StoreOrdersPage() {
  const { t } = useI18n();
  const store = useActiveStore();
  const orders = useStoreOrders(store.name);

  return (
    <>
      <PageHeader title={t("nav.orders")} subtitle={`${store.emoji} ${store.name}`} />
      <div className="flex flex-col gap-3">
        {orders.map((o) => (
          <OrderCard key={o.num} order={o} />
        ))}
      </div>
    </>
  );
}

function OrderCard({ order: o }: { order: DemoOrder }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const adj = useAdjustedOrder(o.num, o.lines ?? []);
  const editable = o.status === "pending" || o.status === "accepted";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold">#{o.num}</div>
          <div className="text-sm text-muted">{o.customer} · {o.items} ×</div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold">{formatPrice(adj.newTotal || o.total)}</div>
          <Badge tone={statusTone[o.status]}>{t(`status.${o.status}`)}</Badge>
        </div>
      </div>

      {o.comment && (
        <div className="mt-2 rounded-xl bg-warning-soft px-3 py-1.5 text-xs text-warning">
          💬 {o.comment}
        </div>
      )}

      {/* Items toggle */}
      {o.lines && o.lines.length > 0 && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="mt-3 flex w-full items-center justify-between text-sm font-semibold text-muted hover:text-fg cursor-pointer"
          >
            {t("store.items")}
            <ChevronDown size={16} className={open ? "rotate-180 transition" : "transition"} />
          </button>
          {open && (
            <div className="mt-2 flex flex-col gap-2">
              {editable && (
                <p className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-muted">
                  {t("store.outOfStock")}
                </p>
              )}
              {adj.lines.map((l, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 rounded-xl bg-surface-2 p-2.5 ${
                    l.adjustedQty === 0 ? "opacity-50" : ""
                  }`}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-bg text-xl">{l.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{l.name}</div>
                    <div className="text-xs text-faint">{formatPrice(l.price)}</div>
                  </div>
                  {editable ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setLineQty(o.num, i, l.adjustedQty - 1)}
                        disabled={l.adjustedQty === 0}
                        className="grid h-7 w-7 place-items-center rounded-full bg-bg disabled:opacity-40 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{l.adjustedQty}</span>
                      <button
                        onClick={() => setLineQty(o.num, i, Math.min(l.qty, l.adjustedQty + 1))}
                        disabled={l.adjustedQty >= l.qty}
                        className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-fg disabled:opacity-40 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold">× {l.adjustedQty}</span>
                  )}
                </div>
              ))}
              {adj.refund > 0 && (
                <div className="flex items-center justify-between rounded-xl bg-danger-soft px-3 py-2 text-sm font-semibold text-danger">
                  <span>↩ {t("store.refund")}</span>
                  <span>{formatPrice(adj.refund)}</span>
                </div>
              )}
            </div>
          )}
        </>
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
  );
}
