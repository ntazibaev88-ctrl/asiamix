"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { categories, productsForStore } from "@/lib/mock";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

export default function StoreProductsPage() {
  const { t, locale } = useI18n();
  const store = useActiveStore();
  const catalog = productsForStore(store.slug);

  const [cat, setCat] = useState("all");
  const [available, setAvailable] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(catalog.map((p) => [p.id, true])),
  );

  // Only categories that actually have products in this store.
  const usedCats = useMemo(() => {
    const set = new Set(catalog.map((p) => p.cat));
    return categories.filter((c) => set.has(c.slug));
  }, [catalog]);

  const list = cat === "all" ? catalog : catalog.filter((p) => p.cat === cat);

  return (
    <>
      <PageHeader
        title={t("nav.products")}
        subtitle={`${store.emoji} ${store.name}`}
        action={
          <Button>
            <Plus size={18} /> {t("dash.addProduct")}
          </Button>
        }
      />

      {/* Category filter */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[{ slug: "all", emoji: "🛒", name: { kk: "Барлығы", ru: "Все", en: "All" } }, ...usedCats].map(
          (c) => (
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
          ),
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Card key={p.id} className="flex items-center gap-4 p-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-2 text-3xl">
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">{p.name[locale]}</span>
                {p.tag && <Badge tone={p.tag === "SALE" ? "danger" : "brand"}>{p.tag}</Badge>}
              </div>
              <div className="text-sm font-bold">
                {formatPrice(p.price)}{" "}
                <span className="text-xs font-normal text-faint">/ {p.unit}</span>
              </div>
              <button
                onClick={() => setAvailable((s) => ({ ...s, [p.id]: !s[p.id] }))}
                className="mt-1 cursor-pointer"
              >
                <Badge tone={available[p.id] ? "success" : "neutral"}>
                  {available[p.id] ? t("shop.open") : t("shop.closed")}
                </Badge>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted hover:text-fg cursor-pointer">
                <Pencil size={15} />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted hover:text-danger cursor-pointer">
                <Trash2 size={15} />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
