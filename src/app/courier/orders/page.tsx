"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCourierJobs } from "@/lib/courierOrders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";

export default function CourierOrdersPage() {
  const { t } = useI18n();
  const jobs = useCourierJobs();

  return (
    <>
      <PageHeader title={t("nav.orders")} subtitle={t("role.courier")} />
      <div className="flex flex-col gap-3">
        {jobs.map((j) => (
          <Link key={j.id} href={`/courier/orders/${j.id}`}>
            <Card className="p-4 transition-shadow hover:shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between">
                <span className="font-bold">#{j.id}</span>
                <Badge tone={statusTone[j.status]}>{t(`status.${j.status}`)}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Store size={15} className="text-brand" />
                <span className="text-muted">{j.store.name},</span>
                <span>{j.store.address}</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-sm">
                <MapPin size={15} className="text-danger" />
                <span className="text-muted">{j.client.name},</span>
                <span className="truncate">{j.client.address}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="font-display font-bold">{formatPrice(j.total)}</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand">
                  {t("courier.open")} <ArrowRight size={15} />
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
