"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  PiggyBank,
  GraduationCap,
  BookOpen,
  Film,
  BookMarked,
  Settings,
  Crown,
  Footprints,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Басты бет", labelRu: "Главная" },
  { href: "/goals", icon: Target, label: "Мақсаттар", labelRu: "Цели" },
  { href: "/savings", icon: PiggyBank, label: "Жинақтар", labelRu: "Сбережения" },
  { href: "/education", icon: GraduationCap, label: "Білім", labelRu: "Образование" },
  { href: "/books", icon: BookOpen, label: "Кітаптар", labelRu: "Книги" },
  { href: "/movies", icon: Film, label: "Фильмдер", labelRu: "Фильмы" },
  { href: "/journal", icon: BookMarked, label: "Күнделік", labelRu: "Дневник" },
];

const bottomItems = [
  { href: "/premium", icon: Crown, label: "Premium", labelRu: "Премиум" },
  { href: "/settings", icon: Settings, label: "Баптаулар", labelRu: "Настройки" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col fixed left-0 top-0 h-full z-40",
        "bg-[var(--card)] border-r border-[var(--border)]",
        "transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-16 px-4 border-b border-[var(--border)]", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center shadow-md shrink-0">
          <Footprints className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold gradient-text">Qadam</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-600")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sidebar-link",
                isActive && "active",
                item.href === "/premium" && !isActive && "text-amber-500 hover:text-amber-600",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", item.href === "/premium" && "text-amber-500")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className={cn(
            "sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Шығу" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Шығу</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-[var(--border)] bg-[var(--card)] shadow-md flex items-center justify-center hover:bg-[var(--secondary)] transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();

  const mobileItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Басты" },
    { href: "/goals", icon: Target, label: "Мақсат" },
    { href: "/savings", icon: PiggyBank, label: "Жинақ" },
    { href: "/education", icon: GraduationCap, label: "Білім" },
    { href: "/profile", icon: User, label: "Профиль" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--card)] border-t border-[var(--border)] px-2 pb-safe">
      <div className="flex items-center justify-around">
        {mobileItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 px-3 rounded-xl transition-colors min-w-0",
                isActive
                  ? "text-primary-600"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
