import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            "flex min-h-[100px] w-full rounded-xl border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm",
            "text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-[var(--primary)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none transition-all duration-150",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
