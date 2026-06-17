"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { promos } from "@/lib/mock";
import { cn } from "@/lib/cn";

export function PromoCarousel() {
  const { locale } = useI18n();
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / (el.clientWidth * 0.92)));
        }}
      >
        {promos.map((p) => (
          <div
            key={p.id}
            className="relative flex h-40 w-[92%] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl p-5 text-white"
            style={{ background: p.gradient }}
          >
            <div
              className="pointer-events-none absolute -right-6 -bottom-8 text-[9rem] opacity-20"
              aria-hidden
            >
              {p.emoji}
            </div>
            <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold backdrop-blur">
              {p.badge}
            </span>
            <div>
              <h3 className="max-w-[80%] font-display text-xl font-bold leading-tight">
                {p.title[locale]}
              </h3>
              <div className="mt-1 flex items-end gap-2">
                {p.oldPrice && (
                  <span className="text-sm text-white/60 line-through">
                    {p.oldPrice}
                  </span>
                )}
                <span className="font-display text-2xl font-bold">
                  {p.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {promos.map((p, i) => (
          <span
            key={p.id}
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
