"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AuthShell, authInput } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { setActiveStore } from "@/lib/activeStore";

export default function StoreLogin() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [totp, setTotp] = useState("");
  const [need2fa, setNeed2fa] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/store/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, totp: need2fa ? totp : undefined }),
      });
      const j = await res.json();
      if (j.require2fa) {
        setNeed2fa(true);
        return;
      }
      if (!res.ok) {
        setError(need2fa ? t("auth.err2fa") : t("auth.errCreds"));
        return;
      }
      if (j.storeSlug) setActiveStore(j.storeSlug);
      router.push(j.redirect || "/store");
    } catch {
      setError(t("auth.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCode = async () => {
    try {
      const r = await fetch(`/api/auth/store/totp-demo?username=${encodeURIComponent(username)}`);
      const j = await r.json();
      if (j.code) setTotp(j.code);
    } catch {
      /* ignore */
    }
  };

  return (
    <AuthShell
      title={t("role.store")}
      subtitle={t("auth.storeDesc")}
      icon={<Store size={26} />}
    >
      <div className="flex flex-col gap-3">
        {!need2fa ? (
          <>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{t("login.username")}</span>
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" className={authInput} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{t("login.password")}</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} className={authInput} />
            </label>
          </>
        ) : (
          <>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-muted">{t("auth.twofa")}</span>
              <input
                value={totp}
                onChange={(e) => setTotp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="••••••"
                inputMode="numeric"
                className={`${authInput} text-center text-lg tracking-[0.4em]`}
              />
            </label>
            <p className="text-xs text-muted">{t("auth.twofaHint")}</p>
            <button onClick={fillDemoCode} className="text-left text-xs font-semibold text-info hover:underline cursor-pointer">
              {t("auth.demoFill")}
            </button>
          </>
        )}
        {error && <p className="text-sm font-medium text-danger">{error}</p>}
        <Button className="w-full" disabled={loading} onClick={submit}>
          {t("common.signin")}
        </Button>
        <div className="rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
          demo: <b>altynorda</b> / <b>store-1234</b> · <b>capital</b> / <b>store-1234</b>
        </div>
      </div>
    </AuthShell>
  );
}
