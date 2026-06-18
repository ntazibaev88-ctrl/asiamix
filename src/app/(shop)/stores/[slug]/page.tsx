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
import { PromoCarousel } from "@/components/shop/PromoCarousel";
import { PromoSlider } from "@/components/shop/PromoSlider";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { Reveal } from "@/components/shop/Reveal";

export default function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState<"default" | "cheap" | "expensive">("default");
  const map = useCart();

  const store = stores.find((s) => s.slug === slug);
  if (!store) notFound();

  const catalog = useMemo(() => productsForStore(store.slug), [store.slug]);

  const query = q.trim().toLowerCase();
  const results = useMemo(() => {
    let list =
      query
        ? catalog.filter((p) => p.name[locale].toLowerCase().includes(query))
        : cat
          ? catalog.filter((p) => p.cat === cat)
          : [];
    if (brand) list = list.filter((p) => p.brand === brand);
    if (sort === "cheap") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "expensive") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [catalog, query, cat, locale, brand, sort]);

  // Brands available in the current view (category or all when searching).
  const brands = useMemo(() => {
    const base = cat ? catalog.filter((p) => p.cat === cat) : catalog;
    return Array.from(new Set(base.map((p) => p.brand).filter(Boolean))) as string[];
  }, [catalog, cat]);

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

      {/* Promo slider */}
      {showCatalog && <PromoCarousel />}

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
          <Reveal>
            <PromoSlider storeSlug={store.slug} />
          </Reveal>
          <Reveal delay={0.05}>
            <FeaturedSlider
              title={t("store.hits")}
              products={catalog.filter((pr) => pr.tag === "HIT")}
              storeSlug={store.slug}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <FeaturedSlider
              title={t("store.sale")}
              products={catalog.filter((pr) => pr.tag === "SALE" || pr.oldPrice)}
              storeSlug={store.slug}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <FeaturedSlider
              title={t("store.new")}
              products={catalog.filter((pr) => pr.tag === "NEW")}
              storeSlug={store.slug}
            />
          </Reveal>
          <Reveal delay={0.05}>
            <FeaturedSlider
              title={t("store.popular")}
              products={[...catalog].sort((a, b) => b.rating - a.rating).slice(0, 8)}
              storeSlug={store.slug}
            />
          </Reveal>
          {catalogGroups.map((g, i) => {
            const cats = categories.filter((c) => c.group === g.key);
            if (cats.length === 0) return null;
            return (
              <Reveal key={g.key} delay={Math.min(i * 0.03, 0.2)}>
                <section>
                  <h2 className="mb-3 font-display text-xl font-bold">
                    {g.name[locale]}
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {cats.map((c) => (
                      <CategoryCard
                        key={c.slug}
                        emoji={c.emoji}
                        name={c.name[locale]}
                        onClick={() => setCat(c.slug)}
                      />
                    ))}
                  </div>
                </section>
              </Reveal>
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

          {/* Filters: brand + price sort */}
          <div className="flex gap-2">
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="">{t("filter.allBrands")}</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="default">{t("filter.default")}</option>
              <option value="cheap">{t("filter.cheap")}</option>
              <option value="expensive">{t("filter.expensive")}</option>
            </select>
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
