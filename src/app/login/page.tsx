"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bike, ShieldCheck, Store, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { setCookie } from "@/lib/cookies";
import { setActiveStore } from "@/lib/activeStore";
import { stores } from "@/lib/mock";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitch } from "@/components/LangSwitch";
import type { Role } from "@/lib/types";

const roles: { role: Role; labelKey: string; href: string; icon: typeof User }[] = [
  { role: "customer", labelKey: "role.customer", href: "/", icon: User },
  { role: "courier", labelKey: "role.courier", href: "/courier", icon: Bike },
  { role: "super_admin", labelKey: "role.admin", href: "/admin", icon: ShieldCheck },
];

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();

  const enter = (role: Role, href: string) => {
    setCookie("nomi_role", role);
    router.push(href);
  };

  const enterStore = (slug: string) => {
    setCookie("nomi_role", "store_admin");
    setActiveStore(slug);
    router.push("/store");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 py-10">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LangSwitch />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center font-display text-3xl font-bold tracking-tight"
        >
          NOMI<span className="text-brand">.</span>
        </Link>
        <p className="mt-2 text-center text-sm text-muted">
          {t("login.subtitle")}
        </p>

        {/* Generic roles */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {roles.map(({ role, labelKey, href, icon: Icon }) => (
            <button
              key={role}
              onClick={() => enter(role, href)}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center transition-all hover:border-brand hover:shadow-[var(--shadow)] cursor-pointer"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon size={20} />
              </span>
              <span className="text-xs font-semibold">{t(labelKey)}</span>
            </button>
          ))}
        </div>

        {/* Per-store admin — each store has its own isolated panel */}
        <h2 className="mb-2 mt-7 px-1 text-xs font-bold uppercase tracking-wide text-faint">
          {t("login.storeAdmin")}
        </h2>
        <div className="flex flex-col gap-2">
          {stores.map((s) => (
            <button
              key={s.slug}
              onClick={() => enterStore(s.slug)}
              className="group flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left transition-all hover:border-brand cursor-pointer"
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-2xl"
                style={{ background: s.cover }}
              >
                {s.emoji}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{s.name}</span>
                <span className="block text-xs text-muted">{s.address}</span>
              </span>
              <Store size={18} className="text-faint group-hover:text-brand" />
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface-2 p-3 text-center text-xs text-muted">
          {t("login.demoNote")}
        </div>
      </div>
    </div>
  );
}
