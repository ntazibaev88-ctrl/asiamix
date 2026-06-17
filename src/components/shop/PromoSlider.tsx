"use client";

import { useI18n } from "@/lib/i18n";
import { usePromos } from "@/lib/promotions";

export function PromoSlider({ storeSlug }: { storeSlug: string }) {
  const { t } = useI18n();
  const promos = usePromos(storeSlug);
  if (promos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold">{t("shop.promos")}</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {promos.map((p) => (
          <div
            key={p.id}
            className="relative flex h-36 w-72 shrink-0 snap-start overflow-hidden rounded-3xl p-5 text-white shadow-[var(--shadow)]"
            style={{ background: p.gradient }}
          >
            <h3 className="z-10 max-w-[55%] font-display text-xl font-bold leading-tight drop-shadow">
              {p.title}
            </h3>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image}
                alt=""
                className="absolute bottom-0 right-0 h-full w-1/2 object-contain object-right-bottom p-2"
              />
            ) : (
              <span className="absolute -bottom-3 right-1 text-8xl opacity-90">
                {p.emoji}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
