"use client";

import { useTheme } from "next-themes";
import { Bell, Moon, Sun, Search, BookOpen, Film, BookMarked, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { UserProfile, Notification } from "@/types";
import { useLanguage } from "@/contexts/language";
import type { Lang } from "@/lib/i18n";

const LANGS: { value: Lang; flag: string; label: string }[] = [
  { value: "kk", flag: "🇰🇿", label: "Қаз" },
  { value: "ru", flag: "🇷🇺", label: "Рус" },
  { value: "en", flag: "🇺🇸", label: "Eng" },
];

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

const notifTypeColor: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
};

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();

  const loadNotifications = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    setNotifications((data || []) as Notification[]);
  }, []);

  useEffect(() => {
    setMounted(true);
    loadNotifications();
  }, [loadNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotifOpen = (open: boolean) => {
    setNotifOpen(open);
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 px-4 sm:px-6 bg-[var(--background)]/80 backdrop-blur-sm border-b border-[var(--border)]">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden">
          {/* Mobile: show logo */}
          <Link href="/dashboard" className="text-lg font-bold gradient-text">Qadam</Link>
        </div>
        <div className="hidden lg:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Іздеу..."
            className="pl-9 pr-4 h-9 w-72 rounded-xl border border-[var(--input)] bg-[var(--secondary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Language switcher */}
        <div className="flex items-center gap-0.5 bg-[var(--secondary)] rounded-xl p-1">
          {LANGS.map((l) => (
            <button
              key={l.value}
              onClick={() => setLang(l.value)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                lang === l.value
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-sm"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <span className="sm:hidden">{l.flag}</span>
              <span className="hidden sm:inline">{l.flag} {l.label}</span>
            </button>
          ))}
        </div>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        <DropdownMenu open={notifOpen} onOpenChange={handleNotifOpen}>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
              <span className="font-semibold text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" /> Хабарламалар
                {unreadCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <CheckCheck className="h-3 w-3" /> Барлығын оқыдым
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-[var(--muted-foreground)]">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  Хабарлама жоқ
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b border-[var(--border)] last:border-0 flex gap-3 ${
                      !notif.read ? "bg-[var(--secondary)]" : ""
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notifTypeColor[notif.type] || "bg-blue-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{notif.title}</p>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                        {new Date(notif.created_at).toLocaleDateString("kk-KZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {profile?.plan === "vip" && (
          <Badge variant="premium" className="hidden sm:flex gap-1">
            ✨ VIP
          </Badge>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl hover:bg-[var(--secondary)] p-1.5 transition-colors">
              <Avatar className="h-7 w-7">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(profile?.full_name || profile?.email || "U")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                {profile?.full_name || "Пайдаланушы"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-medium truncate">{profile?.full_name || "Пайдаланушы"}</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Профиль</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Баптаулар</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/premium">Premium ✨</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/books" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Кітаптар
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/movies" className="flex items-center gap-2">
                <Film className="h-4 w-4" /> Фильмдер
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/journal" className="flex items-center gap-2">
                <BookMarked className="h-4 w-4" /> Күнделік
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
              Шығу
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
