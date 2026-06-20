"use client";

import { useTheme } from "next-themes";
import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { useEffect, useState } from "react";
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
import type { UserProfile } from "@/types";

interface DashboardHeaderProps {
  profile: UserProfile | null;
}

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

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
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        <button className="relative p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--muted-foreground)]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

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
          <DropdownMenuContent align="end" className="w-52 rounded-xl">
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
              <Link href="/premium">Premium</Link>
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
