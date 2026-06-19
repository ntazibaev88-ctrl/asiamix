import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { PaymentSection } from '@/components/payment/PaymentSection';
import { notFound } from 'next/navigation';
import { BookOpen, CheckCircle2, Lock } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('title,description')
    .eq('slug', slug)
    .single();
  return { title: data?.title || 'Курс', description: data?.description };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .single();
  if (!course) notFound();

  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('course_id', course.id)
    .order('order_index');

  let isEnrolled = false;
  if (user) {
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .single();
    isEnrolled = !!enrollment;
  }

  const colors: Record<string, string> = {
    html: '#e34c26',
    css: '#264de4',
    javascript: '#f7df1e',
  };
  const color = colors[slug] || '#3b82f6';

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20">
        {/* Course hero */}
        <div className="bg-[var(--bg-elevated)] border-b border-[var(--border)] py-16 px-4 mb-12">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color }}
              >
                {slug.toUpperCase()} курс
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-[var(--muted)] text-lg leading-relaxed mb-6">{course.description}</p>
              <div className="flex items-center gap-6 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />{course.lesson_count} сабақ
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />Сертификат
                </span>
              </div>
            </div>
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                {isEnrolled ? (
                  <>
                    <div className="text-2xl font-bold mb-2 text-[var(--success)]">Курс ашық ✓</div>
                    <p className="text-[var(--muted)] text-sm mb-6">Мәңгілік қолжетімділік</p>
                    <a
                      href={`/courses/${slug}/lessons`}
                      className="block w-full text-center py-3 px-4 rounded-xl bg-[var(--success)] text-white font-semibold"
                    >
                      Жалғастыру →
                    </a>
                  </>
                ) : (
                  <PaymentSection
                    courseId={course.id}
                    courseTitle={course.title}
                    price={course.price}
                    salePrice={1990}
                    userId={user?.id}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Сабақтар тізімі</h2>
          <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
            {lessons?.map((lesson, idx) => (
              <div
                key={lesson.id}
                className={`flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 ${
                  isEnrolled ? 'hover:bg-[var(--surface-2)] transition-colors' : ''
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: color + '20', color }}
                >
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <span className="font-medium">{lesson.title}</span>
                  {lesson.description && (
                    <p className="text-xs text-[var(--muted)] mt-0.5">{lesson.description}</p>
                  )}
                </div>
                {isEnrolled ? (
                  <CheckCircle2 className="w-5 h-5 text-[var(--success)]" />
                ) : (
                  <Lock className="w-4 h-4 text-[var(--faint)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
