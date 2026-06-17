"use client";

import { User } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpLogin } from "@/components/auth/OtpLogin";
import { signIn } from "@/lib/user";

export default function ClientLogin() {
  const { t } = useI18n();
  return (
    <AuthShell
      title={t("auth.client")}
      subtitle={t("auth.clientDesc")}
      icon={<User size={26} />}
    >
      <OtpLogin channel="client" onSuccess={(phone) => signIn("Клиент", phone)} />
    </AuthShell>
  );
}
