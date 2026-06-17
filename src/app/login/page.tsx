"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { setCookie } from "@/lib/cookies";
import { setActiveStore } from "@/lib/activeStore";
import { findAccount, homeForRole, accounts } from "@/lib/accounts";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangSwitch } from "@/components/LangSwitch";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    const acc = findAccount(username, password);
    if (!acc) {
      setError(true);
      return;
    }
    setCookie("nomi_role", acc.role);
    if (acc.storeSlug) setActiveStore(acc.storeSlug);
    router.push(homeForRole(acc.role));
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4 py-10">
      <div className="absolute right-4 top-4 flex items-center gap-2">
        <LangSwitch />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="block text-center font-display text-3xl font-bold tracking-tight"
        >
          NOMI<span className="text-brand">.</span>
        </Link>
        <p className="mt-2 text-center text-sm text-muted">{t("login.subtitle")}</p>

        <div className="mt-8 flex flex-col gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              {t("login.username")}
            </span>
            <div className="relative">
              <User
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }}
                autoCapitalize="none"
                className={inputCls}
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              {t("login.password")}
            </span>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className={inputCls}
              />
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
              {t("login.error")}
            </p>
          )}

          <Button className="mt-1 w-full" onClick={submit}>
            {t("common.signin")}
          </Button>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-faint">
            {t("login.demoAccounts")}
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-muted">
            {accounts.map((a) => (
              <button
                key={a.username}
                onClick={() => {
                  setUsername(a.username);
                  setPassword(a.password);
                  setError(false);
                }}
                className="flex items-center justify-between rounded-lg px-2 py-1 text-left hover:bg-surface-2 cursor-pointer"
              >
                <span className="font-semibold text-fg">{a.label}</span>
                <span className="font-mono">
                  {a.username} / {a.password}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm font-semibold text-brand">
            ← {t("role.customer")}
          </Link>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
