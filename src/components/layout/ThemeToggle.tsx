'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getStoredTheme, applyTheme } from '@/lib/theme';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--surface)] transition-all"
      aria-label="Тақырыпты ауыстыру"
    >
      {theme === 'dark'
        ? <Sun className="w-4 h-4 text-[var(--muted)]" />
        : <Moon className="w-4 h-4 text-[var(--muted)]" />
      }
    </button>
  );
}
