import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Award, BarChart2, User, ChevronRight, Clock, Star, Zap } from 'lucide-react';
import { ProgressRing } from '@/components/ui/ProgressRing';

export const metadata = { title: 'Кабинет' };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: enrollments } = await supabase.from('enrollments').select('*, courses(id, slug, title, lesson_count)').eq('user_id', user.id);
  const { data: certificates } = await supabase.from('certificates').select('*, courses(title, slug)').eq('user_id', user.id);
  const { data: pendingPayments } = await supabase.from('payments').select('*, courses(title)').eq('user_id', user.id).eq('status', 'pending');
  const { data: userAchievements } = await supabase.from('user_achievements').select('*, achievements(*)').eq('user_id', user.id);

  // Progress per enrolled course
  const progressData: Record<string, { completed: number; total: number }> = {};
  for (const e of (enrollments || [])) {
    const course = e.courses as { id: string; lesson_count: number } | null;
    if (!course) continue;
    const { data: lessons } = await supabase.from('lessons').select('id').eq('course_id', course.id);
    const lessonIds = lessons?.map(l => l.id) || [];
    if (lessonIds.length === 0) { progressData[course.id] = { completed: 0, total: course.lesson_count }; continue; }
    const { count } = await supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('lesson_id', lessonIds).eq('completed', true);
    progressData[course.id] = { completed: count || 0, total: course.lesson_count };
  }

  const totalLessons = Object.values(progressData).reduce((s, p) => s + p.total, 0);
  const completedLessons = Object.values(progressData).reduce((s, p) => s + p.completed, 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Пайдаланушы';

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">Сәлем, {displayName}! 👋</h1>
              <p className="text-[var(--muted)]">Жеке кабинетіңіз</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ProgressRing percent={overallPercent} size={80} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold">{overallPercent}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-semibold">{overallPercent}% аяқталды</div>
                <div className="text-xs text-[var(--muted)]">{completedLessons}/{totalLessons} сабақ</div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { icon: BookOpen, label: 'Менің курстарым', value: enrollments?.length || 0, color: 'var(--brand)' },
              { icon: BarChart2, label: 'Аяқталған сабақтар', value: completedLessons, color: 'var(--success)' },
              { icon: Award, label: 'Сертификаттар', value: certificates?.length || 0, color: 'var(--warning)' },
              { icon: Star, label: 'Жетістіктер', value: userAchievements?.length || 0, color: '#a855f7' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <stat.icon className="w-6 h-6 mb-3" style={{ color: stat.color }} />
                <div className="text-2xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* My Courses with progress */}
              <div>
                <h2 className="text-xl font-bold mb-5">Менің курстарым</h2>
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.map((e) => {
                      const course = e.courses as { id: string; slug: string; title: string; lesson_count: number } | null;
                      if (!course) return null;
                      const prog = progressData[course.id] || { completed: 0, total: course.lesson_count };
                      const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
                      return (
                        <div key={e.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--brand-soft)] flex items-center justify-center flex-shrink-0">
                              <BookOpen className="w-6 h-6 text-[var(--brand)]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{course.title}</h3>
                              <p className="text-sm text-[var(--muted)]">{prog.completed}/{prog.total} сабақ</p>
                            </div>
                            <Link href={`/courses/${course.slug}`} className="text-sm text-[var(--brand)] hover:underline flex items-center gap-1">
                              Жалғастыру <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                          <div className="w-full bg-[var(--surface-2)] rounded-full h-2">
                            <div className="bg-[var(--brand)] h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-xs text-[var(--muted)] mt-1 text-right">{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                    <BookOpen className="w-12 h-12 text-[var(--faint)] mx-auto mb-3" />
                    <p className="text-[var(--muted)] mb-4">Ешбір курсқа тіркелмегенсіз</p>
                    <Link href="/courses" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-medium text-sm hover:bg-[var(--brand-hover)] transition-all">
                      Курстарды қарау <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Pending payments */}
              {pendingPayments && pendingPayments.length > 0 && (
                <div className="rounded-2xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-5">
                  <h3 className="font-semibold text-[var(--warning)] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Тексерілуде
                  </h3>
                  {pendingPayments.map((p) => (
                    <div key={p.id} className="text-sm text-[var(--muted)]">
                      {(p.courses as { title?: string })?.title} — {p.amount.toLocaleString()} ₸
                    </div>
                  ))}
                  <p className="text-xs text-[var(--muted)] mt-2">24 сағат ішінде тексеріледі</p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Profile */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <User className="w-5 h-5 text-[var(--brand)]" />
                  <h2 className="font-bold">Профиль</h2>
                </div>
                <div className="flex flex-col items-center mb-5">
                  <div className="w-16 h-16 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-2xl font-bold text-[var(--brand)] mb-3">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="font-semibold">{displayName}</div>
                  <div className="text-sm text-[var(--muted)]">{user.email}</div>
                </div>
                <form action="/api/auth/signout" method="POST">
                  <button className="w-full py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--muted)] hover:border-[var(--danger-soft)] hover:text-[var(--danger)] transition-all">
                    Шығу
                  </button>
                </form>
              </div>

              {/* Achievements */}
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Zap className="w-5 h-5 text-[#a855f7]" />
                  <h2 className="font-bold">Жетістіктер</h2>
                </div>
                {userAchievements && userAchievements.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {userAchievements.map((ua) => {
                      const ach = ua.achievements as { icon: string; title: string } | null;
                      return (
                        <div key={ua.id} className="rounded-xl bg-[var(--surface-2)] p-3 text-center" title={ach?.title}>
                          <div className="text-2xl mb-1">{ach?.icon}</div>
                          <div className="text-xs text-[var(--muted)] line-clamp-1">{ach?.title}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--muted)]">Жетістіктер жоқ. Оқуды бастаңыз!</p>
                )}
              </div>

              {/* Certificates */}
              {certificates && certificates.length > 0 && (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Award className="w-5 h-5 text-[var(--warning)]" />
                    <h2 className="font-bold">Сертификаттар</h2>
                  </div>
                  {certificates.map((c) => (
                    <div key={c.id} className="rounded-xl border border-[var(--warning-soft)] bg-[var(--warning-soft)] p-3 text-sm mb-2">
                      <div className="font-medium">{(c.courses as { title?: string })?.title}</div>
                      <div className="text-xs text-[var(--muted)] mt-0.5">{new Date(c.issued_at).toLocaleDateString('kk-KZ')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
