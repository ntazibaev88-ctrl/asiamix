"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { stores } from "@/lib/mock";
import { StoreCard } from "@/components/shop/StoreCard";

export default function StoresPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.address.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("shop.stores")}</h1>
      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
        />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("shop.searchStores")}
          className="w-full rounded-full border border-border bg-surface py-3 pl-10 pr-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((s) => (
          <StoreCard key={s.slug} store={s} />
        ))}
      </div>
    </div>
  );
}
