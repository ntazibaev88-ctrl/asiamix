"use client";

import { useState, useMemo } from "react";
import { Calculator } from "lucide-react";

export function FinancialCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [monthly, setMonthly] = useState("20000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  const result = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const M = parseFloat(monthly) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const n = (parseFloat(years) || 0) * 12;
    if (n === 0) return { total: P, interest: 0, invested: P };
    const growthFactor = Math.pow(1 + r, n);
    const fv = r > 0
      ? P * growthFactor + M * ((growthFactor - 1) / r)
      : P + M * n;
    const invested = P + M * n;
    return { total: fv, interest: fv - invested, invested };
  }, [principal, monthly, rate, years]);

  const fmt = (v: number) => Math.round(v).toLocaleString("ru-RU") + " ₸";

  return (
    <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5">
      <h2 className="font-semibold flex items-center gap-2 mb-4">
        <Calculator className="h-4 w-4 text-primary-500" /> Қаржы калькуляторы
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Бастапқы сома (₸)", value: principal, onChange: setPrincipal },
          { label: "Ай сайын (₸)", value: monthly, onChange: setMonthly },
          { label: "Жылдық пайыз (%)", value: rate, onChange: setRate },
          { label: "Жыл саны", value: years, onChange: setYears },
        ].map(({ label, value, onChange }) => (
          <div key={label} className="space-y-1">
            <label className="text-xs text-[var(--muted-foreground)]">{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[var(--secondary)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            />
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 border border-primary-500/20 p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">Жалпы салым</span>
          <span className="font-medium">{fmt(result.invested)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">Пайыз табысы</span>
          <span className="font-semibold text-emerald-500">+{fmt(result.interest)}</span>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <div className="flex justify-between">
          <span className="font-semibold">Жалпы сома</span>
          <span className="font-bold text-lg text-primary-500">{fmt(result.total)}</span>
        </div>
      </div>
    </div>
  );
}
