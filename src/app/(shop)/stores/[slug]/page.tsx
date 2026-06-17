"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Clock, Search, ShoppingBasket, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import {
  catalogGroups,
  categories,
  productsForStore,
  stores,
} from "@/lib/mock";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { ProductCard } from "@/components/shop/ProductCard";
import { FeaturedSlider } from "@/components/shop/FeaturedSlider";

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const map = useCart();

  const store = stores.find((s) => s.slug === slug);
  if (!store) notFound();

  const catalog = useMemo(() => productsForStore(store.slug), [store.slug]);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    if (query)
      return catalog.filter((p) =>
        p.name[locale].toLowerCase().includes(query),
      );
    if (cat) return catalog.filter((p) => p.cat === cat);
    return [];
  }, [catalog, query, cat, locale]);

  const count = cartCount(map);
  const total = cartTotal(map);
  const showCatalog = !query && !cat;
  const activeCat = categories.find((c) => c.slug === cat);

  return (
    <div className="flex flex-col gap-4">
      {/* Store header */}
      <div
        className="relative -mx-4 -mt-4 flex h-36 flex-col justify-end p-4 text-white"
        style={{ background: store.cover }}
      >
        <Link
          href="/stores"
          className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/25 backdrop-blur"
        >
          <ArrowLeft size={18} />
        </Link>
        <div className="text-4xl">{store.emoji}</div>
        <h1 className="mt-1 font-display text-2xl font-bold">{store.name}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1">
            <Clock size={13} /> {store.time} {t("shop.min")}
          </span>
          <span className="flex items-center gap-1">
            <Star size={13} fill="currentColor" /> {store.rating}
          </span>
          <span className="truncate">{store.address}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("shop.searchProducts")}
          className="w-full rounded-full border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      {showCatalog ? (
        /* Catalog: hits/discounts slider + category tiles grouped like Рядом */
        <div className="flex flex-col gap-6">
          <FeaturedSlider
            title={t("store.hits")}
            products={catalog.filter((pr) => pr.tag === "HIT" || pr.tag === "SALE")}
            storeSlug={store.slug}
          />
          {catalogGroups.map((g) => {
            const cats = categories.filter((c) => c.group === g.key);
            if (cats.length === 0) return null;
            return (
              <section key={g.key}>
                <h2 className="mb-3 font-display text-lg font-bold">
                  {g.name[locale]}
                </h2>
                <div className="grid grid-cols-3 gap-2.5">
                  {cats.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setCat(c.slug)}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-surface p-3 text-center transition-all hover:border-brand active:scale-95 cursor-pointer"
                    >
                      <span className="text-3xl">{c.emoji}</span>
                      <span className="text-[11px] font-semibold leading-tight">
                        {c.name[locale]}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Category / search results */
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {!query && (
              <button
                onClick={() => setCat(null)}
                className="flex items-center gap-1 text-sm font-semibold text-brand cursor-pointer"
              >
                <ArrowLeft size={16} /> {t("shop.categories")}
              </button>
            )}
            {activeCat && !query && (
              <span className="font-display text-lg font-bold">
                {activeCat.emoji} {activeCat.name[locale]}
              </span>
            )}
          </div>
          {results.length === 0 ? (
            <p className="py-16 text-center text-muted">
              {t("shop.nothingFound")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {results.map((prod) => (
                <ProductCard key={prod.id} product={prod} storeSlug={store.slug} />
              ))}
            </div>
          )}
        </div>
      )}

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
