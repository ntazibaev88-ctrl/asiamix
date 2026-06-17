"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stores } from "@/lib/mock";
import { useFavorites } from "@/lib/favorites";
import { StoreCard } from "@/components/shop/StoreCard";
import { Button } from "@/components/ui/Button";

export default function FavoritesPage() {
  const { t } = useI18n();
  const favs = useFavorites();
  const favStores = stores.filter((s) => favs.includes(s.slug));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">
        {t("shop.tab.favorites")}
      </h1>
      {favStores.length === 0 ? (
        <div className="grid place-items-center py-20 text-center text-muted">
          <Heart size={48} className="opacity-30" />
          <p className="mt-3">{t("shop.favEmpty")}</p>
          <Link href="/stores" className="mt-4">
            <Button size="sm">{t("shop.goShopping")}</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favStores.map((s) => (
            <StoreCard key={s.slug} store={s} />
          ))}
        </div>
      )}
    </div>
  );
}
