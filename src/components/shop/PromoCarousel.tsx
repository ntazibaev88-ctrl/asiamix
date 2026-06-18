"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import { useHomeBanners } from "@/lib/homeBanners";
import { useI18n } from "@/lib/i18n";
import { IMAGE_SPECS, isLocalSrc } from "@/lib/images";
import { cn } from "@/lib/cn";

export function PromoCarousel() {
  const { t } = useI18n();
  const banners = useHomeBanners();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  if (banners.length === 0) return null;

  const copy = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* ignore */
    }
    setCopied(code);
    setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
  };

  return (
    <div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / (el.clientWidth * 0.92)));
        }}
      >
        {banners.map((b) => (
          <div
            key={b.id}
            className="relative flex h-40 w-[92%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl p-5 text-white"
            style={{ background: b.gradient }}
          >
            {b.image && (
              <>
                <Image
                  src={b.image}
                  alt={b.title}
                  fill
                  sizes={IMAGE_SPECS.banner.sizes}
                  quality={IMAGE_SPECS.banner.quality}
                  unoptimized={isLocalSrc(b.image)}
                  className="object-cover"
                />
                {/* legibility scrim for the overlaid text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
              </>
            )}
            {!b.image && (
              <div className="pointer-events-none absolute -right-4 -bottom-6 text-[8rem] opacity-25" aria-hidden>
                {b.emoji}
              </div>
            )}
            <h3 className="z-10 max-w-[75%] font-display text-2xl font-bold leading-tight">
              {b.title}
            </h3>
            <div className="z-10 flex items-end justify-between gap-2">
              <p className="text-sm text-white/85">{b.subtitle}</p>
              {b.promoCode && (
                <button
                  onClick={() => copy(b.promoCode!)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold backdrop-blur transition-colors hover:bg-white/30 cursor-pointer"
                  title={t("promo.copy")}
                >
                  {copied === b.promoCode ? <Check size={13} /> : <Copy size={13} />}
                  <span className="font-mono tracking-wide">{b.promoCode}</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {banners.map((b, i) => (
          <span
            key={b.id}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === active ? "w-5 bg-brand" : "w-1.5 bg-border-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}
