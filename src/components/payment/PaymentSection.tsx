'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Upload, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  courseId: string;
  courseTitle: string;
  price: number;
  userId?: string;
}

export function PaymentSection({ courseId, courseTitle, price, userId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'upload' | 'done'>('info');
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      router.push('/login');
      return;
    }
    if (!file) {
      toast.error('Чек скриншотын таңдаңыз');
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${userId}/${courseId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(path, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('payment-screenshots').getPublicUrl(path);

      const { error: payError } = await supabase.from('payments').insert({
        user_id: userId,
        course_id: courseId,
        amount: price,
        screenshot_url: publicUrl,
        note,
        status: 'pending',
      });
      if (payError) throw payError;

      setStep('done');
      toast.success('Өтініміңіз қабылданды!');
    } catch (err: unknown) {
      toast.error('Қате: ' + (err instanceof Error ? err.message : 'Белгісіз қате'));
    }
    setLoading(false);
  }

  if (step === 'done') {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-12 h-12 text-[var(--success)] mx-auto mb-3" />
        <p className="font-semibold mb-1">Өтінім жіберілді!</p>
        <p className="text-sm text-[var(--muted)]">
          Администратор тексеруден кейін курс ашылады. 24 сағат ішінде.
        </p>
      </div>
    );
  }

  if (step === 'info') {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)] p-4">
          <div className="flex items-center gap-2 text-[var(--brand)] font-semibold mb-3">
            <CreditCard className="w-5 h-5" /> Kaspi арқылы төлем
          </div>
          <ol className="space-y-2 text-sm text-[var(--muted)]">
            <li>1. Kaspi Gold картаңызды ашыңыз</li>
            <li>2. Аударым бөліміне өтіңіз</li>
            <li>
              3. <span className="font-mono font-semibold text-[var(--fg)]">+7 700 000 0000</span> нөміріне жіберіңіз
            </li>
            <li>
              4. Сомасы: <span className="font-bold text-[var(--brand)]">{price.toLocaleString()} ₸</span>
            </li>
            <li>
              5. Түсініктемеге: <span className="font-semibold text-[var(--fg)]">{courseTitle}</span>
            </li>
            <li>6. Чек скриншотын сақтаңыз</li>
          </ol>
        </div>
        {userId ? (
          <button
            onClick={() => setStep('upload')}
            className="w-full py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]"
          >
            Чекті жүктеу →
          </button>
        ) : (
          <a
            href="/login"
            className="block w-full text-center py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all"
          >
            Кіріп сатып алу →
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">
          Чек скриншоты *
        </label>
        <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-[var(--brand)] cursor-pointer transition-colors bg-[var(--bg-elevated)]">
          <Upload className="w-8 h-8 text-[var(--faint)] mb-2" />
          <span className="text-sm text-[var(--muted)]">{file ? file.name : 'Сурет таңдаңыз'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>
      </div>
      <div>
        <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">Түсініктеме</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] transition-all resize-none text-sm"
          placeholder="Қосымша ақпарат..."
        />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep('info')}
          className="flex-1 py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] transition-all text-sm"
        >
          Артқа
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Жіберу'}
        </button>
      </div>
    </form>
  );
}
