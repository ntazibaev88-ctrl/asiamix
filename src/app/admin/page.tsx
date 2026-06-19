import { createClient } from '@/lib/supabase/server';
import { Users, BookOpen, CreditCard, TrendingUp, DollarSign, Award } from 'lucide-react';

export const metadata = { title: 'Admin — Басқару тақтасы' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [
    { count: usersCount },
    { count: coursesCount },
    { count: pendingCount },
    { count: approvedCount },
    { count: enrollmentsCount },
    { count: certificatesCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('certificates').select('*', { count: 'exact', head: true }),
  ]);

  const { data: revenueData } = await supabase.from('payments').select('amount').eq('status', 'approved');
  const totalRevenue = revenueData?.reduce((s, p) => s + p.amount, 0) || 0;

  const { data: recentPayments } = await supabase.from('payments')
    .select('*, profiles(full_name, email), courses(title)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = [
    { icon: Users, label: 'Пайдаланушылар', value: usersCount || 0, color: 'var(--brand)' },
    { icon: BookOpen, label: 'Тіркелулер', value: enrollmentsCount || 0, color: 'var(--success)' },
    { icon: CreditCard, label: 'Күтудегі төлемдер', value: pendingCount || 0, color: 'var(--warning)' },
    { icon: TrendingUp, label: 'Расталған төлемдер', value: approvedCount || 0, color: 'var(--success)' },
    { icon: DollarSign, label: 'Жалпы табыс', value: `${totalRevenue.toLocaleString()} ₸`, color: '#a855f7' },
    { icon: Award, label: 'Сертификаттар', value: certificatesCount || 0, color: 'var(--warning)' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Басқару тақтасы</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <s.icon className="w-8 h-8 mb-4" style={{ color: s.color }} />
            <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-sm text-[var(--muted)]">{s.label}</div>
          </div>
        ))}
      </div>

      {recentPayments && recentPayments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Жаңа төлемдер</h2>
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
            {recentPayments.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--border)] last:border-0">
                <div className="flex-1">
                  <div className="font-medium text-sm">{(p.profiles as { full_name?: string })?.full_name || (p.profiles as { email?: string })?.email}</div>
                  <div className="text-xs text-[var(--muted)]">{(p.courses as { title?: string })?.title}</div>
                </div>
                <div className="font-bold text-[var(--warning)]">{p.amount.toLocaleString()} ₸</div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--warning-soft)] text-[var(--warning)]">Күтуде</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
