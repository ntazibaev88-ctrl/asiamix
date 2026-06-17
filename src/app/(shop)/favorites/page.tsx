"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { products, stores } from "@/lib/mock";
import { useFavorites, useFavoriteProducts } from "@/lib/favorites";
import { StoreCard } from "@/components/shop/StoreCard";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";

export default function FavoritesPage() {
  const { t } = useI18n();
  const favSlugs = useFavorites();
  const favProductIds = useFavoriteProducts();

  const favStores = stores.filter((s) => favSlugs.includes(s.slug));
  const favProducts = products.filter((p) => favProductIds.includes(p.id));
  const empty = favStores.length === 0 && favProducts.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">
        {t("shop.tab.favorites")}
      </h1>

      {empty ? (
        <div className="grid place-items-center py-20 text-center text-muted">
          <Heart size={48} className="opacity-30" />
          <p className="mt-3">{t("shop.favEmpty")}</p>
          <Link href="/stores" className="mt-4">
            <Button size="sm">{t("shop.goShopping")}</Button>
          </Link>
        </div>
      ) : (
        <>
          {favProducts.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold">
                {t("shop.favProducts")}
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {favProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    storeSlug={stores[0].slug}
                  />
                ))}
              </div>
            </section>
          )}

          {favStores.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold">
                {t("shop.favStores")}
              </h2>
              <div className="flex flex-col gap-3">
                {favStores.map((s) => (
                  <StoreCard key={s.slug} store={s} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
