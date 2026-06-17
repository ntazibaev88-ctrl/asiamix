"use client";

import { useI18n } from "@/lib/i18n";
import { specialOffers } from "@/lib/mock";

export function SpecialOffers() {
  const { t, locale } = useI18n();

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold">
        {t("shop.specialOffers")}
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {specialOffers.map((o) => (
          <button
            key={o.id}
            className="relative flex h-28 flex-col justify-start overflow-hidden rounded-2xl p-4 text-left transition-transform active:scale-95 cursor-pointer"
            style={{ background: o.gradient }}
          >
            <span className="max-w-[80%] font-display text-base font-bold leading-tight text-[#1a1a1a]">
              {o.title[locale]}
            </span>
            <span
              className="pointer-events-none absolute -bottom-3 -right-2 text-6xl opacity-90"
              aria-hidden
            >
              {o.emoji}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
