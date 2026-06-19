import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Курстар' };

export default async function CoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at');

  const colors: Record<string, string> = {
    html: '#e34c26',
    css: '#264de4',
    javascript: '#f7df1e',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Курстар</h1>
            <p className="text-[var(--muted)] text-lg">Қазақ тілінде сапалы IT білім</p>
          </div>

          {courses && courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--brand)] transition-all hover:shadow-[0_0_40px_var(--brand-glow)] hover:-translate-y-1 flex flex-col"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-3xl font-bold"
                    style={{
                      backgroundColor: (colors[course.slug] || '#3b82f6') + '20',
                      color: colors[course.slug] || '#3b82f6',
                    }}
                  >
                    {course.slug === 'html' ? 'H' : course.slug === 'css' ? 'C' : 'JS'}
                  </div>
                  <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                  <p className="text-[var(--muted)] text-sm leading-relaxed mb-5 flex-1">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-[var(--muted)] mb-5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />{course.lesson_count} сабақ
                    </span>
                    <span className="font-bold text-xl text-[var(--fg)]">
                      {course.price.toLocaleString()} ₸
                    </span>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="block w-full text-center py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-medium group-hover:bg-[var(--brand-hover)] transition-colors shadow-[0_0_20px_var(--brand-glow)]"
                  >
                    Толығырақ <ChevronRight className="inline w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[var(--muted)]">Курстар жүктелуде...</div>
          )}

          {/* Bundle */}
          <div className="rounded-2xl border border-[var(--brand)] bg-gradient-to-r from-[var(--brand-soft)] to-transparent p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-xs font-semibold text-[var(--brand)] uppercase tracking-wider mb-2">
                Үнемді жинақ
              </div>
              <h3 className="text-2xl font-bold mb-2">Толық пакет</h3>
              <p className="text-[var(--muted)]">HTML + CSS + JavaScript</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-[var(--muted)] line-through mb-1">17 970 ₸</div>
              <div className="text-3xl font-bold text-[var(--brand)] mb-3">14 990 ₸</div>
              <Link
                href="/register"
                className="inline-block px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]"
              >
                Тіркеліп сатып алу
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
