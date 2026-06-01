'use client'
import Link from 'next/link'
import { ShoppingCart, Sun, Moon, Globe, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import type { Language } from '@/lib/types'
import { clsx } from 'clsx'

interface HeaderProps {
  role?: 'customer' | 'store' | 'courier' | 'admin'
}

const LANGS: { code: Language; label: string }[] = [
  { code: 'kk', label: 'ҚАЗ' },
  { code: 'ru', label: 'РУС' },
  { code: 'en', label: 'ENG' },
]

export function Header({ role = 'customer' }: HeaderProps) {
  const { lang, setLang, t } = useLanguage()
  const { toggleTheme, isDark } = useTheme()
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/95 backdrop-blur-lg border-b border-[var(--color-border)] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-[var(--color-primary)] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <div>
            <span className="text-xl font-black text-[var(--color-text)] tracking-tight">TEZI</span>
            <span className="block text-[10px] text-[var(--color-text-muted)] -mt-1 font-medium tracking-wide">Fast Delivery</span>
          </div>
        </Link>

        {/* Desktop Nav (customer) */}
        {role === 'customer' && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { href: '/', label: t.nav.home },
              { href: '/stores', label: t.nav.stores },
              { href: '/orders', label: t.nav.orders },
            ].map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-tertiary)] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language picker */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-all border border-[var(--color-border)]"
            >
              <Globe size={14} />
              {LANGS.find(l => l.code === lang)?.label}
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg overflow-hidden z-50">
                {LANGS.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={clsx(
                      'w-full text-left px-4 py-2 text-sm font-medium transition-colors',
                      lang === l.code
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface-tertiary)]'
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart (customer only) */}
          {role === 'customer' && (
            <Link href="/cart" className="relative p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-all">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          )}

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" className="px-3 py-1.5 text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
              {t.nav.login}
            </Link>
            <Link href="/register" className="px-3 py-1.5 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors shadow-sm">
              {t.nav.register}
            </Link>
          </div>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] transition-all"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 flex flex-col gap-1">
          {[
            { href: '/', label: t.nav.home },
            { href: '/stores', label: t.nav.stores },
            { href: '/orders', label: t.nav.orders },
            { href: '/profile', label: t.nav.profile },
          ].map(link => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-tertiary)] transition-all"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-1 border-[var(--color-border)]" />
          <Link href="/login" onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-all"
          >
            {t.nav.login}
          </Link>
          <Link href="/register" onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-lg text-sm font-semibold bg-[var(--color-primary)] text-white transition-all"
          >
            {t.nav.register}
          </Link>
        </div>
      )}
    </header>
  )
}
