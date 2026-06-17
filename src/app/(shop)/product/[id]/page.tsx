"use client";

import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Heart, Minus, Plus, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { products, stores } from "@/lib/mock";
import { useCart, addToCart, decrement } from "@/lib/cart";
import { useFavoriteProducts, toggleFavoriteProduct } from "@/lib/favorites";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/shop/ProductImage";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const { t, locale } = useI18n();

  const product = products.find((p) => p.id === Number(id));
  if (!product) notFound();

  const storeSlug = search.get("store") ?? stores[0].slug;
  const qty = useCart()[product.id]?.qty ?? 0;
  const fav = useFavoriteProducts().includes(product.id);

  const n = product.nutrition;

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Image */}
      <div className="relative -mx-4 -mt-4 h-64">
        <ProductImage
          product={product}
          className="h-full w-full"
          emojiClassName="text-[8rem]"
        />
        <Link
          href={`/stores/${storeSlug}`}
          className="absolute left-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-bg/80 backdrop-blur"
        >
          <ArrowLeft size={18} />
        </Link>
        <button
          onClick={() => toggleFavoriteProduct(product.id)}
          aria-label="favorite"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-bg/80 text-faint backdrop-blur hover:text-brand cursor-pointer"
        >
          <Heart size={18} className={fav ? "text-brand" : ""} fill={fav ? "currentColor" : "none"} />
        </button>
        {product.tag && (
          <span className="absolute bottom-4 left-4 z-10">
            <Badge tone={product.tag === "SALE" ? "danger" : "brand"}>
              {product.tag}
            </Badge>
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-bold leading-tight">
          {product.name[locale]}
        </h1>
        {product.brand && (
          <p className="mt-1 text-sm font-semibold text-muted">{product.brand}</p>
        )}
        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 font-semibold">
            <Star size={15} className="text-warning" fill="currentColor" />
            {product.rating}
          </span>
          <span className="text-faint">·</span>
          <span className="text-muted">{product.unit}</span>
        </div>
      </div>

      {/* Nutrition */}
      {n && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">
            {t("product.per100")}
          </p>
          <div className="grid grid-cols-4 gap-2">
            <Nut value={n.kcal} label={t("product.kcal")} />
            <Nut value={n.protein} label={t("product.protein")} />
            <Nut value={n.fat} label={t("product.fat")} />
            <Nut value={n.carbs} label={t("product.carbs")} />
          </div>
        </div>
      )}

      {/* Weight */}
      {product.weight && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-faint">
            {t("product.weight")}
          </p>
          <p className="mt-0.5 font-semibold">{product.weight}</p>
        </div>
      )}

      {/* Description */}
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-faint">
          {t("product.description")}
        </p>
        <p className="text-sm leading-relaxed text-muted">
          {product.desc[locale]}
        </p>
      </div>

      {/* Sticky add-to-cart */}
      <div className="fixed inset-x-4 bottom-20 z-30 mx-auto max-w-[36rem]">
        {qty === 0 ? (
          <button
            onClick={() => addToCart(product.id, storeSlug)}
            className="flex w-full items-center justify-between rounded-full bg-brand px-6 py-4 font-semibold text-brand-fg shadow-[var(--shadow-lg)] active:scale-[0.99] cursor-pointer"
          >
            <span>{t("common.cart")}</span>
            <span className="flex items-center gap-2 font-display text-lg font-bold">
              {formatPrice(product.price)} <Plus size={18} />
            </span>
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-full bg-brand px-4 py-2.5 text-brand-fg shadow-[var(--shadow-lg)]">
            <button
              onClick={() => decrement(product.id)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/20 cursor-pointer"
            >
              <Minus size={20} />
            </button>
            <span className="font-display text-lg font-bold">
              {qty} · {formatPrice(product.price * qty)}
            </span>
            <button
              onClick={() => addToCart(product.id, storeSlug)}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/20 cursor-pointer"
            >
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Nut({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl bg-surface-2 p-3 text-center">
      <div className="font-display text-lg font-bold">{value}</div>
      <div className="text-[11px] text-faint">{label}</div>
    </div>
  );
}
