"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { products } from "@/lib/mock";

export default function StoreProductsPage() {
  const { t, locale } = useI18n();
  const [available, setAvailable] = useState<Record<number, boolean>>(
    Object.fromEntries(products.map((p) => [p.id, true])),
  );

  return (
    <>
      <PageHeader
        title={t("nav.products")}
        subtitle="NOMI Sushi"
        action={
          <Button>
            <Plus size={18} /> {t("dash.addProduct")}
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} className="flex items-center gap-4 p-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-surface-2 text-3xl">
              {p.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">{p.name[locale]}</span>
                {p.tag && <Badge tone="brand">{p.tag}</Badge>}
              </div>
              <div className="text-sm font-bold">{formatPrice(p.price)}</div>
              <button
                onClick={() =>
                  setAvailable((s) => ({ ...s, [p.id]: !s[p.id] }))
                }
                className="mt-1 cursor-pointer"
              >
                <Badge tone={available[p.id] ? "success" : "neutral"}>
                  {available[p.id] ? t("common.online") : t("common.offline")}
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
