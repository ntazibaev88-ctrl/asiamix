"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { addToCart } from "@/lib/cart";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/mock";

export function FeaturedSlider({
  title,
  products,
  storeSlug,
}: {
  title: string;
  products: Product[];
  storeSlug: string;
}) {
  const { locale } = useI18n();
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 font-display text-lg font-bold">{title}</h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((p) => (
          <div
            key={p.id}
            className="relative flex w-36 shrink-0 flex-col overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow)]"
          >
            <Link
              href={`/product/${p.id}?store=${storeSlug}`}
              className="relative grid h-24 place-items-center bg-gradient-to-br from-surface-2 to-[color-mix(in_srgb,var(--brand)_8%,var(--surface-2))] text-5xl"
            >
              {p.emoji}
              {p.tag && (
                <span className="absolute left-2 top-2">
                  <Badge tone={p.tag === "SALE" ? "danger" : "brand"}>
                    {p.tag}
                  </Badge>
                </span>
              )}
            </Link>
            <div className="flex flex-1 flex-col p-3">
              <Link
                href={`/product/${p.id}?store=${storeSlug}`}
                className="line-clamp-2 text-xs font-semibold leading-tight hover:text-brand"
              >
                {p.name[locale]}
              </Link>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="font-display text-sm font-bold">
                    {formatPrice(p.price)}
                  </span>
                  {p.oldPrice && (
                    <span className="text-[10px] text-faint line-through">
                      {formatPrice(p.oldPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(p.id, storeSlug)}
                  aria-label="add"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-brand-fg active:scale-90 cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
