import { createClient } from '@/lib/supabase/server';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { Footer } from '@/components/layout/Footer';
import { Trophy } from 'lucide-react';

export const metadata = { title: 'Рейтинг' };

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: top } = await supabase.from('profiles').select('id, full_name, email, points').order('points', { ascending: false }).limit(20);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper />
      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <Trophy className="w-12 h-12 text-[var(--warning)] mx-auto mb-3" />
            <h1 className="text-3xl font-bold mb-2">Үздік студенттер</h1>
            <p className="text-[var(--muted)]">Ұпай жиып, рейтингке шығыңыз!</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
            {top?.map((u, idx) => (
              <div key={u.id} className={`flex items-center gap-4 px-6 py-4 border-b border-[var(--border)] last:border-0 ${idx < 3 ? 'bg-[var(--surface)]' : ''}`}>
                <div className="w-10 text-center font-bold text-lg flex-shrink-0">
                  {idx < 3 ? medals[idx] : <span className="text-[var(--faint)] text-sm">#{idx + 1}</span>}
                </div>
                <div className="w-10 h-10 rounded-full bg-[var(--brand-soft)] flex items-center justify-center font-bold text-[var(--brand)] flex-shrink-0">
                  {(u.full_name || u.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{u.full_name || u.email?.split('@')[0]}</div>
                </div>
                <div className="font-bold text-[var(--brand)]">{(u.points || 0).toLocaleString()} ұпай</div>
              </div>
            ))}
            {(!top || top.length === 0) && (
              <div className="text-center py-12 text-[var(--muted)]">Рейтинг бос</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
