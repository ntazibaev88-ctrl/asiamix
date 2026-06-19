import { createClient } from '@/lib/supabase/server';
import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Курстар' };

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  // Get enrollment counts per course
  const { data: enrollmentCounts } = await supabase
    .from('enrollments')
    .select('course_id');

  const countByCourse: Record<string, number> = {};
  enrollmentCounts?.forEach((e) => {
    countByCourse[e.course_id] = (countByCourse[e.course_id] || 0) + 1;
  });

  const colors: Record<string, string> = {
    html: '#e34c26',
    css: '#264de4',
    javascript: '#f7df1e',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Курстар</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)]">
          <BookOpen className="w-4 h-4" />
          Барлығы: <span className="font-bold text-[var(--fg)]">{courses?.length || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {courses?.map((course) => {
          const color = colors[course.slug] || '#3b82f6';
          return (
            <div
              key={course.id}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 flex items-center gap-6"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ backgroundColor: color + '20', color }}
              >
                {course.slug === 'html' ? 'H' : course.slug === 'css' ? 'C' : 'JS'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold">{course.title}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      course.is_published
                        ? 'bg-[var(--success-soft)] text-[var(--success)]'
                        : 'bg-[var(--danger-soft)] text-[var(--danger)]'
                    }`}
                  >
                    {course.is_published ? 'Жарияланған' : 'Жарияланбаған'}
                  </span>
                </div>
                <p className="text-[var(--muted)] text-sm line-clamp-1 mb-3">{course.description}</p>
                <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {course.lesson_count} сабақ
                  </span>
                  <span>
                    Оқушылар:{' '}
                    <span className="font-semibold text-[var(--brand)]">
                      {countByCourse[course.id] || 0}
                    </span>
                  </span>
                  <span>
                    Баға:{' '}
                    <span className="font-semibold text-[var(--fg)]">
                      {course.price.toLocaleString()} ₸
                    </span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(!courses || courses.length === 0) && (
        <div className="text-center py-20 text-[var(--muted)]">Курстар жоқ</div>
      )}
    </div>
  );
}
