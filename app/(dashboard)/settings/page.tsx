"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Monitor, Globe, Bell, Shield, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm("Аккаунтты жоюға сенімдісіз бе? Бұл әрекетті болдырмау мүмкін емес.");
    if (!confirm1) return;
    const confirm2 = window.prompt('Растау үшін "ЖОЮ" деп жазыңыз:');
    if (confirm2 !== "ЖОЮ") return;

    toast.info("Байланысыңыз", "Аккаунтты жою үшін support@qadam.kz-ке хабарласыңыз");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Баптаулар</h1>

      {/* Appearance */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center">
            <Sun className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold">Сыртқы вид</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Тема мен тіл баптаулары</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Тема</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light", icon: Sun, label: "Жарық" },
                { value: "dark", icon: Moon, label: "Күңгірт" },
                { value: "system", icon: Monitor, label: "Жүйе" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                    mounted && theme === t.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600"
                      : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--muted-foreground)]"
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
            <Globe className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold">Тіл</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Интерфейс тілін таңдаңыз</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: "kk", label: "Қазақша", flag: "🇰🇿" },
            { value: "ru", label: "Русский", flag: "🇷🇺" },
            { value: "en", label: "English", flag: "🇺🇸" },
          ].map((l) => (
            <button
              key={l.value}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                l.value === "kk"
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
              }`}
            >
              <span>{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
            <Bell className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold">Хабарландырулар</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Қай хабарларды алғыңыз келеді?</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Мақсат мерзімі жақындағанда", checked: true },
            { label: "VIP мерзімі аяқталғанда", checked: true },
            { label: "Жаңа мақалалар", checked: false },
            { label: "Мотивациялық еске салулар", checked: true },
          ].map((n) => (
            <label key={n.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">{n.label}</span>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  n.checked ? "bg-primary-600" : "bg-[var(--secondary)]"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    n.checked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold">Қауіпсіздік</h3>
          </div>
        </div>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <a href="/forgot-password">Құпия сөзді өзгерту</a>
          </Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border-2 border-red-200 dark:border-red-900">
        <h3 className="font-semibold text-red-600 mb-4">Қауіпті аймақ</h3>
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            loading={loading}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Шығу
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleDeleteAccount}
          >
            Аккаунтты жою
          </Button>
        </div>
      </div>
    </div>
  );
}
