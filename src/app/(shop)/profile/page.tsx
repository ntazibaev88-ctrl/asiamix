"use client";

import Link from "next/link";
import {
  Bike,
  ChevronRight,
  Moon,
  ShieldCheck,
  Store,
  Sun,
  User,
} from "lucide-react";
import { useI18n, LOCALES } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">{t("shop.tab.profile")}</h1>

      {/* User card */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
          <User size={26} />
        </div>
        <div>
          <div className="font-display text-lg font-bold">{t("shop.guest")}</div>
          <Link href="/login" className="text-sm font-semibold text-brand">
            {t("common.signin")} →
          </Link>
        </div>
      </div>

      {/* Settings */}
      <section>
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-faint">
          {t("shop.settings")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center justify-between p-4">
            <span className="flex items-center gap-3 text-sm font-semibold">
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
              {t("shop.theme")}
            </span>
            <button
              onClick={toggle}
              className="rounded-full bg-surface-2 px-3 py-1.5 text-sm font-semibold cursor-pointer"
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
          <div className="flex items-center justify-between border-t border-border p-4">
            <span className="text-sm font-semibold">{t("shop.language")}</span>
            <div className="flex rounded-full border border-border p-0.5">
              {LOCALES.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold cursor-pointer",
                    locale === code
                      ? "bg-brand text-brand-fg"
                      : "text-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Staff portals */}
      <section>
        <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-faint">
          {t("shop.portals")}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <PortalRow href="/login" icon={Bike} label={t("role.courier")} />
          <PortalRow href="/login" icon={Store} label={t("role.store")} />
          <PortalRow href="/login" icon={ShieldCheck} label={t("role.admin")} />
        </div>
      </section>
    </div>
  );
}

function PortalRow({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Bike;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 border-b border-border p-4 text-sm font-semibold last:border-0 hover:bg-surface-2"
    >
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon size={18} />
      </span>
      {label}
      <ChevronRight size={18} className="ml-auto text-faint" />
    </Link>
  );
}
