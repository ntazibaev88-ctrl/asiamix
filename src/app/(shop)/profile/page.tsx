"use client";

import Link from "next/link";
import {
  Bike,
  ChevronRight,
  Heart,
  LogOut,
  Moon,
  Package,
  ShieldCheck,
  Star,
  Store,
  Sun,
  User,
} from "lucide-react";
import { useI18n, LOCALES } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useUser, signOut } from "@/lib/user";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const { theme, toggle } = useTheme();
  const user = useUser();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold">{t("shop.tab.profile")}</h1>

      {/* User card */}
      {user ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="flex items-center gap-3 p-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-fg font-display text-xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg font-bold">
                {user.name}
              </div>
              <div className="text-sm text-muted">{user.phone}</div>
            </div>
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand">
              {user.level}
            </span>
          </div>
          <div className="grid grid-cols-3 border-t border-border text-center">
            <Loyalty
              icon={<Star size={15} className="text-warning" fill="currentColor" />}
              value={user.rating.toFixed(1)}
              label={t("profile.rating")}
            />
            <div className="border-x border-border">
              <Loyalty value={String(user.points)} label={t("profile.points")} />
            </div>
            <Loyalty
              value={formatPrice(user.cashback)}
              label={t("profile.cashback")}
            />
          </div>
          <button
            onClick={() => {
              fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
              signOut();
            }}
            className="flex w-full items-center justify-center gap-2 border-t border-border p-3 text-sm font-semibold text-muted hover:text-danger cursor-pointer"
          >
            <LogOut size={16} /> {t("common.signout")}
          </button>
        </div>
      ) : (
        <Link
          href="/login/client"
          className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-brand"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
            <User size={26} />
          </div>
          <div>
            <div className="font-display text-lg font-bold">{t("shop.guest")}</div>
            <span className="text-sm font-semibold text-brand">
              {t("common.signin")} →
            </span>
          </div>
        </Link>
      )}

      {/* Quick links: Favorites & Orders (moved from the bottom nav) */}
      <section>
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <PortalRow href="/favorites" icon={Heart} label={t("shop.tab.favorites")} />
          <PortalRow href="/orders" icon={Package} label={t("shop.tab.orders")} />
        </div>
      </section>

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
                    locale === code ? "bg-brand text-brand-fg" : "text-muted",
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

function Loyalty({
  icon,
  value,
  label,
}: {
  icon?: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-center gap-1 font-display text-base font-bold">
        {icon}
        {value}
      </div>
      <div className="text-[11px] text-faint">{label}</div>
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
