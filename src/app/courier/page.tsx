"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, Star, TrendingUp, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCourierJobs, setStatus } from "@/lib/courierOrders";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, statusTone } from "@/components/ui/Badge";

export default function CourierDashboard() {
  const { t } = useI18n();
  const [online, setOnline] = useState(true);
  const jobs = useCourierJobs();

  const available = jobs.filter((j) => j.status === "pending" || j.status === "ready");
  const mine = jobs.filter((j) => j.status === "accepted" || j.status === "on_the_way");

  return (
    <>
      <PageHeader
        title={t("nav.dashboard")}
        subtitle={t("role.courier")}
        action={
          <Button
            variant={online ? "outline" : "primary"}
            onClick={() => setOnline((v) => !v)}
          >
            <span className={`h-2 w-2 rounded-full ${online ? "bg-success" : "bg-faint"}`} />
            {online ? t("dash.goOffline") : t("dash.goOnline")}
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label={t("dash.revenue")} value={formatPrice(18400)} delta="+12%" />
        <StatCard icon={Package} label={t("dash.deliveriesToday")} value={String(mine.length + 11)} delta="+3" />
        <StatCard icon={Star} label={t("dash.rating")} value="4.9" />
        <StatCard icon={Wallet} label={t("nav.balance")} value={formatPrice(42600)} />
      </div>

      {/* My active orders (multiple) */}
      {mine.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 font-display text-lg font-bold">{t("courier.myOrders")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {mine.map((j) => (
              <Link key={j.id} href={`/courier/orders/${j.id}`}>
                <Card className="p-5 transition-shadow hover:shadow-[var(--shadow-lg)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">#{j.id}</div>
                      <div className="text-sm text-muted">{j.client.address}</div>
                    </div>
                    <Badge tone={statusTone[j.status]}>{t(`status.${j.status}`)}</Badge>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
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
      )}

      {/* Available orders */}
      <h2 className="mt-8 mb-4 font-display text-lg font-bold">{t("courier.available")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((j) => (
          <Card key={j.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold">#{j.id}</div>
                <div className="text-sm text-muted">{j.store.name} → {j.client.address}</div>
              </div>
              <Badge tone={statusTone[j.status]}>{t(`status.${j.status}`)}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-display text-lg font-bold">{formatPrice(j.total)}</span>
              <Button size="sm" disabled={!online} onClick={() => setStatus(j.id, "on_the_way")}>
                {t("courier.accept")}
              </Button>
            </div>
          </Card>
        ))}
        {available.length === 0 && (
          <p className="text-sm text-muted">—</p>
        )}
      </div>
    </>
  );
}
