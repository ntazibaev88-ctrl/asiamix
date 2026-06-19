import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Code2, Users, BookOpen, CreditCard, LayoutDashboard, FileText } from 'lucide-react';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Басқару тақтасы' },
  { href: '/admin/users', icon: Users, label: 'Пайдаланушылар' },
  { href: '/admin/courses', icon: BookOpen, label: 'Курстар' },
  { href: '/admin/lessons', icon: FileText, label: 'Сабақтар' },
  { href: '/admin/payments', icon: CreditCard, label: 'Төлемдер' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin') redirect('/dashboard');

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      <aside className="w-64 flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] fixed left-0 top-0 bottom-0 flex flex-col">
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="w-7 h-7 text-[var(--brand)]" />
            <span>
              Code<span className="text-[var(--brand)]">Orda</span>
            </span>
          </Link>
          <div className="text-xs text-[var(--brand)] font-semibold mt-1 uppercase tracking-wider">
            Admin Panel
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all"
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[var(--border)]">
          <form action="/api/auth/signout" method="POST">
            <button className="w-full text-left px-4 py-2.5 text-sm text-[var(--muted)] hover:text-[var(--danger)] transition-colors">
              Шығу
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
