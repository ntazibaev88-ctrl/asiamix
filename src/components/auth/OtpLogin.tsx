"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { authInput } from "./AuthShell";

export function OtpLogin({
  channel,
  onSuccess,
}: {
  channel: "client" | "courier";
  onSuccess?: (phone: string) => void;
}) {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, channel }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(t("auth.errPhone"));
        return;
      }
      if (j.demoCode) setDevCode(j.demoCode);
      setStep("code");
    } catch {
      setError(t("auth.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const j = await res.json();
      if (!res.ok) {
        setError(t("auth.errCode"));
        return;
      }
      onSuccess?.(phone);
      router.push(j.redirect || "/");
    } catch {
      setError(t("auth.errNetwork"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {step === "phone" ? (
        <>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              {t("auth.phone")}
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && request()}
              placeholder="+7 (___) ___-__-__"
              inputMode="tel"
              className={authInput}
            />
          </label>
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button className="w-full" disabled={loading || phone.length < 5} onClick={request}>
            {t("auth.sendCode")}
          </Button>
        </>
      ) : (
        <>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              {t("auth.smsCode")}
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="••••••"
              inputMode="numeric"
              className={`${authInput} text-center text-lg tracking-[0.5em]`}
            />
          </label>
          {devCode && (
            <p className="rounded-xl bg-info-soft px-3 py-2 text-xs text-info">
              {t("auth.demoCode")}: <b>{devCode}</b>
            </p>
          )}
          {error && <p className="text-sm font-medium text-danger">{error}</p>}
          <Button className="w-full" disabled={loading || code.length !== 6} onClick={verify}>
            {t("common.signin")}
          </Button>
          <button
            onClick={() => {
              setStep("phone");
              setCode("");
              setError("");
            }}
            className="text-sm font-semibold text-muted hover:text-fg cursor-pointer"
          >
            ← {t("auth.changePhone")}
          </button>
        </>
      )}
    </div>
  );
}
