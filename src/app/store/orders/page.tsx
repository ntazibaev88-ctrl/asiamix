'use client'
import { useState } from 'react'
import { CheckCircle, XCircle, Package } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { Order, OrderStatus } from '@/lib/types'
import { toast } from 'sonner'
import { clsx } from 'clsx'
import { formatDistanceToNow } from 'date-fns'

const storeId = '1'

type FilterType = 'all' | 'pending' | 'active' | 'completed'

function statusColor(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (['delivering', 'picked_up'].includes(status)) return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function StoreOrdersPage() {
  const { t, lang } = useLanguage()
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS.filter(o => o.storeId === storeId))
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = orders.filter(o => {
    if (filter === 'pending') return o.status === 'pending'
    if (filter === 'active') return ['confirmed', 'preparing', 'ready'].includes(o.status)
    if (filter === 'completed') return ['delivered', 'cancelled'].includes(o.status)
    return true
  })

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    toast.success(t.orders.status[status])
  }

  const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
    { key: 'all', label: t.common.all },
    { key: 'pending', label: t.orders.status.pending },
    { key: 'active', label: lang === 'kk' ? 'Белсенді' : lang === 'ru' ? 'Активные' : 'Active' },
    { key: 'completed', label: lang === 'kk' ? 'Аяқталған' : lang === 'ru' ? 'Завершённые' : 'Completed' },
  ]

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">{t.store.orders}</h1>
        <span className="text-sm text-[var(--color-text-secondary)]">{filtered.length} {lang === 'kk' ? 'тапсырыс' : lang === 'ru' ? 'заказов' : 'orders'}</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={clsx(
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border',
              filter === key
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-[var(--color-text)]">{order.customerName}</span>
                  <Badge variant={statusColor(order.status)} size="sm">{t.orders.status[order.status]}</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  #{order.id} · {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </p>
              </div>
              <span className="font-black text-[var(--color-text)] text-lg">{order.total.toLocaleString()}₸</span>
            </div>

            {/* Items */}
            <div className="flex flex-wrap gap-1 mb-3">
              {order.items.map(item => (
                <span key={item.productId} className="text-xs bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg px-2 py-1">
                  {item.productName} ×{item.quantity}
                </span>
              ))}
            </div>

            <div className="text-xs text-[var(--color-text-secondary)] mb-3">
              📍 {order.address} · 📞 {order.phone}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {order.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => updateStatus(order.id, 'confirmed')}>
                    <CheckCircle size={14} />
                    {t.store.accept_order}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => updateStatus(order.id, 'cancelled')}>
                    <XCircle size={14} />
                    {t.store.reject_order}
                  </Button>
                </>
              )}
              {order.status === 'confirmed' && (
                <Button size="sm" variant="secondary" onClick={() => updateStatus(order.id, 'preparing')}>
                  <Package size={14} />
                  {lang === 'kk' ? 'Дайындауды бастау' : lang === 'ru' ? 'Начать приготовление' : 'Start preparing'}
                </Button>
              )}
              {order.status === 'preparing' && (
                <Button size="sm" onClick={() => updateStatus(order.id, 'ready')}>
                  <CheckCircle size={14} />
                  {t.store.mark_ready}
                </Button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>{lang === 'kk' ? 'Тапсырыстар жоқ' : lang === 'ru' ? 'Нет заказов' : 'No orders'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
