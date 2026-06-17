"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { signIn } from "@/lib/user";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function SignInPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit = phone.trim().length >= 6 && (mode === "login" || name.trim());

  const submit = () => {
    if (!canSubmit) return;
    signIn(name.trim() || "Клиент", phone.trim());
    router.push("/profile");
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 py-8">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand">
        <User size={30} />
      </div>
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold">{t("auth.welcome")}</h1>
        <p className="mt-1 text-sm text-muted">{t("auth.subtitle")}</p>
      </div>

      {/* Tabs */}
      <div className="flex w-full rounded-full border border-border p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-semibold transition-colors cursor-pointer",
              mode === m ? "bg-brand text-brand-fg" : "text-muted",
            )}
          >
            {t(m === "login" ? "auth.login" : "auth.register")}
          </button>
        ))}
      </div>

      <div className="flex w-full flex-col gap-3">
        {mode === "register" && (
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              {t("auth.name")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            {t("auth.phone")}
          </span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+7 (___) ___-__-__"
            inputMode="tel"
            className={inputCls}
          />
        </label>
        <Button className="w-full" disabled={!canSubmit} onClick={submit}>
          {t(mode === "login" ? "auth.doLogin" : "auth.doRegister")}
        </Button>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-[var(--ring)]";
