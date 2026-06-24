import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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
} from "lucide-react";

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Аналитика" },
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const ADMIN_EMAIL = "ntazibaev88@gmail.com";
  if (user.email !== ADMIN_EMAIL) redirect("/dashboard");

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] flex flex-col fixed h-full">
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
            <Footprints className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">Qadam</div>
            <div className="text-xs text-[var(--muted-foreground)]">Әкімші панелі</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="sidebar-link"
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-[var(--border)] space-y-1">
          <div className="px-3 py-2 text-xs text-[var(--muted-foreground)]">
            {profile?.full_name || profile?.email}
          </div>
          <Link href="/dashboard" className="sidebar-link">
            <LayoutDashboard className="h-5 w-5" />
            Пайдаланушы панелі
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="pl-64 flex-1">
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
