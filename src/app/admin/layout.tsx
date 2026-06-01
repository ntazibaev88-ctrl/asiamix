'use client'
import { LayoutDashboard, Users, Store, Package, BarChart3, FileText, Bell } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Header } from '@/components/layout/Header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t.admin.dashboard },
    { href: '/admin/users', icon: Users, label: t.admin.users },
    { href: '/admin/stores', icon: Store, label: t.admin.stores },
    { href: '/admin/orders', icon: Package, label: t.admin.orders },
    { href: '/admin/analytics', icon: BarChart3, label: t.admin.analytics },
    { href: '/admin/logs', icon: FileText, label: t.admin.logs },
    { href: '/admin/notifications', icon: Bell, label: t.admin.notifications },
  ]
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} title={t.admin.dashboard} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role="admin" />
        <main className="flex-1 p-4 md:p-6 bg-[var(--color-surface-secondary)]">{children}</main>
      </div>
    </div>
  )
}
