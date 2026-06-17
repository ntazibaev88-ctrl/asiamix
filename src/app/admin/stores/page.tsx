"use client";

import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { demoStores } from "@/lib/mock";

export default function AdminStoresPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("nav.stores")} subtitle={t("role.admin")} />
      <div className="grid gap-3 sm:grid-cols-2">
        {demoStores.map((s) => (
          <Card key={s.name} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-lg font-bold">{s.name}</div>
                <div className="text-sm text-muted">{s.city}</div>
              </div>
              <Badge tone={s.active ? "success" : "neutral"}>
                {s.active ? t("common.online") : t("common.offline")}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <Metric label={t("nav.orders")} value={String(s.orders)} />
              <Metric
                label={t("dash.commission")}
                value={`${s.commission}%`}
              />
              <Metric
                label={t("dash.rating")}
                value={
                  <span className="flex items-center justify-center gap-1">
                    <Star size={13} className="text-warning" fill="currentColor" />
                    {s.rating}
                  </span>
                }
              />
            </div>
            <div className="mt-4 border-t border-border pt-3 text-sm">
              <span className="text-muted">{t("dash.revenue")}: </span>
              <span className="font-semibold">{formatPrice(s.revenue)}</span>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-surface-2 py-2">
      <div className="font-semibold">{value}</div>
      <div className="text-[11px] text-faint">{label}</div>
    </div>
  );
}
