"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

interface RateCard {
  code: string;
  flag: string;
  name: string;
  rate: number | null;
}

const CURRENCIES: Omit<RateCard, "rate">[] = [
  { code: "usd", flag: "🇺🇸", name: "USD" },
  { code: "eur", flag: "🇪🇺", name: "EUR" },
  { code: "rub", flag: "🇷🇺", name: "RUB" },
  { code: "gbp", flag: "🇬🇧", name: "GBP" },
  { code: "cny", flag: "🇨🇳", name: "CNY" },
  { code: "aed", flag: "🇦🇪", name: "AED" },
];

export function CurrencyRates({ titleLabel }: { titleLabel: string }) {
  const [rates, setRates] = useState<RateCard[]>(
    CURRENCIES.map((c) => ({ ...c, rate: null }))
  );
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
          { next: { revalidate: 3600 } } as RequestInit
        );
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        const usdRates: Record<string, number> = json.usd;

        const kztPerUsd = usdRates["kzt"] ?? 0;

        const updated: RateCard[] = CURRENCIES.map((c) => {
          if (c.code === "usd") {
            return { ...c, rate: kztPerUsd };
          }
          const usdPerUnit = 1 / (usdRates[c.code] ?? 1);
          return { ...c, rate: Math.round(kztPerUsd * usdPerUnit) };
        });

        setRates(updated);
        setUpdatedAt(new Date().toLocaleTimeString("kk-KZ", { hour: "2-digit", minute: "2-digit" }));
      } catch {
        setError(true);
      }
    }
    fetchRates();
  }, []);

  if (error) return null;

  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--border)]">
        <TrendingUp className="h-4 w-4 text-emerald-500" />
        <span className="font-semibold text-sm">{titleLabel}</span>
        {updatedAt && (
          <span className="ml-auto text-xs text-[var(--muted-foreground)]">{updatedAt}</span>
        )}
      </div>
      <div className="flex gap-3 px-4 py-4 overflow-x-auto scrollbar-none">
        {rates.map((c) => (
          <div
            key={c.code}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 min-w-[72px] p-3 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]"
          >
            <span className="text-2xl">{c.flag}</span>
            <span className="text-xs font-semibold text-[var(--foreground)]">{c.name}</span>
            {c.rate !== null ? (
              <span className="text-sm font-bold text-emerald-500">
                {c.code === "rub"
                  ? `${c.rate}`
                  : c.rate.toLocaleString("ru-RU")}
                <span className="text-[10px] font-normal text-[var(--muted-foreground)] ml-0.5">₸</span>
              </span>
            ) : (
              <div className="h-4 w-10 rounded bg-[var(--border)] animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
