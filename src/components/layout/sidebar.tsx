'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Wallet,
  GraduationCap,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Profile } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/diary', label: 'Дневник', icon: BookOpen },
  { href: '/goals', label: 'Цели', icon: Target },
  { href: '/finance', label: 'Финансы', icon: Wallet },
  { href: '/education', label: 'Образование', icon: GraduationCap },
]

interface SidebarProps {
  profile: Profile | null
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Вы вышли из системы')
    router.push('/login')
  }

  return (
    <aside className="flex flex-col w-60 h-full border-r border-[var(--border)] bg-[var(--bg)] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[var(--border)]">
        <div className="w-8 h-8 rounded-[8px] bg-[var(--accent)] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">J</span>
        </div>
        <div>
          <span className="font-semibold text-[var(--text)] text-base tracking-tight">Jinaq</span>
          <p className="text-xs text-[var(--text-tertiary)] leading-none mt-0.5">Personal Growth</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
              )}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-50" />}
            </Link>
          )
        })}

        {profile?.role === 'admin' && (
          <>
            <div className="my-3 border-t border-[var(--border)]" />
            <Link
              href="/admin/dashboard"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150',
                pathname.startsWith('/admin')
                  ? 'bg-[var(--warning-subtle)] text-[var(--warning)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
              )}
            >
              <Shield size={17} className="shrink-0" />
              <span>Администратор</span>
            </Link>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--border)] p-3 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all duration-150',
            pathname === '/settings'
              ? 'bg-[var(--bg-secondary)] text-[var(--text)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
          )}
        >
          <Settings size={17} className="shrink-0" />
          <span>Настройки</span>
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--danger-subtle)] hover:text-[var(--danger)] transition-all duration-150"
        >
          <LogOut size={17} className="shrink-0" />
          <span>Выйти</span>
        </button>

        {/* User info */}
        {profile && (
          <div className="flex items-center gap-2.5 px-3 pt-3 mt-1 border-t border-[var(--border)]">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-semibold">
                {profile.full_name?.[0]?.toUpperCase() || profile.email[0]?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text)] truncate">
                {profile.full_name || 'Пользователь'}
              </p>
              <p className="text-xs text-[var(--text-tertiary)] truncate">{profile.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
