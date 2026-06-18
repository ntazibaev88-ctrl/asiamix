"use client";

import Link from "next/link";
import { MapPin, Megaphone } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stores } from "@/lib/mock";
import { useAnnouncement } from "@/lib/announcements";
import { PromoCarousel } from "@/components/shop/PromoCarousel";
import { StoreCard } from "@/components/shop/StoreCard";

export default function ShopHome() {
  const { t } = useI18n();
  const announcement = useAnnouncement();

  return (
    <div className="flex flex-col gap-6">
      {announcement && (
        <div className="flex items-start gap-2 rounded-2xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand">
          <Megaphone size={16} className="mt-0.5 shrink-0" />
          <span>{announcement}</span>
        </div>
      )}
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

      {/* About NOMI */}
      <footer className="mt-2 rounded-3xl bg-surface p-6 shadow-[var(--shadow)]">
        <div className="font-display text-2xl font-bold tracking-tight">
          NOMI<span className="text-brand">.</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {t("about.text")}
        </p>
        <div className="mt-4 border-t border-border pt-4 text-sm">
          <div className="font-semibold">{t("about.contacts")}</div>
          <div className="mt-1 text-muted">📞 +7 700 000 00 00 · ✉️ hello@nomi.kz</div>
          <div className="mt-1 text-muted">🕒 24/7 · Астана, Есіл ауданы</div>
        </div>
        <div className="mt-4 text-xs text-faint">© 2026 NOMI Delivery</div>
      </footer>
    </div>
  );
}
