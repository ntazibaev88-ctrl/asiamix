"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LangSwitch } from "@/components/LangSwitch";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AuthShell({
  title,
  subtitle,
  icon,
  children,
  back = "/login",
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  back?: string;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 py-10">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LangSwitch />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Link
          href={back}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-fg"
        >
          <ArrowLeft size={16} /> NOMI
        </Link>

        {icon && (
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
            {icon}
          </div>
        )}
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}

        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}

export const authInput =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
