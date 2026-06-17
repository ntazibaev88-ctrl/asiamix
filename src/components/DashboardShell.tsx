"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogOut } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { deleteCookie } from "@/lib/cookies";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitch } from "./LangSwitch";

export interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

export function DashboardShell({
  portalKey,
  accent,
  nav,
  children,
}: {
  portalKey: string;
  accent: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

  const signOut = () => {
    deleteCookie("nomi_role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-surface p-4 lg:flex">
        <Link href="/" className="flex items-center gap-2 px-2 py-3">
          <span className="font-display text-2xl font-bold tracking-tight">
            NOMI
          </span>
          <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">
            {t(portalKey)}
          </span>
        </Link>

        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {nav.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-brand text-brand-fg"
                    : "text-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                <Icon size={18} />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-danger-soft hover:text-danger cursor-pointer"
        >
          <LogOut size={18} />
          {t("common.signout")}
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <span className="font-display text-xl font-bold">NOMI</span>
            <span className="rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand">
              {t(portalKey)}
            </span>
          </div>
          <div
            className="hidden h-1.5 w-16 rounded-full lg:block"
            style={{ background: accent }}
            aria-hidden
          />
          <div className="flex items-center gap-2">
            <LangSwitch />
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile nav */}
        <nav className="flex gap-1 overflow-x-auto border-b border-border bg-surface px-3 py-2 lg:hidden">
          {nav.map(({ href, labelKey, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
                  active
                    ? "bg-brand text-brand-fg"
                    : "bg-surface-2 text-muted",
                )}
              >
                <Icon size={14} />
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
