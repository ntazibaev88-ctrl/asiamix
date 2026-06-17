"use client";

import { Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { demoCouriers } from "@/lib/mock";

const tone = {
  online: "success",
  busy: "warning",
  offline: "neutral",
} as const;

export default function AdminCouriersPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t("nav.couriers")} subtitle={t("role.admin")} />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {demoCouriers.map((c) => (
          <Card key={c.name} className="p-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{c.name}</span>
              <Badge tone={tone[c.status]}>
                {c.status === "online"
                  ? t("common.online")
                  : c.status === "offline"
                    ? t("common.offline")
                    : t("status.accepted")}
              </Badge>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted">
                {c.deliveries} {t("nav.orders").toLowerCase()}
              </span>
              <span className="flex items-center gap-1 font-semibold">
                <Star size={14} className="text-warning" fill="currentColor" />
                {c.rating}
              </span>
            </div>
            <div className="mt-2 font-display text-lg font-bold">
              {formatPrice(c.earnings)}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
