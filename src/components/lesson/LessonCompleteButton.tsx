'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props { lessonId: string; userId: string; completed: boolean; }

export function LessonCompleteButton({ lessonId, userId, completed: initial }: Props) {
  const [completed, setCompleted] = useState(initial);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const next = !completed;
    await supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, completed: next }, { onConflict: 'user_id,lesson_id' });
    setCompleted(next);
    if (next) toast.success('Сабақ аяқталды! ✓');
    router.refresh();
    setLoading(false);
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${completed ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success)]' : 'bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] shadow-[0_0_20px_var(--brand-glow)]'} disabled:opacity-50`}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
      {completed ? 'Аяқталды ✓' : 'Аяқталды деп белгілеу'}
    </button>
  );
}
