'use client'
import { TrendingUp, Package, ClipboardList, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS, PRODUCTS } from '@/lib/mock-data'
import type { OrderStatus } from '@/lib/types'
import Link from 'next/link'
import { clsx } from 'clsx'

const storeId = '1'

function statusColor(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (['delivering', 'picked_up'].includes(status)) return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function StoreDashboard() {
  const { t, lang } = useLanguage()

  const storeOrders = MOCK_ORDERS.filter(o => o.storeId === storeId)
  const storeProducts = PRODUCTS.filter(p => p.storeId === storeId)
  const pendingOrders = storeOrders.filter(o => o.status === 'pending' || o.status === 'confirmed')
  const todayRevenue = storeOrders.reduce((s, o) => s + o.total, 0)

  const stats = [
    {
      label: t.store.today_orders,
      value: storeOrders.length,
      icon: ClipboardList,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%',
      up: true,
    },
    {
      label: t.store.today_revenue,
      value: `${todayRevenue.toLocaleString()}₸`,
      icon: TrendingUp,
      color: 'text-[var(--color-primary)]',
      bg: 'bg-green-50 dark:bg-green-900/20',
      change: '+8%',
      up: true,
    },
    {
      label: t.store.total_products,
      value: storeProducts.length,
      icon: Package,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+2',
      up: true,
    },
    {
      label: t.store.pending_orders,
      value: pendingOrders.length,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      change: '-3',
      up: false,
    },
  ]

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">Sakura Sushi</h1>
        <p className="text-[var(--color-text-secondary)] text-sm mt-1">
          {lang === 'kk' ? 'Басқару тақтасы' : lang === 'ru' ? 'Панель управления' : 'Management Panel'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', stat.bg)}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <span className={clsx('text-xs font-semibold flex items-center gap-0.5', stat.up ? 'text-green-600' : 'text-red-500')}>
                {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-black text-[var(--color-text)]">{stat.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-[var(--color-text)]">{t.store.orders}</h2>
          <Link href="/store/orders" className="text-sm text-[var(--color-primary)] font-medium">
            {lang === 'kk' ? 'Барлығы' : lang === 'ru' ? 'Все' : 'All'}
          </Link>
        </div>
        <div className="space-y-3">
          {storeOrders.slice(0, 5).map(order => (
            <div key={order.id} className="flex items-center gap-3 p-3 bg-[var(--color-surface-secondary)] rounded-xl">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-[var(--color-text)] truncate">{order.customerName}</span>
                  <Badge variant={statusColor(order.status)} size="sm">{t.orders.status[order.status]}</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
                </p>
              </div>
              <span className="font-bold text-sm text-[var(--color-text)] shrink-0">{order.total.toLocaleString()}₸</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
