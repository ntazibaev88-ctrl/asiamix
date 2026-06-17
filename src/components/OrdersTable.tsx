"use client";

import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DemoOrder } from "@/lib/mock";

export function OrdersTable({
  orders,
  showStore = true,
}: {
  orders: DemoOrder[];
  showStore?: boolean;
}) {
  const { t } = useI18n();
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-faint">
              <th className="px-5 py-3 font-semibold">#</th>
              <th className="px-5 py-3 font-semibold">{t("role.customer")}</th>
              {showStore && (
                <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                  {t("role.store")}
                </th>
              )}
              <th className="px-5 py-3 font-semibold">{t("common.total")}</th>
              <th className="px-5 py-3 font-semibold">{t("nav.orders")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.num}
                className="border-b border-border last:border-0 transition-colors hover:bg-surface-2"
              >
                <td className="px-5 py-3 font-bold">#{o.num}</td>
                <td className="px-5 py-3">
                  <div className="font-medium">{o.customer}</div>
                  <div className="text-xs text-faint">
                    {o.items} × · {o.minsAgo} {t("common.today")}
                  </div>
                </td>
                {showStore && (
                  <td className="hidden px-5 py-3 text-muted sm:table-cell">
                    {o.store}
                  </td>
                )}
                <td className="px-5 py-3 font-semibold">
                  {formatPrice(o.total)}
                </td>
                <td className="px-5 py-3">
                  <Badge tone={statusTone[o.status]}>
                    {t(`status.${o.status}`)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
