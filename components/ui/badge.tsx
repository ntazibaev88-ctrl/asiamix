import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
        secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
        success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
        warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
        destructive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
        outline: "border border-[var(--border)] text-[var(--foreground)]",
        premium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
