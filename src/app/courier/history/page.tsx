'use client'
import { CheckCircle, XCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { formatDistanceToNow } from 'date-fns'

export default function CourierHistoryPage() {
  const { lang, t } = useLanguage()
  const history = MOCK_ORDERS.filter(o => o.courierId === 'c1')

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.courier.delivery_history}</h1>
      <div className="space-y-3">
        {history.map(d => (
          <div key={d.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${d.status === 'delivered' ? 'bg-green-100' : 'bg-red-100'}`}>
              {d.status === 'delivered' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-text)]">{d.storeName}</p>
              <p className="text-xs text-[var(--color-text-secondary)] truncate">{d.address}</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-[var(--color-primary)] text-sm">{d.status === 'delivered' ? '+450₸' : '—'}</p>
              <Badge variant={d.status === 'delivered' ? 'green' : 'red'} size="sm">{t.orders.status[d.status]}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
