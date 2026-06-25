"use client";

import { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/landing/count-up";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  color: string;
  bg: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ icon: Icon, label, value, color, bg, trend, trendUp }: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all duration-200 group">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold">
        <CountUp to={value} duration={1400} />
      </div>
      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{label}</div>
      {trend && (
        <div className={`text-xs mt-1.5 font-medium ${trendUp ? "text-emerald-500" : "text-[var(--muted-foreground)]"}`}>
          {trend}
        </div>
      )}
    </div>
  );
}
