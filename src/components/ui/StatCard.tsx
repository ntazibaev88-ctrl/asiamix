import type { LucideIcon } from "lucide-react";
import { Card } from "./Card";
import { cn } from "@/lib/cn";

export function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  deltaPositive = true,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
          <Icon size={20} />
        </span>
        {delta && (
          <span
            className={cn(
              "text-xs font-bold",
              deltaPositive ? "text-success" : "text-danger",
            )}
          >
            {delta}
          </span>
        )}
      </div>
      <div className="mt-4 font-display text-2xl font-bold tracking-tight">
        {value}
      </div>
      <div className="mt-0.5 text-sm text-muted">{label}</div>
    </Card>
  );
}
