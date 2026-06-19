'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Code2, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) {
      const msg =
        error.message === 'Invalid login credentials'
          ? 'Email немесе құпия сөз дұрыс емес'
          : error.message.includes('fetch') || error.message.includes('network')
          ? 'Желі қатесі. Vercel-да SUPABASE env variables орнатылған ба?'
          : error.message;
      toast.error(msg);
      setLoading(false);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
          <Code2 className="w-8 h-8 text-[var(--brand)]" />
          <span>Code<span className="text-[var(--brand)]">Orda</span></span>
        </Link>
        <h1 className="text-2xl font-bold">Жүйеге кіру</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Аккаунтыңызға кіріңіз</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">Құпия сөз</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--faint)] hover:text-[var(--muted)]"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-[var(--brand)] hover:underline">
            Құпия сөзді ұмыттыңыз ба?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Кіру'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--muted)] mt-6">
        Аккаунтыңыз жоқ па?{' '}
        <Link href="/register" className="text-[var(--brand)] font-medium hover:underline">
          Тіркелу
        </Link>
      </p>
    </div>
  );
}
