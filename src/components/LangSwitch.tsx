"use client";

import { LOCALES, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/cn";

export function LangSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="flex rounded-full border border-border p-0.5">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold tracking-wide transition-colors cursor-pointer",
            locale === code
              ? "bg-brand text-brand-fg"
              : "text-muted hover:text-fg",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
