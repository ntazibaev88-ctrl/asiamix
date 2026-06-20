'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Target, Wallet, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/diary', label: 'Дневник', icon: BookOpen },
  { href: '/goals', label: 'Цели', icon: Target },
  { href: '/finance', label: 'Финансы', icon: Wallet },
  { href: '/education', label: 'Статьи', icon: GraduationCap },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-xl">
      <div className="flex">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                active ? 'text-[var(--accent)]' : 'text-[var(--text-tertiary)]'
              )}
            >
              <Icon size={20} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
