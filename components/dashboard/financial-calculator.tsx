"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

export function FinancialCalculator() {
  const [principal, setPrincipal] = useState("1000000");
  const [monthly, setMonthly] = useState("50000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const M = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (n === 0) return { future: P, interest: 0, deposited: P };
    const growth = Math.pow(1 + r, n);
    const fv = r === 0 ? P + M * n : P * growth + (M * (growth - 1)) / r;
    const deposited = P + M * n;
    return { future: fv, interest: fv - deposited, deposited };
  }, [principal, monthly, rate, years]);

  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU") + " ₸";

  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary-600" />
        <h2 className="font-semibold">Жинақ калькуляторы</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-[var(--muted-foreground)]">Бастапқы сома (₸)</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[var(--muted-foreground)]">Ай сайынғы (₸)</label>
          <input
            type="number"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[var(--muted-foreground)]">Жылдық пайыз (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-[var(--muted-foreground)]">Мерзім (жыл)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="rounded-xl bg-primary-50 dark:bg-primary-950/30 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">Салынған сома:</span>
          <span className="font-medium">{fmt(result.deposited)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">Пайыздан кіріс:</span>
          <span className="font-medium text-emerald-600">+{fmt(result.interest)}</span>
        </div>
        <div className="flex justify-between border-t border-[var(--border)] pt-2">
          <span className="font-semibold">Жалпы сома:</span>
          <span className="font-bold text-primary-600">{fmt(result.future)}</span>
        </div>
      </div>
    </div>
  );
}
