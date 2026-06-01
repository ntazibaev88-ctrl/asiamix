'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Zap, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
}

interface DashboardSidebarProps {
  navItems: NavItem[]
  title: string
}

export function DashboardSidebar({ navItems, title }: DashboardSidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)] min-h-screen sticky top-0">
      <div className="p-5 border-b border-[var(--color-border)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <span className="text-base font-black text-[var(--color-text)]">TEZI</span>
            <span className="block text-[10px] text-[var(--color-text-muted)] -mt-0.5">{title}</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-tertiary)] hover:text-[var(--color-text)]'
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-[var(--color-border)]">
        <Link href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} />
          {t.nav.logout}
        </Link>
      </div>
    </aside>
  )
}
