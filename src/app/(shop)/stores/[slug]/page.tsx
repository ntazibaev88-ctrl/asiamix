"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Clock, ShoppingBasket, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { categories, products, stores } from "@/lib/mock";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/cn";

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const [cat, setCat] = useState("all");
  const map = useCart();

  const store = stores.find((s) => s.slug === slug);
  if (!store) notFound();

  const filtered = useMemo(
    () => (cat === "all" ? products : products.filter((p) => p.cat === cat)),
    [cat],
  );

  const count = cartCount(map);
  const total = cartTotal(map);

  return (
    <div className="flex flex-col gap-4">
      {/* Store header */}
      <div
        className="relative -mx-4 -mt-4 flex h-40 flex-col justify-end p-4 text-white"
        style={{ background: store.cover }}
      >
        <Link
          href="/stores"
          className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="text-5xl">{store.emoji}</div>
        <h1 className="mt-1 font-display text-2xl font-bold">{store.name}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {store.time} {t("shop.min")}
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" /> {store.rating}
          </span>
          <span>{store.address}</span>
        </div>
      </div>

      {/* Category chips */}
      <div className="sticky top-14 z-20 -mx-4 flex gap-2 overflow-x-auto bg-bg/90 px-4 py-2 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setCat(c.slug)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors cursor-pointer",
              cat === c.slug
                ? "bg-brand text-brand-fg"
                : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            <span>{c.emoji}</span>
            {c.name[locale]}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} storeSlug={store.slug} />
        ))}
      </div>

      {/* Sticky cart bar */}
      {count > 0 && (
        <Link
          href="/cart"
          className="fixed inset-x-4 bottom-20 z-30 mx-auto flex max-w-[36rem] items-center justify-between rounded-full bg-brand px-5 py-3.5 font-semibold text-brand-fg shadow-[var(--shadow-lg)]"
        >
          <span className="flex items-center gap-2">
            <ShoppingBasket size={18} />
            {count} {t("shop.items")}
          </span>
          <span className="font-display text-lg font-bold">
            {formatPrice(total)}
          </span>
        </Link>
      )}
    </div>
  );
}
