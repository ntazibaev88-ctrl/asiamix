"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { CountUp } from "@/components/landing/count-up";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  bg: string;
  prefix?: string;
  suffix?: string;
  trend?: number;
  highlight?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
  prefix = "",
  suffix = "",
  trend,
  highlight,
}: StatCardProps) {
  return (
    <div
      className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
        highlight
          ? "bg-gradient-to-br from-[#6D5EF6] to-violet-700 border-[#6D5EF6]/50 text-white"
          : "bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]/30"
      }`}
    >
      {highlight && (
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            highlight ? "bg-white/20" : bg
          }`}
        >
          <Icon className={`h-5 w-5 ${highlight ? "text-white" : color}`} />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              highlight
                ? "bg-white/15 text-white"
                : trend >= 0
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={`text-2xl font-bold ${highlight ? "text-white" : ""}`}>
        {prefix}
        <CountUp to={value} duration={1400} />
        {suffix}
      </div>
      <div
        className={`text-xs mt-0.5 ${
          highlight ? "text-white/70" : "text-[var(--muted-foreground)]"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
