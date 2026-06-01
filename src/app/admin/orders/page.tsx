'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { OrderStatus } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { clsx } from 'clsx'

function statusColor(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (['delivering', 'picked_up'].includes(status)) return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function AdminOrdersPage() {
  const { lang, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')

  const statuses: (OrderStatus | 'all')[] = ['all', 'pending', 'preparing', 'delivering', 'delivered', 'cancelled']

  const filtered = MOCK_ORDERS.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.storeName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="max-w-7xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.admin.orders}</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={clsx(
                'flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                statusFilter === s ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
              )}
            >
              {s === 'all' ? t.common.all : t.orders.status[s]}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <span>{lang === 'kk' ? 'Тапсырыс беруші' : lang === 'ru' ? 'Клиент' : 'Customer'}</span>
          <span>{lang === 'kk' ? 'Дүкен' : lang === 'ru' ? 'Ресторан' : 'Store'}</span>
          <span>{t.cart.total}</span>
          <span>{t.admin.timestamp}</span>
          <span>{lang === 'kk' ? 'Мәртебе' : lang === 'ru' ? 'Статус' : 'Status'}</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(o => (
            <div key={o.id} className="flex md:grid md:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-3 md:gap-4 p-4">
              <div>
                <p className="font-semibold text-sm text-[var(--color-text)]">{o.customerName}</p>
                <p className="text-xs text-[var(--color-text-muted)]">#{o.id}</p>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] hidden md:block">{o.storeName}</p>
              <p className="font-bold text-[var(--color-text)]">{o.total.toLocaleString()}₸</p>
              <p className="text-xs text-[var(--color-text-muted)] hidden md:block">{formatDistanceToNow(new Date(o.createdAt), { addSuffix: true })}</p>
              <Badge variant={statusColor(o.status)} size="sm">{t.orders.status[o.status]}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
