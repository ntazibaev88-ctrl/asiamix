"use client";

import Link from "next/link";
import { ArrowRight, Clock, Heart, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useFavorites, toggleFavorite } from "@/lib/favorites";
import { cn } from "@/lib/cn";
import type { Store } from "@/lib/mock";

export function StoreCard({ store }: { store: Store }) {
  const { t } = useI18n();
  const favs = useFavorites();
  const isFav = favs.includes(store.slug);

  return (
    <Link
      href={`/stores/${store.slug}`}
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 transition-all hover:border-brand hover:shadow-[var(--shadow)]",
        !store.open && "opacity-60",
      )}
    >
      <div
        className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
        style={{ background: store.cover }}
      >
        {store.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-display text-lg font-bold">
            {store.name}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(store.slug);
            }}
            aria-label="favorite"
            className="shrink-0 cursor-pointer text-faint transition-colors hover:text-brand"
          >
            <Heart
              size={18}
              className={isFav ? "text-brand" : ""}
              fill={isFav ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="mt-0.5 truncate text-xs text-muted">{store.address}</div>
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-muted">
            <Clock size={12} /> {store.time} {t("shop.min")}
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <Star size={12} className="text-warning" fill="currentColor" />
            {store.rating}
          </span>
          <span
            className={cn(
              "ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 font-bold",
              store.open
                ? "bg-success-soft text-success"
                : "bg-surface-2 text-faint",
            )}
          >
            {store.open ? t("shop.open") : t("shop.closed")}
            {store.open && <ArrowRight size={12} />}
          </span>
        </div>
      </div>
    </Link>
  );
}
