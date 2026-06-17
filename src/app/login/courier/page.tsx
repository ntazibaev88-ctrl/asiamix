"use client";

import { Bike } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpLogin } from "@/components/auth/OtpLogin";

export default function CourierLogin() {
  const { t } = useI18n();
  return (
    <AuthShell
      title={t("role.courier")}
      subtitle={t("auth.courierDesc")}
      icon={<Bike size={26} />}
    >
      <OtpLogin channel="courier" />
    </AuthShell>
  );
}
