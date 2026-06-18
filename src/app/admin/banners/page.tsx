"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  useHomeBanners,
  addBanner,
  removeBanner,
  BANNER_GRADIENTS,
} from "@/lib/homeBanners";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { cn } from "@/lib/cn";

export default function AdminBannersPage() {
  const { t } = useI18n();
  const banners = useHomeBanners();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [emoji, setEmoji] = useState("🎉");
  const [gradient, setGradient] = useState(BANNER_GRADIENTS[0]);
  const [promoCode, setPromoCode] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const add = () => {
    if (!title.trim()) return;
    addBanner({
      title: title.trim(),
      subtitle: subtitle.trim(),
      emoji,
      gradient,
      promoCode: promoCode.trim().toUpperCase() || undefined,
      image,
    });
    setTitle("");
    setSubtitle("");
    setPromoCode("");
    setImage(undefined);
  };

  return (
    <>
      <PageHeader title={t("admin.bannerTitle")} subtitle={t("role.admin")} />

      <Card className="mb-5 flex flex-col gap-3 p-4">
        <div
          className="relative flex h-32 flex-col justify-between overflow-hidden rounded-3xl p-5 text-white"
          style={{ background: gradient }}
        >
          {image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
            </>
          ) : (
            <span className="absolute -bottom-4 -right-2 text-7xl opacity-25">{emoji}</span>
          )}
          <h3 className="z-10 font-display text-xl font-bold">{title || t("promo.title")}</h3>
          <div className="z-10 flex items-end justify-between gap-2">
            <p className="text-sm text-white/85">{subtitle}</p>
            {promoCode && (
              <span className="rounded-full bg-white/20 px-3 py-1 font-mono text-xs font-bold backdrop-blur">
                {promoCode}
              </span>
            )}
          </div>
        </div>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("promo.title")} className={inputCls} />
        <div className="flex gap-3">
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="..." className={inputCls} />
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={2} className={`${inputCls} w-20 text-center`} />
        </div>
        <input
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
          placeholder={t("promo.code")}
          className={`${inputCls} font-mono`}
        />
        <div className="flex gap-2">
          {BANNER_GRADIENTS.map((g) => (
            <button
              key={g}
              onClick={() => setGradient(g)}
              className={cn("h-9 w-9 rounded-full border-2", gradient === g ? "border-fg" : "border-transparent")}
              style={{ background: g }}
              aria-label="color"
            />
          ))}
        </div>
        <ImageUploader value={image} onChange={setImage} kind="banner" label={t("admin.bannerImage")} />
        <Button onClick={add} disabled={!title.trim()}>
          <Plus size={18} /> {t("admin.save")}
        </Button>
      </Card>

      <div className="flex flex-col gap-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="relative flex h-28 items-center overflow-hidden rounded-3xl p-5 text-white"
            style={{ background: b.gradient }}
          >
            {b.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/10" />
              </>
            ) : (
              <span className="absolute -bottom-3 right-10 text-6xl opacity-25">{b.emoji}</span>
            )}
            <div className="z-10">
              <div className="font-display text-lg font-bold">{b.title}</div>
              <div className="text-sm text-white/85">{b.subtitle}</div>
              {b.promoCode && (
                <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 font-mono text-xs font-bold backdrop-blur">
                  {b.promoCode}
                </span>
              )}
            </div>
            <button
              onClick={() => removeBanner(b.id)}
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/30 backdrop-blur hover:bg-black/50 cursor-pointer"
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
  "flex-1 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
