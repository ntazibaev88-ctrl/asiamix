"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Package, ShoppingBag, Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCourierJobs, setStatus } from "@/lib/courierOrders";
import { WeightTag } from "@/components/courier/WeightTag";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

// Courier origin (demo) — Astana center, for distance sorting.
const ORIGIN = { lat: 51.09, lng: 71.42 };
const MAX_BATCH = 5;

function km(lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - ORIGIN.lat) * Math.PI) / 180;
  const dLng = ((lng - ORIGIN.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((ORIGIN.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}

type Sort = "distance" | "weight" | "time";

export default function CourierPoolPage() {
  const { t } = useI18n();
  const jobs = useCourierJobs();
  const [sort, setSort] = useState<Sort>("distance");

  const available = jobs
    .filter((j) => j.status === "pending" || j.status === "ready")
    .map((j) => ({ ...j, dist: km(j.client.lat, j.client.lng) }))
    .sort((a, b) => {
      if (sort === "weight") return b.weightKg - a.weightKg;
      if (sort === "distance") return a.dist - b.dist;
      return a.minsAgo - b.minsAgo;
    });

  const takeAll = () => {
    available.slice(0, MAX_BATCH).forEach((j) => setStatus(j.id, "on_the_way"));
  };

  const sorts: { key: Sort; label: string }[] = [
    { key: "distance", label: t("pool.byDistance") },
    { key: "weight", label: t("courier.weight") },
    { key: "time", label: t("pool.byTime") },
  ];

  return (
    <>
      <PageHeader
        title={t("pool.title")}
        subtitle={t("role.courier")}
        action={
          available.length > 0 && (
            <Button onClick={takeAll}>
              {t("pool.takeAll")} ({Math.min(available.length, MAX_BATCH)})
            </Button>
          )
        }
      />

      <div className="mb-4 flex gap-2">
        {sorts.map((s) => (
          <button
            key={s.key}
            onClick={() => setSort(s.key)}
            className={cn(
              "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer",
              sort === s.key ? "bg-brand text-brand-fg" : "bg-surface-2 text-muted",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {available.map((j) => (
          <Card key={j.id} className="p-5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-bold text-brand">
                🔔 {t("courier.newOrder")}
              </span>
              <span className="text-sm font-bold text-muted">#{j.id}</span>
            </div>

            <div className="mt-3">
              <WeightTag kg={j.weightKg} />
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm">
              <Store size={14} className="text-brand" /> {j.store.name}
            </div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted">
              <MapPin size={14} className="text-danger" /> {j.dist} км · {j.minsAgo} мин
            </div>

            <div className="mt-3 flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Package size={13} /> {j.items} {t("courier.items").toLowerCase()}
              </span>
              <span className="flex items-center gap-1">
                <ShoppingBag size={13} /> {j.bags} {t("courier.bags")}
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => setStatus(j.id, "on_the_way")}>
                {t("courier.accept")}
              </Button>
              <Link href={`/courier/orders/${j.id}`}>
                <Button size="sm" variant="outline">
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
        {available.length === 0 && <p className="text-sm text-muted">—</p>}
      </div>
    </>
  );
}
