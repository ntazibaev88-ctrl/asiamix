"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Film,
  GraduationCap,
  CreditCard,
  Footprints,
  Bell,
  Ban,
  Cpu,
  Brain,
  Menu,
  X,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Аналитика", exact: true },
  { href: "/admin/site", icon: Settings2, label: "Сайт баптаулары" },
  { href: "/admin/users", icon: Users, label: "Пайдаланушылар" },
  { href: "/admin/payments", icon: CreditCard, label: "Төлемдер" },
  { href: "/admin/content", icon: GraduationCap, label: "Мақалалар" },
  { href: "/admin/books", icon: BookOpen, label: "Кітаптар" },
  { href: "/admin/movies", icon: Film, label: "Фильмдер" },
  { href: "/admin/quiz", icon: Brain, label: "Қаржы ойындары" },
  { href: "/admin/notifications", icon: Bell, label: "Хабарландыру" },
  { href: "/admin/blacklist", icon: Ban, label: "Қара тізім" },
  { href: "/admin/ai", icon: Cpu, label: "AI басқару" },
];

function NavLink({
  href,
  icon: Icon,
  label,
  exact,
  onClick,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "sidebar-link",
        active && "active"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
    </Link>
  );
}

export function AdminSidebar({ profileName }: { profileName: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = (onClick?: () => void) =>
    adminLinks.map((link) => (
      <NavLink key={link.href} {...link} onClick={onClick} />
    ));

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[var(--card)] border-b border-[var(--border)] flex items-center gap-3 px-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl hover:bg-[var(--secondary)] transition-colors text-[var(--foreground)]"
          aria-label="Мәзірді ашу"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center">
            <Footprints className="h-3 w-3 text-white" />
          </div>
          <span className="font-bold text-sm gradient-text">Qadam Admin</span>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-[var(--card)] border-r border-[var(--border)] flex-col fixed h-full z-40">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border)] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center shadow-md shadow-[#6D5EF6]/30">
            <Footprints className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">Qadam</div>
            <div className="text-xs text-[var(--muted-foreground)]">Әкімші панелі</div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {links()}
        </nav>
        <div className="p-3 border-t border-[var(--border)] space-y-1">
          <div className="px-3 py-2 text-xs text-[var(--muted-foreground)] truncate">{profileName}</div>
          <Link href="/dashboard" className="sidebar-link">
            <LayoutDashboard className="h-5 w-5" />
            Пайдаланушы панелі
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-72 bg-[var(--card)] flex flex-col h-full shadow-2xl overflow-y-auto"
            >
              <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border)] shrink-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center">
                  <Footprints className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold gradient-text">Qadam</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Әкімші панелі</div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-[var(--secondary)] transition-colors"
                  aria-label="Жабу"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-0.5">
                {links(() => setMobileOpen(false))}
              </nav>
              <div className="p-3 border-t border-[var(--border)] space-y-1">
                <div className="px-3 py-2 text-xs text-[var(--muted-foreground)] truncate">{profileName}</div>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="sidebar-link">
                  <LayoutDashboard className="h-5 w-5" />
                  Пайдаланушы панелі
                </Link>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
