'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CreditCard, CheckCircle2, LogIn } from 'lucide-react';

interface Props {
  courseId: string;
  courseTitle: string;
  price: number;
  salePrice: number;
  userId?: string;
}

export function PaymentSection({ courseId, courseTitle, price, salePrice, userId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<'info' | 'sent'>('info');

  const kaspiPhone = process.env.NEXT_PUBLIC_KASPI_PHONE || '+7 700 000 0000';
  const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'codeorda_bot';
  const botLink = `https://t.me/${botUsername}?start=pay_${userId}_${courseId}_${salePrice}`;

  if (!userId) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm text-[var(--muted)] text-center">
          Курсты сатып алу үшін алдымен кіріңіз
        </div>
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]"
        >
          <LogIn className="w-4 h-4" /> Кіру / Тіркелу
        </button>
      </div>
    );
  }

  if (step === 'sent') {
    return (
      <div className="text-center py-4 space-y-3">
        <CheckCircle2 className="w-14 h-14 text-[var(--success)] mx-auto" />
        <p className="font-bold text-lg">Өтінім жіберілді!</p>
        <p className="text-sm text-[var(--muted)] leading-relaxed">
          Telegram ботына скриншот жіберіңіз. Администратор 5–30 минут ішінде растайды.
        </p>
        <a
          href={botLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc] text-white text-sm font-medium hover:bg-[#0077bb] transition-all"
        >
          <Send className="w-4 h-4" /> Telegram ботын ашу
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Price */}
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-[var(--brand)]">
          {salePrice.toLocaleString()} ₸
        </div>
        <div className="text-lg text-[var(--faint)] line-through mb-0.5">
          {price.toLocaleString()} ₸
        </div>
      </div>

      {/* Kaspi instructions */}
      <div className="rounded-xl bg-[var(--brand-soft)] border border-[var(--brand)] p-4">
        <div className="flex items-center gap-2 text-[var(--brand)] font-semibold mb-3 text-sm">
          <CreditCard className="w-4 h-4" /> Kaspi арқылы төлем
        </div>
        <ol className="space-y-2 text-sm text-[var(--muted)]">
          <li>1. Kaspi Gold → <b>Аударым</b></li>
          <li>
            2. Нөмір:{' '}
            <span className="font-mono font-bold text-[var(--fg)]">{kaspiPhone}</span>
          </li>
          <li>
            3. Сома:{' '}
            <span className="font-bold text-[var(--brand)]">{salePrice.toLocaleString()} ₸</span>
          </li>
          <li>
            4. Түсініктеме:{' '}
            <span className="font-semibold text-[var(--fg)]">{courseTitle}</span>
          </li>
          <li>5. Чек скриншотын сақтаңыз</li>
        </ol>
      </div>

      {/* Telegram bot button */}
      <a
        href={botLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setStep('sent')}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0077bb] transition-all"
      >
        <Send className="w-4 h-4" />
        Telegram арқылы растату
      </a>

      <p className="text-xs text-[var(--faint)] text-center">
        Төлегеннен кейін Telegram ботына скриншот жіберіңіз — курс автоматты ашылады
      </p>
    </div>
  );
}
