"use client";

import Link from "next/link";
import { Bike, ChevronRight, ShieldCheck, Store, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/auth/AuthShell";

const panels = [
  { href: "/login/client", icon: User, title: "auth.client", desc: "auth.clientDesc" },
  { href: "/login/courier", icon: Bike, title: "role.courier", desc: "auth.courierDesc" },
  { href: "/login/store", icon: Store, title: "role.store", desc: "auth.storeDesc" },
  { href: "/login/admin", icon: ShieldCheck, title: "role.admin", desc: "auth.adminDesc" },
];

export default function LoginHub() {
  const { t } = useI18n();
  return (
    <AuthShell title="NOMI" subtitle={t("auth.pickPanel")} back="/">
      <div className="flex flex-col gap-3">
        {panels.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-brand hover:shadow-[var(--shadow)]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon size={20} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-bold">{t(title)}</span>
              <span className="block text-xs text-muted">{t(desc)}</span>
            </span>
            <ChevronRight size={18} className="text-faint" />
          </Link>
        ))}
      </div>
    </AuthShell>
  );
}
