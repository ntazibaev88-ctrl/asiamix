import { createClient } from '@/lib/supabase/server';
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Басқару тақтасы' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: coursesCount },
    { count: pendingCount },
    { count: approvedCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
  ]);

  const stats = [
    { icon: Users, label: 'Пайдаланушылар', value: usersCount || 0, color: 'var(--brand)' },
    { icon: BookOpen, label: 'Курстар', value: coursesCount || 0, color: 'var(--success)' },
    { icon: CreditCard, label: 'Күтудегі төлемдер', value: pendingCount || 0, color: 'var(--warning)' },
    { icon: TrendingUp, label: 'Расталған төлемдер', value: approvedCount || 0, color: 'var(--success)' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Басқару тақтасы</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <s.icon className="w-8 h-8 mb-4" style={{ color: s.color }} />
            <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>
              {s.value}
            </div>
            <div className="text-sm text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
