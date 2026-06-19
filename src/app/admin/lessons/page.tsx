import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Admin — Сабақтар' };

export default async function AdminLessonsPage() {
  const supabase = await createClient();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*, courses(title, slug)')
    .order('course_id')
    .order('order_index');

  const colors: Record<string, string> = {
    html: '#e34c26',
    css: '#264de4',
    javascript: '#f7df1e',
  };

  // Group lessons by course
  const grouped: Record<
    string,
    { courseTitle: string; courseSlug: string; lessons: typeof lessons }
  > = {};

  lessons?.forEach((lesson) => {
    const course = lesson.courses as { title: string; slug: string } | null;
    const key = lesson.course_id;
    if (!grouped[key]) {
      grouped[key] = {
        courseTitle: course?.title || 'Unknown',
        courseSlug: course?.slug || '',
        lessons: [],
      };
    }
    grouped[key].lessons!.push(lesson);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Сабақтар</h1>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--muted)]">
          <FileText className="w-4 h-4" />
          Барлығы: <span className="font-bold text-[var(--fg)]">{lessons?.length || 0}</span>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(grouped).map(([courseId, group]) => {
          const color = colors[group.courseSlug] || '#3b82f6';
          return (
            <div key={courseId}>
              <div
                className="flex items-center gap-3 mb-4 text-lg font-bold"
                style={{ color }}
              >
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: color + '20' }}
                >
                  {group.courseSlug === 'html' ? 'H' : group.courseSlug === 'css' ? 'C' : 'JS'}
                </span>
                {group.courseTitle}
                <span className="text-sm font-normal text-[var(--muted)]">
                  ({group.lessons?.length} сабақ)
                </span>
              </div>
              <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
                {group.lessons?.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: color + '20', color }}
                    >
                      {lesson.order_index}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{lesson.title}</div>
                      {lesson.description && (
                        <div className="text-xs text-[var(--muted)] mt-0.5">{lesson.description}</div>
                      )}
                    </div>
                    {lesson.video_url && (
                      <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--brand)] hover:underline text-xs"
                      >
                        Видео
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {(!lessons || lessons.length === 0) && (
        <div className="text-center py-20 text-[var(--muted)]">Сабақтар жоқ</div>
      )}
    </div>
  );
}
