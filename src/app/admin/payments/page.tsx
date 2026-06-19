import { createClient } from '@/lib/supabase/server';
import { PaymentActions } from '@/components/admin/PaymentActions';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Төлемдер' };

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from('payments')
    .select('*, profiles(full_name, email), courses(title)')
    .order('created_at', { ascending: false });

  const statusLabels: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Күтуде', cls: 'bg-[var(--warning-soft)] text-[var(--warning)]' },
    approved: { label: 'Расталды', cls: 'bg-[var(--success-soft)] text-[var(--success)]' },
    rejected: { label: 'Бас тартылды', cls: 'bg-[var(--danger-soft)] text-[var(--danger)]' },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Төлемдер</h1>
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Пайдаланушы</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Курс</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Сома</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Скриншот</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Күні</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Статус</th>
                <th className="text-left px-6 py-4 text-[var(--muted)] font-medium">Әрекет</th>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p) => {
                const s = statusLabels[p.status] || statusLabels.pending;
                const profile = p.profiles as { full_name?: string; email?: string } | null;
                const course = p.courses as { title?: string } | null;
                return (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{profile?.full_name || 'N/A'}</div>
                      <div className="text-[var(--muted)] text-xs">{profile?.email}</div>
                    </td>
                    <td className="px-6 py-4">{course?.title}</td>
                    <td className="px-6 py-4 font-semibold">{p.amount.toLocaleString()} ₸</td>
                    <td className="px-6 py-4">
                      {p.screenshot_url && (
                        <a
                          href={p.screenshot_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--brand)] hover:underline text-xs"
                        >
                          Қарау
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)] text-xs">
                      {new Date(p.created_at).toLocaleDateString('kk-KZ')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <PaymentActions
                        paymentId={p.id}
                        userId={p.user_id}
                        courseId={p.course_id}
                        status={p.status}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!payments || payments.length === 0) && (
          <div className="text-center py-12 text-[var(--muted)]">Төлемдер жоқ</div>
        )}
      </div>
    </div>
  );
}
