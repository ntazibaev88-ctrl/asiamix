"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bike, ShieldCheck, Store, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { setCookie } from "@/lib/cookies";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitch } from "@/components/LangSwitch";
import type { Role } from "@/lib/types";

const portals: {
  role: Role;
  labelKey: string;
  href: string;
  icon: typeof User;
}[] = [
  { role: "customer", labelKey: "role.customer", href: "/", icon: User },
  { role: "courier", labelKey: "role.courier", href: "/courier", icon: Bike },
  { role: "store_admin", labelKey: "role.store", href: "/store", icon: Store },
  { role: "super_admin", labelKey: "role.admin", href: "/admin", icon: ShieldCheck },
];

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();

  const enter = (role: Role, href: string) => {
    // Demo session: set the cookie the proxy guard checks. Replace with
    // real Supabase auth + a role lookup on the profiles table.
    setCookie("nomi_role", role);
    router.push(href);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4">
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

        <div className="mt-8 grid grid-cols-2 gap-3">
          {portals.map(({ role, labelKey, href, icon: Icon }) => (
            <button
              key={role}
              onClick={() => enter(role, href)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-6 text-center transition-all hover:border-brand hover:shadow-[var(--shadow)] cursor-pointer"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold">{t(labelKey)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface-2 p-3 text-center text-xs text-muted">
          {t("login.demoNote")}
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← {t("role.customer")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
