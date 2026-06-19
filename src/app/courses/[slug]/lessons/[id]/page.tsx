import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Lock, CheckCircle2, FileText } from 'lucide-react';
import { LessonComments } from '@/components/lesson/LessonComments';
import { LessonCompleteButton } from '@/components/lesson/LessonCompleteButton';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('lessons').select('title').eq('id', id).single();
  return { title: data?.title || 'Сабақ' };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: lesson } = await supabase.from('lessons').select('*, courses(*)').eq('id', id).single();
  if (!lesson) notFound();

  const course = lesson.courses as { id: string; title: string; slug: string };
  const isFree = lesson.order_index <= 3;

  let isEnrolled = false;
  let isCompleted = false;

  if (user) {
    const { data: enrollment } = await supabase.from('enrollments').select('id').eq('user_id', user.id).eq('course_id', course.id).single();
    isEnrolled = !!enrollment;
    const { data: progress } = await supabase.from('lesson_progress').select('completed').eq('user_id', user.id).eq('lesson_id', id).single();
    isCompleted = progress?.completed || false;
  }

  const canAccess = isFree || isEnrolled;
  if (!canAccess && !isFree) redirect(`/courses/${slug}`);

  const { data: allLessons } = await supabase.from('lessons').select('id, title, order_index').eq('course_id', course.id).order('order_index');
  const currentIdx = allLessons?.findIndex(l => l.id === id) ?? 0;
  const prevLesson = allLessons?.[currentIdx - 1];
  const nextLesson = allLessons?.[currentIdx + 1];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <NavbarWrapper />
      <div className="pt-16 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar - lesson list */}
        <aside className="lg:w-72 flex-shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] lg:min-h-screen">
          <div className="p-4 border-b border-[var(--border)]">
            <Link href={`/courses/${slug}`} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              <ChevronLeft className="w-4 h-4" /> {course.title}
            </Link>
          </div>
          <div className="p-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {allLessons?.map((l, idx) => {
              const free = idx < 3;
              const active = l.id === id;
              const accessible = free || isEnrolled;
              return (
                <Link key={l.id} href={accessible ? `/courses/${slug}/lessons/${l.id}` : `/courses/${slug}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all ${active ? 'bg-[var(--brand-soft)] text-[var(--brand)] font-medium' : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--fg)]'}`}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: active ? 'var(--brand)' : 'var(--surface-2)', color: active ? 'white' : 'var(--muted)' }}>
                    {idx + 1}
                  </span>
                  <span className="flex-1 line-clamp-1">{l.title}</span>
                  {!accessible && <Lock className="w-3 h-3 flex-shrink-0 opacity-50" />}
                </Link>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-8">
          {/* Free badge */}
          {isFree && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--success-soft)] text-[var(--success)] text-xs font-semibold mb-4">
              ✓ Тегін сабақ
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{lesson.title}</h1>
          {lesson.description && <p className="text-[var(--muted)] mb-6">{lesson.description}</p>}

          {/* Video */}
          {lesson.video_url ? (
            <div className="rounded-2xl overflow-hidden bg-black aspect-video mb-6 relative">
              <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] aspect-video mb-6 flex items-center justify-center">
              <div className="text-center text-[var(--muted)]">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Видео жақында қосылады</p>
              </div>
            </div>
          )}

          {/* Complete button */}
          {user && isEnrolled && (
            <div className="mb-6">
              <LessonCompleteButton lessonId={id} userId={user.id} completed={isCompleted} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mb-8 py-4 border-t border-b border-[var(--border)]">
            {prevLesson ? (
              <Link href={`/courses/${slug}/lessons/${prevLesson.id}`} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Алдыңғы
              </Link>
            ) : <div />}
            <span className="text-xs text-[var(--faint)]">{currentIdx + 1} / {allLessons?.length}</span>
            {nextLesson ? (
              <Link href={`/courses/${slug}/lessons/${nextLesson.id}`} className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                Келесі <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href={`/courses/${slug}`} className="flex items-center gap-2 text-sm text-[var(--success)] font-medium">
                <CheckCircle2 className="w-4 h-4" /> Аяқтау
              </Link>
            )}
          </div>

          {/* Comments */}
          {user && <LessonComments lessonId={id} userId={user.id} />}
        </main>
      </div>
    </div>
  );
}
