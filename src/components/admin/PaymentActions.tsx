'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Props {
  paymentId: string;
  userId: string;
  courseId: string;
  status: string;
}

export function PaymentActions({ paymentId, userId, courseId, status }: Props) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const router = useRouter();

  async function approve() {
    setLoading('approve');
    const supabase = createClient();
    await supabase.from('payments').update({ status: 'approved' }).eq('id', paymentId);
    await supabase.from('enrollments').upsert(
      { user_id: userId, course_id: courseId },
      { onConflict: 'user_id,course_id' }
    );
    toast.success('Растандыңыз! Курс ашылды.');
    router.refresh();
    setLoading(null);
  }

  async function reject() {
    setLoading('reject');
    const supabase = createClient();
    await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId);
    toast.error('Төлем бас тартылды.');
    router.refresh();
    setLoading(null);
  }

  if (status !== 'pending') return null;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={approve}
        disabled={!!loading}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--success-soft)] text-[var(--success)] text-xs font-medium hover:bg-[var(--success)] hover:text-white transition-all disabled:opacity-50"
      >
        {loading === 'approve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
        Растау
      </button>
      <button
        onClick={reject}
        disabled={!!loading}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--danger-soft)] text-[var(--danger)] text-xs font-medium hover:bg-[var(--danger)] hover:text-white transition-all disabled:opacity-50"
      >
        {loading === 'reject' ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
        Бас тарту
      </button>
    </div>
  );
}
