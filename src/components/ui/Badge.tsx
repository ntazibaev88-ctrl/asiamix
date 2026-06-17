import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

type Tone = "brand" | "success" | "warning" | "danger" | "info" | "neutral";

const tones: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-2 text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export const statusTone: Record<OrderStatus, Tone> = {
  pending: "warning",
  accepted: "info",
  ready: "info",
  on_the_way: "brand",
  delivered: "success",
  cancelled: "danger",
};
