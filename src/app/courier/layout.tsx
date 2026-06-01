'use client'
import { LayoutDashboard, Package, Wallet, History } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { Header } from '@/components/layout/Header'

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage()
  const navItems = [
    { href: '/courier/dashboard', icon: LayoutDashboard, label: t.courier.dashboard },
    { href: '/courier/deliveries', icon: Package, label: t.courier.deliveries },
    { href: '/courier/earnings', icon: Wallet, label: t.courier.earnings },
    { href: '/courier/history', icon: History, label: t.courier.delivery_history },
  ]
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar navItems={navItems} title={t.courier.dashboard} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header role="courier" />
        <main className="flex-1 p-4 md:p-6 bg-[var(--color-surface-secondary)]">{children}</main>
      </div>
    </div>
  )
}
