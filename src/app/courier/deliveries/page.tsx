'use client'
import { MapPin, Phone, Truck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { OrderStatus } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

function statusColor(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (['delivering', 'picked_up'].includes(status)) return 'blue'
  return 'gray'
}

export default function CourierDeliveriesPage() {
  const { lang, t } = useLanguage()
  const deliveries = MOCK_ORDERS.filter(o => o.courierId === 'c1')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.courier.deliveries}</h1>
      {deliveries.length === 0 ? (
        <div className="text-center py-16 text-[var(--color-text-muted)]">
          <Truck size={40} className="mx-auto mb-3 opacity-30" />
          <p>{lang === 'kk' ? 'Жеткізулер жоқ' : lang === 'ru' ? 'Нет доставок' : 'No deliveries'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveries.map(d => (
            <div key={d.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-[var(--color-text)]">{d.storeName}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    #{d.id} · {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColor(d.status)}>{t.orders.status[d.status]}</Badge>
                  <span className="font-bold text-[var(--color-primary)] text-sm">+450₸</span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-[var(--color-text-secondary)]">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-[var(--color-primary)]" />
                  <span className="truncate">{d.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-[var(--color-text-muted)]" />
                  <span>{d.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
