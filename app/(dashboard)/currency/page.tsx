"use client";

import { useEffect, useState, useCallback } from "react";
import { TrendingUp, RefreshCw, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const CURRENCIES = [
  { code: "usd", flag: "🇺🇸", name: "АҚШ доллары", short: "USD" },
  { code: "eur", flag: "🇪🇺", name: "Еуро", short: "EUR" },
  { code: "rub", flag: "🇷🇺", name: "Ресей рублі", short: "RUB" },
  { code: "gbp", flag: "🇬🇧", name: "Британ фунты", short: "GBP" },
  { code: "cny", flag: "🇨🇳", name: "Қытай юані", short: "CNY" },
  { code: "aed", flag: "🇦🇪", name: "Дирхам", short: "AED" },
  { code: "kgs", flag: "🇰🇬", name: "Қырғыз сомы", short: "KGS" },
  { code: "try", flag: "🇹🇷", name: "Түрік лирасы", short: "TRY" },
  { code: "chf", flag: "🇨🇭", name: "Швейцар франкі", short: "CHF" },
  { code: "jpy", flag: "🇯🇵", name: "Жапон иенасы", short: "JPY" },
];

interface RateRow {
  code: string;
  flag: string;
  name: string;
  short: string;
  rate: number | null;
}

export default function CurrencyPage() {
  const [rows, setRows] = useState<RateRow[]>(CURRENCIES.map((c) => ({ ...c, rate: null })));
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error();
      const json = await res.json();
      const usdRates: Record<string, number> = json.usd;
      const kztPerUsd = usdRates["kzt"] ?? 0;

      setRows(
        CURRENCIES.map((c) => {
          if (c.code === "usd") return { ...c, rate: kztPerUsd };
          const usdPerUnit = 1 / (usdRates[c.code] ?? 1);
          return { ...c, rate: Math.round(kztPerUsd * usdPerUnit * 100) / 100 };
        })
      );
      setUpdatedAt(new Date().toLocaleTimeString("kk-KZ", { hour: "2-digit", minute: "2-digit" }));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const fmt = (rate: number, code: string) => {
    if (code === "rub" || code === "kgs" || code === "jpy") {
      return rate < 10 ? rate.toFixed(2) : Math.round(rate).toLocaleString("ru-RU");
    }
    return Math.round(rate).toLocaleString("ru-RU");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white">
        <div className="absolute top-3 right-6 text-6xl opacity-10">💱</div>
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-5 w-5" />
              <h1 className="text-xl font-bold">Валюта бағамы</h1>
            </div>
            <p className="text-sm text-white/70">Теңгеге (KZT) қатысты нақты бағам</p>
          </div>
          <button
            onClick={fetchRates}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
        {updatedAt && (
          <p className="text-xs text-white/60 mt-3">Жаңартылды: {updatedAt}</p>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm text-center">
          Бағамды жүктеу мүмкін болмады. Интернет байланысын тексеріңіз.
        </div>
      )}

      {/* Rates table */}
      <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] overflow-hidden">
        <div className="divide-y divide-[var(--border)]">
          {rows.map((row, i) => (
            <div key={row.code} className="flex items-center gap-4 px-5 py-4 hover:bg-[var(--secondary)] transition-colors">
              <span className="text-2xl w-8 text-center">{row.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{row.short}</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{row.name}</p>
              </div>
              <div className="text-right">
                {row.rate !== null ? (
                  <>
                    <p className="font-bold text-base">
                      {fmt(row.rate, row.code)}
                      <span className="text-xs font-normal text-[var(--muted-foreground)] ml-1">₸</span>
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">1 {row.short}</p>
                  </>
                ) : (
                  <div className="space-y-1">
                    <div className="h-4 w-20 rounded bg-[var(--border)] animate-pulse" />
                    <div className="h-3 w-12 rounded bg-[var(--border)] animate-pulse ml-auto" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info card */}
      <div className="p-4 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] text-sm text-[var(--muted-foreground)]">
        <p>💡 Бағамдар <strong className="text-[var(--foreground)]">fawazahmed0 Currency API</strong> арқылы нақты уақытта жаңартылады. Нақты банктік бағам сәл өзгеше болуы мүмкін.</p>
      </div>
    </div>
  );
}
