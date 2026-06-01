'use client'
import Link from 'next/link'
import { User, Globe, Sun, Moon, Bell, MessageSquare, ChevronRight, LogIn, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useTheme } from '@/contexts/ThemeContext'
import type { Language } from '@/lib/types'
import { clsx } from 'clsx'

export default function ProfilePage() {
  const { lang, setLang, t } = useLanguage()
  const { theme, toggleTheme, isDark } = useTheme()

  const LANGS: { code: Language; label: string; native: string }[] = [
    { code: 'kk', label: 'Kazakh', native: 'Қазақша' },
    { code: 'ru', label: 'Russian', native: 'Русский' },
    { code: 'en', label: 'English', native: 'English' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.profile.title}</h1>

      {/* User card (guest) */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center">
          <User size={24} className="text-[var(--color-primary)]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[var(--color-text)]">
            {lang === 'kk' ? 'Қонақ' : lang === 'ru' ? 'Гость' : 'Guest'}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {lang === 'kk' ? 'Толық функцияларға кіру үшін тіркеліңіз' : lang === 'ru' ? 'Войдите для доступа ко всем функциям' : 'Sign in to access all features'}
          </p>
        </div>
        <Link href="/login" className="flex-shrink-0">
          <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
            <LogIn size={16} />
            {t.nav.login}
          </div>
        </Link>
      </div>

      {/* Language */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={16} className="text-[var(--color-primary)]" />
          <h3 className="font-bold text-[var(--color-text)]">{t.profile.language}</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={clsx(
                'py-2 px-3 rounded-xl text-sm font-medium transition-all border',
                lang === l.code
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
              )}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isDark ? <Moon size={16} className="text-[var(--color-primary)]" /> : <Sun size={16} className="text-[var(--color-primary)]" />}
            <h3 className="font-bold text-[var(--color-text)]">{t.profile.theme}</h3>
          </div>
          <button
            onClick={toggleTheme}
            className={clsx(
              'relative w-12 h-6 rounded-full transition-colors duration-300',
              isDark ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
            )}
          >
            <div className={clsx(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300',
              isDark ? 'translate-x-6' : 'translate-x-0.5'
            )} />
          </button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2 ml-6">
          {isDark ? t.profile.dark_mode : t.profile.light_mode}
        </p>
      </div>

      {/* Menu items */}
      {[
        { icon: Bell, label: t.profile.notifications, href: '#' },
        { icon: Shield, label: lang === 'kk' ? 'Қауіпсіздік' : lang === 'ru' ? 'Безопасность' : 'Security', href: '#' },
      ].map(({ icon: Icon, label, href }) => (
        <Link key={label} href={href} className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-3 hover:bg-[var(--color-surface-secondary)] transition-colors">
          <Icon size={18} className="text-[var(--color-text-secondary)]" />
          <span className="flex-1 font-medium text-[var(--color-text)]">{label}</span>
          <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
        </Link>
      ))}

      {/* Telegram support */}
      <a
        href="https://t.me/tezi_support"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-3 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
      >
        <MessageSquare size={18} className="text-blue-500" />
        <span className="flex-1 font-medium text-blue-700 dark:text-blue-400">{t.profile.telegram}</span>
        <ChevronRight size={16} className="text-blue-400" />
      </a>

      {/* Role links */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        {[
          { href: '/store/dashboard', label: lang === 'kk' ? 'Дүкен' : lang === 'ru' ? 'Магазин' : 'Store', icon: '🏪' },
          { href: '/courier/dashboard', label: lang === 'kk' ? 'Курьер' : lang === 'ru' ? 'Курьер' : 'Courier', icon: '🛵' },
          { href: '/admin', label: lang === 'kk' ? 'Админ' : lang === 'ru' ? 'Админ' : 'Admin', icon: '⚙️' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 hover:border-[var(--color-primary)] transition-all group"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
