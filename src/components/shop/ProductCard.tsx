"use client";

import { Minus, Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCart, addToCart, decrement } from "@/lib/cart";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/mock";

export function ProductCard({
  product,
  storeSlug,
}: {
  product: Product;
  storeSlug: string;
}) {
  const { locale } = useI18n();
  const qty = useCart()[product.id]?.qty ?? 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="relative grid h-24 place-items-center bg-surface-2 text-5xl">
        {product.emoji}
        {product.tag && (
          <span className="absolute left-2 top-2">
            <Badge tone={product.tag === "SALE" ? "danger" : "brand"}>
              {product.tag}
            </Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-3">
        <div className="text-sm font-semibold leading-tight">
          {product.name[locale]}
        </div>
        <div className="mt-0.5 text-xs text-faint">{product.unit}</div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-base font-bold">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-faint line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => addToCart(product.id, storeSlug)}
              aria-label="add"
              className="grid h-8 w-8 place-items-center rounded-full bg-brand text-brand-fg transition-transform active:scale-90 cursor-pointer"
            >
              <Plus size={17} />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => decrement(product.id)}
                className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 cursor-pointer"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => addToCart(product.id, storeSlug)}
                className="grid h-7 w-7 place-items-center rounded-full bg-brand text-brand-fg cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
