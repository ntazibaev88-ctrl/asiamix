'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Code2, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
          <Code2 className="w-8 h-8 text-[var(--brand)]" />
          <span>Code<span className="text-[var(--brand)]">Orda</span></span>
        </Link>
        <h1 className="text-2xl font-bold">Құпия сөзді қалпына келтіру</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Email-іңізге нұсқаулық жіберіледі</p>
      </div>

      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 className="w-16 h-16 text-[var(--success)] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Email жіберілді!</h2>
          <p className="text-[var(--muted)] text-sm mb-6">
            <strong className="text-[var(--fg)]">{email}</strong> адресіне құпия сөзді қалпына келтіру сілтемесі жіберілді.
            Email-іңізді тексеріңіз.
          </p>
          <Link href="/login" className="text-[var(--brand)] font-medium hover:underline text-sm">
            Кіру бетіне оралу
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Жіберу'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            <Link href="/login" className="text-[var(--brand)] font-medium hover:underline">
              ← Кіру бетіне оралу
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
