'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { LayoutDashboard, BookOpen, Target, Repeat2, Wallet } from 'lucide-react'

export function MobileNav() {
  const t = useT()
  const pathname = usePathname()

  const items = [
    { href: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { href: '/diary', icon: BookOpen, label: t.nav.diary },
    { href: '/goals', icon: Target, label: t.nav.goals },
    { href: '/habits', icon: Repeat2, label: t.nav.habits },
    { href: '/finance', icon: Wallet, label: t.nav.finance },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 safe-area-pb">
      <div className="flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
                active
                  ? 'text-amber-500'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-full px-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
