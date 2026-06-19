import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Award, BarChart2, User, ChevronRight, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Кабинет' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('user_id', user.id);
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, courses(title,slug)')
    .eq('user_id', user.id);
  const { data: pendingPayments } = await supabase
    .from('payments')
    .select('*, courses(title)')
    .eq('user_id', user.id)
    .eq('status', 'pending');

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Пайдаланушы';

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-1">Сәлем, {displayName}!</h1>
            <p className="text-[var(--muted)]">Жеке кабинетіңіз</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: BookOpen, label: 'Менің курстарым', value: enrollments?.length || 0, color: 'var(--brand)' },
              { icon: BarChart2, label: 'Аяқталған', value: certificates?.length || 0, color: 'var(--success)' },
              { icon: Award, label: 'Сертификаттар', value: certificates?.length || 0, color: 'var(--warning)' },
              { icon: Clock, label: 'Күтудегі', value: pendingPayments?.length || 0, color: 'var(--muted)' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <stat.icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-5">Менің курстарым</h2>
              {enrollments && enrollments.length > 0 ? (
                <div className="space-y-4">
                  {enrollments.map(
                    (e: {
                      id: string;
                      courses: { slug: string; title: string; lesson_count: number } | null;
                    }) => (
                      <div
                        key={e.id}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-[var(--brand)]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{e.courses?.title}</h3>
                          <p className="text-sm text-[var(--muted)]">{e.courses?.lesson_count} сабақ</p>
                        </div>
                        <Link
                          href={`/courses/${e.courses?.slug}`}
                          className="flex items-center gap-1 text-sm text-[var(--brand)] font-medium hover:underline"
                        >
                          Жалғастыру <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                  <BookOpen className="w-12 h-12 text-[var(--faint)] mx-auto mb-3" />
                  <p className="text-[var(--muted)] mb-4">Сіз әлі ешбір курсқа тіркелмегенсіз</p>
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-medium text-sm hover:bg-[var(--brand-hover)] transition-all"
                  >
                    Курстарды қарау <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Pending payments */}
              {pendingPayments && pendingPayments.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3 text-[var(--warning)]">Тексерілуде</h3>
                  {pendingPayments.map(
                    (p: { id: string; courses: { title: string } | null; amount: number }) => (
                      <div
                        key={p.id}
                        className="rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-4 text-sm"
                      >
                        <span className="font-medium">{p.courses?.title}</span> —{' '}
                        {p.amount.toLocaleString()} ₸ — тексерілуде
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Profile & Certificates */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-[var(--brand)]" />
                  <h2 className="font-bold">Профиль</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[var(--muted)]">Аты: </span>
                    <span className="font-medium">{displayName}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Email: </span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Рөлі: </span>
                    <span className="font-medium capitalize">{profile?.role || 'user'}</span>
                  </div>
                </div>
                <form action="/api/auth/signout" method="POST" className="mt-5">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--muted)] hover:border-[var(--danger-soft)] hover:text-[var(--danger)] transition-all"
                  >
                    Шығу
                  </button>
                </form>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-5 h-5 text-[var(--warning)]" />
                  <h2 className="font-bold">Сертификаттар</h2>
                </div>
                {certificates && certificates.length > 0 ? (
                  <div className="space-y-3">
                    {certificates.map(
                      (c: {
                        id: string;
                        courses: { title: string; slug: string } | null;
                        issued_at: string;
                      }) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-3 text-sm"
                        >
                          <div className="font-medium">{c.courses?.title}</div>
                          <div className="text-[var(--muted)] text-xs mt-0.5">
                            {new Date(c.issued_at).toLocaleDateString('kk-KZ')}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)]">
                    Сертификаттарыңыз жоқ. Курсты аяқтаңыз!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
