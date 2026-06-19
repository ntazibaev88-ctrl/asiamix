'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState<Array<{ id: string; slug: string; title: string; description: string; price: number }>>([]);
  const [lessons, setLessons] = useState<Array<{ id: string; title: string; course_id: string; courses: { slug: string; title: string } | null }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setCourses([]); setLessons([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      const supabase = createClient();
      const q = query.toLowerCase();
      const [{ data: c }, { data: l }] = await Promise.all([
        supabase.from('courses').select('id, slug, title, description, price').ilike('title', `%${q}%`),
        supabase.from('lessons').select('id, title, course_id, courses(slug, title)').ilike('title', `%${q}%`).limit(10),
      ]);
      setCourses(c || []);
      setLessons((l || []) as unknown as typeof lessons);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Іздеу</h1>
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--faint)]" />
            <input value={query} onChange={e => setQuery(e.target.value)} autoFocus
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] text-lg transition-all"
              placeholder="Курс немесе сабақ іздеңіз..." />
          </div>

          {loading && <div className="text-center text-[var(--muted)] py-4">Іздеуде...</div>}

          {courses.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Курстар</h2>
              <div className="space-y-3">
                {courses.map(c => (
                  <Link key={c.id} href={`/courses/${c.slug}`} className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] transition-all">
                    <div className="w-10 h-10 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-[var(--brand)]" />
                    </div>
                    <div>
                      <div className="font-medium">{c.title}</div>
                      <div className="text-sm text-[var(--muted)]">{c.price.toLocaleString()} ₸</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {lessons.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-[var(--muted)] uppercase tracking-wider mb-3">Сабақтар</h2>
              <div className="space-y-2">
                {lessons.map(l => (
                  <Link key={l.id} href={`/courses/${l.courses?.slug}/lessons/${l.id}`} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--brand)] transition-all text-sm">
                    <span className="text-[var(--muted)]">{l.courses?.title} →</span>
                    <span className="font-medium">{l.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && query && courses.length === 0 && lessons.length === 0 && (
            <div className="text-center py-12 text-[var(--muted)]">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>&ldquo;{query}&rdquo; бойынша ештеңе табылмады</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
