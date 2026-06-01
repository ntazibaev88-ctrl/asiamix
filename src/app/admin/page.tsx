'use client'
import { Users, Store, Package, TrendingUp, ArrowUpRight, ArrowDownRight, ShoppingBag, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { MOCK_ORDERS, STORES } from '@/lib/mock-data'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'
import type { OrderStatus } from '@/lib/types'
import { clsx } from 'clsx'

function statusColor(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (['delivering', 'picked_up'].includes(status)) return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function AdminDashboard() {
  const { lang, t } = useLanguage()
  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.total, 0)

  const stats = [
    { label: t.admin.total_users, value: '1,248', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', change: '+23', up: true },
    { label: t.admin.total_stores, value: STORES.length, icon: Store, color: 'text-purple-500', bg: 'bg-purple-50', change: '+2', up: true },
    { label: t.admin.total_orders, value: MOCK_ORDERS.length, icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', change: '+18%', up: true },
    { label: t.admin.total_revenue, value: `${totalRevenue.toLocaleString()}₸`, icon: TrendingUp, color: 'text-[var(--color-primary)]', bg: 'bg-green-50', change: '+12%', up: true },
  ]

  const months = [
    { m: '01', v: 60 }, { m: '02', v: 45 }, { m: '03', v: 75 }, { m: '04', v: 55 },
    { m: '05', v: 85 }, { m: '06', v: 100 },
  ]
  const maxV = 100

  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">{t.admin.dashboard}</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">TEZI Admin Panel</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon size={20} className={s.color} />
              </div>
              <span className={clsx('text-xs font-semibold flex items-center gap-0.5', s.up ? 'text-green-600' : 'text-red-500')}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{s.change}
              </span>
            </div>
            <p className="text-2xl font-black text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--color-text)] mb-5">
            {lang === 'kk' ? 'Ай сайынғы табыс' : lang === 'ru' ? 'Выручка по месяцам' : 'Monthly revenue'}
          </h2>
          <div className="flex items-end gap-3 h-32">
            {months.map(m => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[var(--color-surface-secondary)] rounded-lg overflow-hidden" style={{ height: '96px' }}>
                  <div
                    className="w-full bg-gradient-to-t from-[var(--color-primary)] to-green-400 rounded-lg"
                    style={{ height: `${(m.v / maxV) * 100}%`, marginTop: `${100 - (m.v / maxV) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{m.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[var(--color-text)]">{t.admin.orders}</h2>
            <Link href="/admin/orders" className="text-sm text-[var(--color-primary)] font-medium">{t.common.all}</Link>
          </div>
          <div className="space-y-2">
            {MOCK_ORDERS.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--color-surface-secondary)]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--color-text)] truncate">{o.customerName}</span>
                    <Badge variant={statusColor(o.status)} size="sm">{t.orders.status[o.status]}</Badge>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">{o.storeName}</p>
                </div>
                <span className="font-bold text-sm text-[var(--color-text)] shrink-0">{o.total.toLocaleString()}₸</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/admin/users', icon: Users, label: t.admin.users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { href: '/admin/stores', icon: Store, label: t.admin.stores, color: 'text-purple-500', bg: 'bg-purple-50' },
          { href: '/admin/orders', icon: ShoppingBag, label: t.admin.orders, color: 'text-orange-500', bg: 'bg-orange-50' },
          { href: '/admin/logs', icon: Clock, label: t.admin.logs, color: 'text-gray-500', bg: 'bg-gray-100' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all group">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', item.bg)}>
              <item.icon size={20} className={item.color} />
            </div>
            <span className="font-semibold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
