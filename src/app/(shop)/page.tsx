"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stores } from "@/lib/mock";
import { PromoCarousel } from "@/components/shop/PromoCarousel";
import { StoreCard } from "@/components/shop/StoreCard";

export default function ShopHome() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-muted">
          <MapPin size={15} className="text-brand" />
          {t("shop.deliveryTo")}:{" "}
          <span className="text-fg">Астана · Есіл ауданы</span>
        </div>
        <p className="rounded-xl bg-warning-soft px-3 py-2 text-xs font-medium text-warning">
          {t("shop.districtNote")}
        </p>
      </div>

      <PromoCarousel />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{t("shop.stores")}</h2>
          <Link href="/stores" className="text-sm font-semibold text-brand">
            {t("shop.all")} →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {stores.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
