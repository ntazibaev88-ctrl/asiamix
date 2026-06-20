'use client'
import { useContext, useState } from 'react'
import { useT } from '@/lib/i18n'
import { LanguageContext } from '@/contexts/language'
import { ThemeContext } from '@/contexts/theme'
import { TopBar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Globe, Moon, Sun, Monitor, Bell, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import type { Lang, Theme } from '@/types'

export default function SettingsPage() {
  const t = useT()
  const { lang, setLang } = useContext(LanguageContext)
  const { theme, setTheme } = useContext(ThemeContext)
  const [notifEnabled, setNotifEnabled] = useState(true)
  const [pinEnabled, setPinEnabled] = useState(false)

  const langs: { value: Lang; label: string; native: string }[] = [
    { value: 'kk', label: 'Қазақша', native: 'Kazakh' },
    { value: 'ru', label: 'Русский', native: 'Russian' },
    { value: 'en', label: 'English', native: 'English' },
  ]

  const themes: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: t.settings.light },
    { value: 'dark', icon: Moon, label: t.settings.dark },
    { value: 'system', icon: Monitor, label: t.settings.system },
  ]

  return (
    <div>
      <TopBar title={t.settings.title} />

      <div className="mt-6 max-w-2xl space-y-6">
        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              {t.settings.language}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {langs.map(({ value, label, native }) => (
                <button
                  key={value}
                  onClick={() => setLang(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all',
                    lang === value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  )}
                >
                  <span className="text-2xl">
                    {value === 'kk' ? '🇰🇿' : value === 'ru' ? '🇷🇺' : '🇬🇧'}
                  </span>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
                  <span className="text-xs text-zinc-400">{native}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-500" />
              {t.settings.theme}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                    theme === value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  )}
                >
                  <Icon className={cn('w-5 h-5', theme === value ? 'text-amber-500' : 'text-zinc-400')} />
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              {t.settings.notifications}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Күнделікті еске салу</p>
                <p className="text-xs text-zinc-400">Дағдыларыңыз туралы хабарлама</p>
              </div>
              <button
                onClick={() => setNotifEnabled(!notifEnabled)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  notifEnabled ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    notifEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              {t.settings.pinLock}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">PIN қорғанысы</p>
                <p className="text-xs text-zinc-400">
                  {pinEnabled ? 'Күнделіктеріңіз PIN кодпен қорғалған' : 'Күнделіктеріңізге PIN қосыңыз'}
                </p>
              </div>
              <button
                onClick={() => setPinEnabled(!pinEnabled)}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  pinEnabled ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                    pinEnabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Premium */}
        <Card className="border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Qadam Премиум</h3>
                <p className="text-xs text-zinc-500">Алғашқы 2 ай тегін</p>
              </div>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
              Шексіз жазбалар, мақсаттар, дағдылар, PIN қорғанысы және озат аналитика.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                990 ₸ <span className="text-sm font-normal text-zinc-400">/ай</span>
              </span>
              <Link href="/pricing">
                <Button className="shadow-lg shadow-amber-500/20">
                  Жаңарту
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card className="border-red-100 dark:border-red-900/30">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Қауіпті аймақ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.settings.deleteAccount}</p>
                <p className="text-xs text-zinc-400">Барлық деректеріңіз жойылады</p>
              </div>
              <Button variant="danger" size="sm">
                {t.settings.deleteAccount}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
