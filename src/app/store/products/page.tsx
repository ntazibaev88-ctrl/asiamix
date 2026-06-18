"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { useActiveStore } from "@/lib/activeStore";
import { categories, productsForStore } from "@/lib/mock";
import {
  useStoreData,
  addCustomProduct,
  removeCustomProduct,
  toggleAvailability,
} from "@/lib/storeProducts";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

export default function StoreProductsPage() {
  const { t, locale } = useI18n();
  const store = useActiveStore();
  const catalog = productsForStore(store.slug);
  const data = useStoreData(store.slug);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cat, setCat] = useState(categories[1]?.slug ?? "dairy");
  const [unit, setUnit] = useState("шт");
  const [stock, setStock] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const catName = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.slug, c.name[locale]])),
    [locale],
  );

  const create = () => {
    if (!name.trim() || !price) return;
    const emoji = categories.find((c) => c.slug === cat)?.emoji ?? "🛒";
    addCustomProduct(store.slug, {
      name: name.trim(),
      price: Number(price),
      cat,
      unit,
      stock: Number(stock) || 0,
      weightKg: Number(weightKg) || 0.5,
      brand: brand.trim() || undefined,
      description: description.trim() || undefined,
      image: image || undefined,
      emoji,
    });
    setName("");
    setPrice("");
    setStock("");
    setWeightKg("");
    setBrand("");
    setDescription("");
    setImage(undefined);
    setAdding(false);
  };

  return (
    <>
      <PageHeader
        title={t("nav.products")}
        subtitle={`${store.emoji} ${store.name}`}
        action={
          <Button onClick={() => setAdding((v) => !v)}>
            <Plus size={18} /> {t("dash.addProduct")}
          </Button>
        }
      />

      {/* Add form */}
      {adding && (
        <Card className="mb-5 flex flex-col gap-3 p-4">
          <div className="flex gap-3">
            <ImageUploader value={image} onChange={setImage} kind="product" className="w-24 shrink-0" />
            <div className="flex flex-1 flex-col gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("store.productName")} className={inputCls} />
              <div className="flex gap-2">
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="₸" className={inputCls} />
                <input value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="шт / кг / л" className={inputCls} />
              </div>
              <div className="flex gap-2">
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder={t("store.stock")} className={inputCls} />
                <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder={`${t("cart.kg")} (0.5)`} className={inputCls} />
              </div>
            </div>
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={inputCls}>
            {categories
              .filter((c) => c.slug !== "all")
              .map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.emoji} {c.name[locale]}
                </option>
              ))}
          </select>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder={t("store.brand")} className={inputCls} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("store.description")}
            rows={2}
            className={`${inputCls} resize-none`}
          />
          <Button onClick={create} disabled={!name.trim() || !price}>
            {t("admin.save")}
          </Button>
        </Card>
      )}

      {/* Store's own products */}
      {data.custom.length > 0 && (
        <>
          <h2 className="mb-3 font-display text-lg font-bold">{t("store.myProducts")}</h2>
          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.custom.map((p) => (
              <Card key={p.id} className="flex items-center gap-4 p-4">
                <ResponsiveImage
                  src={p.image}
                  kind="product"
                  alt={p.name}
                  fit="contain"
                  rounded="rounded-xl"
                  className="h-14 w-14 shrink-0 bg-white"
                  fallback={<span className="text-3xl">{p.emoji}</span>}
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold">{p.name}</div>
                  {p.brand && <div className="text-xs text-muted">{p.brand}</div>}
                  <div className="text-sm font-bold">
                    {formatPrice(p.price)}{" "}
                    <span className="text-xs font-normal text-faint">
                      / {p.unit} · {catName[p.cat]}
                    </span>
                  </div>
                  {p.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted">{p.description}</p>
                  )}
                  <Badge tone={p.stock > 0 ? "success" : "danger"}>
                    {t("store.stock")}: {p.stock}
                  </Badge>
                </div>
                <button
                  onClick={() => removeCustomProduct(store.slug, p.id)}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2 text-muted hover:text-danger cursor-pointer"
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Base catalog with availability toggle */}
      <h2 className="mb-3 font-display text-lg font-bold">{t("store.baseCatalog")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((p) => {
          const off = data.unavailable.includes(p.id);
          return (
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
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => toggleAvailability(store.slug, p.id)} className="cursor-pointer">
                    <Badge tone={off ? "neutral" : "success"}>
                      {off ? t("shop.closed") : t("shop.open")}
                    </Badge>
                  </button>
                  <span className="text-xs text-faint">
                    {t("store.stock")}: {20 + ((p.id * 13) % 80)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
