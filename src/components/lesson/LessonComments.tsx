'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { LessonComment } from '@/lib/types';

interface Props { lessonId: string; userId: string; }

export function LessonComments({ lessonId, userId }: Props) {
  const [comments, setComments] = useState<LessonComment[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    const supabase = createClient();
    const { data } = await supabase.from('lesson_comments').select('*, profiles(full_name, avatar_url)').eq('lesson_id', lessonId).order('created_at', { ascending: false });
    if (data) setComments(data as LessonComment[]);
  }

  useEffect(() => { load(); }, [lessonId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('lesson_comments').insert({ lesson_id: lessonId, user_id: userId, content: text.trim() });
    if (error) { toast.error('Қате'); } else { setText(''); await load(); }
    setLoading(false);
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-5">Пікірлер ({comments.length})</h3>
      <form onSubmit={submit} className="flex gap-3 mb-6">
        <input value={text} onChange={e => setText(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] text-sm transition-all"
          placeholder="Сұрақ немесе пікір жазыңыз..." />
        <button type="submit" disabled={loading || !text.trim()}
          className="px-4 py-3 rounded-xl bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] transition-all disabled:opacity-50 flex-shrink-0">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] font-bold text-xs flex-shrink-0">
              {(c.profiles?.full_name || 'U').charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{c.profiles?.full_name || 'Пайдаланушы'}</span>
                <span className="text-xs text-[var(--faint)]">{new Date(c.created_at).toLocaleDateString('kk-KZ')}</span>
              </div>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-[var(--faint)] text-center py-4">Пікірлер жоқ. Бірінші болыңыз!</p>}
      </div>
    </div>
  );
}
