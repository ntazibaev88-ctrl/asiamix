'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Code2, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Құпия сөздер сәйкес келмейді');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Құпия сөз кемінде 6 символдан тұруы керек');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error, data } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });
    if (error) {
      const msg =
        error.message.includes('fetch') || error.message.includes('network')
          ? 'Желі қатесі. Vercel Settings → Environment Variables → NEXT_PUBLIC_SUPABASE_URL мен ANON_KEY қосыңыз'
          : error.message.includes('already registered')
          ? 'Бұл email тіркелген. Кіру бетіне өтіңіз.'
          : error.message;
      toast.error(msg);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: form.email,
        full_name: form.full_name,
        role: 'user',
      });
    }
    toast.success('Сәтті тіркелдіңіз! Email-ді тексеріңіз.');
    router.push('/dashboard');
    router.refresh();
  }

  const fields = [
    { key: 'full_name', label: 'Атыңыз', icon: User, type: 'text', placeholder: 'Арман Сейткали' },
    { key: 'email', label: 'Email', icon: Mail, type: 'email', placeholder: 'email@example.com' },
  ] as const;

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)]">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-6">
          <Code2 className="w-8 h-8 text-[var(--brand)]" />
          <span>Code<span className="text-[var(--brand)]">Orda</span></span>
        </Link>
        <h1 className="text-2xl font-bold">Тіркелу</h1>
        <p className="text-[var(--muted)] text-sm mt-1">Жаңа аккаунт жасаңыз</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
          <div key={key}>
            <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
              <input
                type={type}
                required
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all"
                placeholder={placeholder}
              />
            </div>
          </div>
        ))}

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
              placeholder="Кемінде 6 символ"
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

        <div>
          <label className="text-sm font-medium text-[var(--muted)] block mb-1.5">Құпия сөзді растаңыз</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--faint)]" />
            <input
              type={showPass ? 'text' : 'password'}
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--fg)] placeholder:text-[var(--faint)] focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)] transition-all"
              placeholder="Қайтадан жазыңыз"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Тіркелу'}
        </button>
      </form>

      <p className="text-center text-sm text-[var(--muted)] mt-6">
        Аккаунтыңыз бар ма?{' '}
        <Link href="/login" className="text-[var(--brand)] font-medium hover:underline">
          Кіру
        </Link>
      </p>
    </div>
  );
}
