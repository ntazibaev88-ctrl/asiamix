"use client";

import { useState } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useActiveStore } from "@/lib/activeStore";
import {
  usePromos,
  addPromo,
  removePromo,
  PROMO_GRADIENTS,
} from "@/lib/promotions";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function StorePromosPage() {
  const { t } = useI18n();
  const store = useActiveStore();
  const promos = usePromos(store.slug);

  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🔥");
  const [gradient, setGradient] = useState(PROMO_GRADIENTS[0].value);
  const [image, setImage] = useState("");

  const onFile = (file?: File) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setImage(String(r.result));
    r.readAsDataURL(file);
  };

  const create = () => {
    if (!title.trim()) return;
    addPromo(store.slug, { title: title.trim(), emoji, gradient, image: image || undefined });
    setTitle("");
    setImage("");
    setAdding(false);
  };

  return (
    <>
      <PageHeader
        title={t("nav.promos")}
        subtitle={`${store.emoji} ${store.name}`}
        action={
          <Button onClick={() => setAdding((v) => !v)}>
            <Plus size={18} /> {t("promo.add")}
          </Button>
        }
      />

      {adding && (
        <Card className="mb-5 flex flex-col gap-3 p-4">
          {/* live preview */}
          <div
            className="relative flex h-32 overflow-hidden rounded-3xl p-5 text-white"
            style={{ background: gradient }}
          >
            <h3 className="z-10 max-w-[55%] font-display text-xl font-bold leading-tight">
              {title || t("promo.title")}
            </h3>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="" className="absolute bottom-0 right-0 h-full w-1/2 object-contain object-right-bottom p-2" />
            ) : (
              <span className="absolute -bottom-2 right-1 text-7xl opacity-90">{emoji}</span>
            )}
          </div>

          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("promo.title")} className={inputCls} />
          <div className="flex gap-3">
            <input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🔥" className={`${inputCls} w-20 text-center`} maxLength={2} />
            <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2 px-3 py-2.5 text-sm text-muted">
              <ImagePlus size={16} /> {t("promo.image")}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-muted">{t("promo.color")}</span>
            <div className="flex gap-2">
              {PROMO_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setGradient(g.value)}
                  className={cn(
                    "h-9 w-9 rounded-full border-2",
                    gradient === g.value ? "border-fg" : "border-transparent",
                  )}
                  style={{ background: g.value }}
                  aria-label={g.name}
                />
              ))}
            </div>
          </div>
          <Button onClick={create} disabled={!title.trim()}>
            {t("admin.save")}
          </Button>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {promos.map((p) => (
          <div
            key={p.id}
            className="relative flex h-32 items-center overflow-hidden rounded-3xl p-5 text-white shadow-[var(--shadow)]"
            style={{ background: p.gradient }}
          >
            <h3 className="z-10 max-w-[55%] font-display text-xl font-bold leading-tight">
              {p.title}
            </h3>
            {p.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.image} alt="" className="absolute bottom-0 right-12 h-full w-1/2 object-contain object-right-bottom p-2" />
            ) : (
              <span className="absolute -bottom-2 right-12 text-7xl opacity-90">{p.emoji}</span>
            )}
            <button
              onClick={() => removePromo(store.slug, p.id)}
              aria-label="delete"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/50 cursor-pointer"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
