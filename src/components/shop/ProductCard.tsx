"use client";

import Link from "next/link";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useCart, addToCart, decrement } from "@/lib/cart";
import { useFavoriteProducts, toggleFavoriteProduct } from "@/lib/favorites";
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
  const fav = useFavoriteProducts().includes(product.id);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl bg-surface shadow-[var(--shadow)] transition-shadow duration-200 hover:shadow-[var(--shadow-lg)]">
      <Link
        href={`/product/${product.id}?store=${storeSlug}`}
        className="relative grid h-28 place-items-center bg-gradient-to-br from-surface-2 to-[color-mix(in_srgb,var(--brand)_8%,var(--surface-2))] text-6xl"
      >
        {product.emoji}
        {product.tag && (
          <span className="absolute left-2 top-2">
            <Badge tone={product.tag === "SALE" ? "danger" : "brand"}>
              {product.tag}
            </Badge>
          </span>
        )}
      </Link>
      <button
        onClick={() => toggleFavoriteProduct(product.id)}
        aria-label="favorite"
        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-bg/70 text-faint backdrop-blur transition-colors hover:text-brand cursor-pointer"
      >
        <Heart size={15} className={fav ? "text-brand" : ""} fill={fav ? "currentColor" : "none"} />
      </button>
      <div className="flex flex-1 flex-col p-3">
        <Link
          href={`/product/${product.id}?store=${storeSlug}`}
          className="text-sm font-semibold leading-tight hover:text-brand"
        >
          {product.name[locale]}
        </Link>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-faint">
          <span>{product.unit}</span>
          <span className="flex items-center gap-0.5">
            <Star size={11} className="text-warning" fill="currentColor" />
            {product.rating}
          </span>
        </div>
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
