'use client'
import Link from 'next/link'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { OrderStatus } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

function statusBadgeVariant(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (status === 'delivering' || status === 'picked_up') return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function OrdersPage() {
  const { lang, t } = useLanguage()

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.orders.title}</h1>

      {MOCK_ORDERS.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList size={48} className="text-[var(--color-text-muted)] mb-3" />
          <h2 className="font-bold text-[var(--color-text)] mb-1">{t.orders.empty}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">{t.orders.empty_desc}</p>
          <Link href="/stores" className="text-[var(--color-primary)] font-semibold text-sm">{t.cart.go_to_stores}</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {MOCK_ORDERS.map(order => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-[var(--color-text-muted)] mb-0.5">{t.orders.order_number}{order.id}</p>
                    <p className="font-bold text-[var(--color-text)]">{order.storeName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadgeVariant(order.status)}>
                      {t.orders.status[order.status]}
                    </Badge>
                    <ChevronRight size={16} className="text-[var(--color-text-muted)]" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {order.items.map(item => (
                    <span key={item.productId} className="text-xs bg-[var(--color-surface-secondary)] text-[var(--color-text-secondary)] rounded-lg px-2 py-1">
                      {item.productName} × {item.quantity}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--color-text)]">{order.total.toLocaleString()}₸</span>
                  <span className="text-[var(--color-text-muted)]">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
