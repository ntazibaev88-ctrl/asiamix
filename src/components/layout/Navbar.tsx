'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';

interface NavbarProps {
  user?: { email?: string } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Code2 className="w-7 h-7 text-[var(--brand)]" />
            <span>Code<span className="text-[var(--brand)]">Orda</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm font-medium">
              Басты бет
            </Link>
            <Link href="/courses" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm font-medium">
              Курстар
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                  Кабинет
                </Link>
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-sm px-4 py-2 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)] transition-all"
                  >
                    Шығу
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
                  Кіру
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-4 py-2 rounded-lg bg-[var(--brand)] text-white font-medium hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)]"
                >
                  Тіркелу
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-[var(--muted)] hover:text-[var(--fg)]"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--fg)] font-medium">
            Басты бет
          </Link>
          <Link href="/courses" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--fg)] font-medium">
            Курстар
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--fg)] font-medium">
                Кабинет
              </Link>
              <Link href="/api/auth/signout" className="text-[var(--danger)] font-medium">
                Шығу
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--fg)] font-medium">
                Кіру
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="inline-block text-center px-4 py-2 rounded-lg bg-[var(--brand)] text-white font-medium"
              >
                Тіркелу
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
