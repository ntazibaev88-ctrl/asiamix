'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Settings, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Дашборд', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/articles', label: 'Статьи', icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-56 h-full border-r border-[var(--border)] bg-[var(--bg)] shrink-0">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--warning)] flex items-center justify-center">
          <span className="text-white font-bold text-xs">ADM</span>
        </div>
        <div>
          <span className="font-semibold text-[var(--text)] text-sm">Jinaq Admin</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all',
                active
                  ? 'bg-[var(--warning-subtle)] text-[var(--warning)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-[var(--border)] p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)] transition-all"
        >
          <ArrowLeft size={15} />
          Вернуться в приложение
        </Link>
      </div>
    </aside>
  )
}
