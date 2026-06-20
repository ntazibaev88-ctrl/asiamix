'use client'
import Link from 'next/link'
import { useContext, useState } from 'react'
import { LanguageContext } from '@/contexts/language'
import { ThemeContext } from '@/contexts/theme'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { Footprints, Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Lang } from '@/types'

function MarketingNav() {
  const t = useT()
  const { lang, setLang } = useContext(LanguageContext)
  const { isDark, setTheme } = useContext(ThemeContext)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <Footprints className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Qadam</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          {[
            { href: '/#features', label: t.landing.features },
            { href: '/pricing', label: t.landing.pricing },
            { href: '/about', label: 'About' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(['kk', 'ru', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  'px-2.5 py-1 text-xs font-medium uppercase transition-colors',
                  lang === l ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                )}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link href="/login" className="hidden md:block">
            <Button variant="secondary" size="sm">{t.auth.signIn}</Button>
          </Link>
          <Link href="/register" className="hidden md:block">
            <Button size="sm">{t.landing.getStarted}</Button>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-2">
          <Link href="/#features" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400">{t.landing.features}</Link>
          <Link href="/pricing" className="block py-2 text-sm text-zinc-600 dark:text-zinc-400">{t.landing.pricing}</Link>
          <div className="flex gap-2 pt-2">
            <Link href="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full">{t.auth.signIn}</Button></Link>
            <Link href="/register" className="flex-1"><Button size="sm" className="w-full">{t.landing.getStarted}</Button></Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <MarketingNav />
      <main>{children}</main>
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-500 flex items-center justify-center">
              <Footprints className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Qadam</span>
          </div>
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} Qadam. Барлық құқықтар қорғалған.
          </p>
          <div className="flex gap-4 text-sm text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-300">Жеке деректер</Link>
            <Link href="/terms" className="hover:text-zinc-600 dark:hover:text-zinc-300">Шарттар</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
