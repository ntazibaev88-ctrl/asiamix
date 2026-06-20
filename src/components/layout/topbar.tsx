'use client'
import { useContext } from 'react'
import { LanguageContext } from '@/contexts/language'
import { ThemeContext } from '@/contexts/theme'
import { Bell, Moon, Sun, Globe, Menu } from 'lucide-react'
import type { Lang } from '@/types'
import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils'

interface TopBarProps {
  title: string
  userName?: string
  userAvatar?: string
  onMenuOpen?: () => void
}

export function TopBar({ title, userName, userAvatar, onMenuOpen }: TopBarProps) {
  const { lang, setLang } = useContext(LanguageContext)
  const { theme, setTheme, isDark } = useContext(ThemeContext)

  const langs: { value: Lang; label: string }[] = [
    { value: 'kk', label: 'KK' },
    { value: 'ru', label: 'RU' },
    { value: 'en', label: 'EN' },
  ]

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 h-16 px-4 md:px-6 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800">
      <button
        onClick={onMenuOpen}
        className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex-1 min-w-0 truncate">
        {title}
      </h1>

      <div className="flex items-center gap-1 ml-auto">
        {/* Language switcher */}
        <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          {langs.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLang(value)}
              className={cn(
                'px-2.5 py-1 text-xs font-medium transition-colors',
                lang === value
                  ? 'bg-amber-500 text-white'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold ml-1 overflow-hidden">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
          ) : (
            getInitials(userName ?? 'User')
          )}
        </div>
      </div>
    </header>
  )
}
