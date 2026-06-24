"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, PiggyBank } from "lucide-react";

type Mode = "savings" | "loan";

export default function CalculatorPage() {
  const [mode, setMode] = useState<Mode>("savings");

  // Savings state
  const [principal, setPrincipal] = useState("1000000");
  const [monthly, setMonthly] = useState("50000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("5");

  // Loan state
  const [loanAmount, setLoanAmount] = useState("2000000");
  const [loanRate, setLoanRate] = useState("18");
  const [loanYears, setLoanYears] = useState("3");

  const savingsResult = useMemo(() => {
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

  const loanResult = useMemo(() => {
    const P = parseFloat(loanAmount) || 0;
    const r = (parseFloat(loanRate) || 0) / 100 / 12;
    const n = (parseFloat(loanYears) || 0) * 12;
    if (n === 0 || r === 0) return { monthly: P / (n || 1), total: P, overpay: 0 };
    const monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthlyPayment * n;
    return { monthly: monthlyPayment, total, overpay: total - P };
  }, [loanAmount, loanRate, loanYears]);

  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU") + " ₸";

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 p-6 text-white">
        <div className="absolute top-3 right-6 text-6xl opacity-10">🧮</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="h-5 w-5" />
            <h1 className="text-xl font-bold">Қаржылық калькулятор</h1>
          </div>
          <p className="text-sm text-white/70">Жинақ пен кредитті есептеңіз</p>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-2 p-1 rounded-2xl bg-[var(--secondary)] border border-[var(--border)]">
        <button
          onClick={() => setMode("savings")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            mode === "savings"
              ? "bg-[var(--card)] text-primary-600 shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <PiggyBank className="h-4 w-4" /> Жинақ калькуляторы
        </button>
        <button
          onClick={() => setMode("loan")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            mode === "loan"
              ? "bg-[var(--card)] text-primary-600 shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          <TrendingUp className="h-4 w-4" /> Кредит калькуляторы
        </button>
      </div>

      {mode === "savings" ? (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">Бастапқы сома (₸)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">Ай сайынғы аударым (₸)</label>
              <input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">Жылдық пайыз (%)</label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">Мерзім (жыл)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Салынған сома:</span>
              <span className="font-semibold">{fmt(savingsResult.deposited)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Пайыздан кіріс:</span>
              <span className="font-semibold text-emerald-600">+{fmt(savingsResult.interest)}</span>
            </div>
            <div className="flex justify-between border-t border-emerald-200 dark:border-emerald-800 pt-3">
              <span className="font-bold">Жалпы сома:</span>
              <span className="font-bold text-xl text-emerald-600">{fmt(savingsResult.future)}</span>
            </div>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            * Күрделі пайыз (compound interest) формуласы бойынша есептеледі. Нақты нәтиже банктің шарттарына байланысты өзгеруі мүмкін.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-5">
          <div className="grid grid-cols-1 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[var(--muted-foreground)]">Кредит сомасы (₸)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">Жылдық пайыз (%)</label>
                <input
                  type="number"
                  value={loanRate}
                  onChange={(e) => setLoanRate(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">Мерзім (жыл)</label>
                <input
                  type="number"
                  value={loanYears}
                  onChange={(e) => setLoanYears(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--secondary)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Ай сайынғы төлем:</span>
              <span className="font-bold text-lg text-primary-600">{fmt(loanResult.monthly)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Жалпы төлем:</span>
              <span className="font-semibold">{fmt(loanResult.total)}</span>
            </div>
            <div className="flex justify-between border-t border-red-200 dark:border-red-800 pt-3">
              <span className="text-[var(--muted-foreground)]">Артық төлем:</span>
              <span className="font-bold text-red-600">+{fmt(loanResult.overpay)}</span>
            </div>
          </div>

          <p className="text-xs text-[var(--muted-foreground)]">
            * Аннуитеттік төлем схемасы бойынша есептеледі. Нақты шарттар үшін банкке хабарласыңыз.
          </p>
        </div>
      )}
    </div>
  );
}
