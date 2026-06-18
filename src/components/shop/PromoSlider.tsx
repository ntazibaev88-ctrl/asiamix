"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { usePromos, type Promo } from "@/lib/promotions";
import { resolveProductImage } from "@/lib/productImage";

export function PromoSlider({ storeSlug }: { storeSlug: string }) {
  const { t } = useI18n();
  const promos = usePromos(storeSlug);
  if (promos.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold">{t("shop.promos")}</h2>
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {promos.map((p) => (
          <PromoCard key={p.id} promo={p} />
        ))}
      </div>
    </section>
  );
}

function PromoCard({ promo }: { promo: Promo }) {
  const [src, setSrc] = useState<string | null>(promo.image ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (promo.image || !promo.barcode) return;
    let active = true;
    resolveProductImage(promo.barcode).then((u) => {
      if (active && u) setSrc(u);
    });
    return () => {
      active = false;
    };
  }, [promo.image, promo.barcode]);

  const showImage = src && !failed;

  return (
    <div
      className="relative flex h-36 w-72 shrink-0 snap-start overflow-hidden rounded-3xl p-5 text-white shadow-[var(--shadow)]"
      style={{ background: promo.gradient }}
    >
      <div className="z-10 max-w-[55%]">
        <h3 className="font-display text-xl font-bold leading-tight drop-shadow">
          {promo.title}
        </h3>
        {promo.subtitle && (
          <p className="mt-1 text-xs text-white/85">{promo.subtitle}</p>
        )}
      </div>
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute bottom-0 right-0 h-full w-1/2 object-contain object-right-bottom p-2 drop-shadow-lg"
        />
      ) : (
        <span className="absolute -bottom-3 right-1 text-8xl opacity-90">
          {promo.emoji}
        </span>
      )}
    </div>
  );
}
