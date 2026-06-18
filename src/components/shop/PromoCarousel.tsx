"use client";

import { useState } from "react";
import { useHomeBanners } from "@/lib/homeBanners";
import { cn } from "@/lib/cn";

export function PromoCarousel() {
  const banners = useHomeBanners();
  const [active, setActive] = useState(0);
  if (banners.length === 0) return null;

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
            <div className="pointer-events-none absolute -right-4 -bottom-6 text-[8rem] opacity-25" aria-hidden>
              {b.emoji}
            </div>
            <h3 className="z-10 max-w-[75%] font-display text-2xl font-bold leading-tight">
              {b.title}
            </h3>
            <p className="z-10 text-sm text-white/85">{b.subtitle}</p>
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
