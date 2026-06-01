'use client'
import { LayoutDashboard, Package, ClipboardList, BarChart3, Settings } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Header } from '@/components/layout/Header'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()

  const navItems = [
    { href: '/store/dashboard', icon: LayoutDashboard, label: t.store.dashboard },
    { href: '/store/products', icon: Package, label: t.store.products },
    { href: '/store/orders', icon: ClipboardList, label: t.store.orders },
    { href: '/store/stats', icon: BarChart3, label: t.store.statistics },
    { href: '/store/settings', icon: Settings, label: t.store.settings },
  ]

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} title={t.store.dashboard} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role="store" />
        <main className="flex-1 p-4 md:p-6 bg-[var(--color-surface-secondary)]">
          {children}
        </main>
      </div>
    </div>
  )
}
