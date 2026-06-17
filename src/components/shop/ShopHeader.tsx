"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

export function ShopHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 px-4">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-brand"
        >
          NOMI
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/stores"
            aria-label={t("common.search")}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:text-fg"
          >
            <Search size={17} />
          </Link>
          <LangSwitch />
          <button
            aria-label="Notifications"
            className="relative grid h-9 w-9 place-items-center rounded-full border border-border text-muted hover:text-fg cursor-pointer"
          >
            <Bell size={17} />
            <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-brand-fg">
              3
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
