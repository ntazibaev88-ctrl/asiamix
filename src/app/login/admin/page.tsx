"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AuthShell, authInput } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";

export default function AdminLogin() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(t("auth.errCreds"));
        return;
      }
      router.push(j.redirect || "/admin");
    } catch {
      setError(t("auth.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={t("role.admin")}
      subtitle={t("auth.adminDesc")}
      icon={<ShieldCheck size={26} />}
    >
      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{t("login.username")}</span>
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoCapitalize="none" className={authInput} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">{t("login.password")}</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} className={authInput} />
        </label>
        {error && <p className="text-sm font-medium text-danger">{error}</p>}
        <Button className="w-full" disabled={loading} onClick={submit}>
          {t("common.signin")}
        </Button>
        <button
          onClick={() => {
            setUsername("admin");
            setPassword("admin123");
            setError("");
          }}
          className="rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted hover:text-fg cursor-pointer"
        >
          demo: <b>admin</b> / <b>admin123</b> — толтыру
        </button>
      </div>
    </AuthShell>
  );
}
