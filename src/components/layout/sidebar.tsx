'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Target,
  Repeat2,
  Wallet,
  ImageIcon,
  Newspaper,
  User,
  Settings,
  ShieldCheck,
  LogOut,
  Footprints,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = (t: ReturnType<typeof useT>) => [
  { href: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
  { href: '/diary', icon: BookOpen, label: t.nav.diary },
  { href: '/goals', icon: Target, label: t.nav.goals },
  { href: '/habits', icon: Repeat2, label: t.nav.habits },
  { href: '/finance', icon: Wallet, label: t.nav.finance },
  { href: '/vision-board', icon: ImageIcon, label: t.nav.visionBoard },
  { href: '/articles', icon: Newspaper, label: t.nav.articles },
]

const bottomItems = (t: ReturnType<typeof useT>) => [
  { href: '/profile', icon: User, label: t.nav.profile },
  { href: '/settings', icon: Settings, label: t.nav.settings },
]

interface SidebarProps {
  isPremium?: boolean
  isAdmin?: boolean
}

export function Sidebar({ isPremium = false, isAdmin = false }: SidebarProps) {
  const t = useT()
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 border-r border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 h-16 border-b border-zinc-100 dark:border-zinc-800', collapsed && 'justify-center px-0')}>
        <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
          <Footprints className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Qadam</span>
        )}
        {!collapsed && isPremium && (
          <Badge variant="premium" className="ml-auto text-[10px]">PRO</Badge>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems(t).map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-0 w-10 mx-auto',
                active
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}

        {isAdmin && (
          <Link
            href="/admin"
            title={collapsed ? t.nav.admin : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
              collapsed && 'justify-center px-0 w-10 mx-auto',
              pathname.startsWith('/admin')
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
            )}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t.nav.admin}</span>}
          </Link>
        )}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
        {bottomItems(t).map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed && 'justify-center px-0 w-10 mx-auto',
                active
                  ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}

        <button
          onClick={handleSignOut}
          title={collapsed ? t.nav.signOut : undefined}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors',
            collapsed && 'justify-center px-0 w-10 mx-auto'
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t.nav.signOut}</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 shadow-sm transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  )
}
