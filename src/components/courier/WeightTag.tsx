"use client";

import { Weight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { weightSeverity, type WeightSeverity } from "@/lib/delivery";
import { cn } from "@/lib/cn";

// Courier-facing weight tag — couriers NEVER see price / commission, only the
// total weight and (when heavy) a warning so they can prepare.
export function WeightTag({ kg }: { kg: number }) {
  const { t } = useI18n();
  const sev = weightSeverity(kg);
  const tone: Record<WeightSeverity, string> = {
    normal: "bg-surface-2 text-muted",
    medium: "bg-warning-soft text-warning",
    heavy: "bg-warning-soft text-warning",
    very_heavy: "bg-danger-soft text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        tone[sev],
      )}
    >
      <Weight size={12} /> {kg} {t("cart.kg")}
      {sev !== "normal" && <span className="ml-1">{t(`weight.${sev}`)}</span>}
    </span>
  );
}
