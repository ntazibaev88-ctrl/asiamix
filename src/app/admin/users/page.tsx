import { createClient } from '@/lib/supabase/server';
import { Users } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Пайдаланушылар' };

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  // Get enrollment counts per user
  const { data: enrollmentCounts } = await supabase
    .from('enrollments')
    .select('user_id');

  const countByUser: Record<string, number> = {};
  enrollmentCounts?.forEach((e) => {
    countByUser[e.user_id] = (countByUser[e.user_id] || 0) + 1;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Пайдаланушылар</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)]">
          <Users className="w-4 h-4" />
          Барлығы: <span className="font-bold text-[var(--fg)]">{users?.length || 0}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Пайдаланушы</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Email</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Рөлі</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Курстары</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Тіркелген күні</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] font-semibold text-sm">
                        {(u.full_name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{u.full_name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)]">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
                          : 'bg-[var(--surface-2)] text-[var(--muted)]'
                      }`}
                    >
                      {u.role === 'admin' ? 'Админ' : 'Пайдаланушы'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-[var(--brand)]">
                      {countByUser[u.id] || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--muted)] text-xs">
                    {new Date(u.created_at).toLocaleDateString('kk-KZ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!users || users.length === 0) && (
          <div className="text-center py-12 text-[var(--muted)]">Пайдаланушылар жоқ</div>
        )}
      </div>
    </div>
  );
}
