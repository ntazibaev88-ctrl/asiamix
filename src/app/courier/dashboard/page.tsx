'use client'
import { useState } from 'react'
import { MapPin, Phone, CheckCircle, Truck, Package, Wallet, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { Order, OrderStatus } from '@/lib/types'
import { toast } from 'sonner'
import { clsx } from 'clsx'

const courierId = 'c1'

export default function CourierDashboard() {
  const { lang, t } = useLanguage()
  const [available, setAvailable] = useState(true)
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)

  const activeDelivery = orders.find(o => o.courierId === courierId && ['picked_up', 'delivering'].includes(o.status))
  const todayDeliveries = orders.filter(o => o.courierId === courierId && o.status === 'delivered')
  const todayEarnings = todayDeliveries.length * 450
  const pendingRequests = orders.filter(o => !o.courierId && o.status === 'ready')

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status, courierId: courierId, courierName: 'Дамир К.', updatedAt: new Date().toISOString() } : o))
    toast.success(t.orders.status[status])
  }

  const acceptDelivery = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, courierId, courierName: 'Дамир К.', status: 'picked_up' as OrderStatus } : o))
    toast.success(lang === 'kk' ? 'Жеткізу қабылданды!' : lang === 'ru' ? 'Доставка принята!' : 'Delivery accepted!')
  }

  return (
    <div className="max-w-4xl">
      {/* Header with availability toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text)]">{t.courier.dashboard}</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Дамир К.</p>
        </div>
        <button
          onClick={() => { setAvailable(!available); toast.success(available ? (lang === 'ru' ? 'Вы недоступны' : 'Сіз бос емессіз') : (lang === 'ru' ? 'Вы доступны' : 'Сіз қолжетімдісіз')) }}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border-2',
            available ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-[var(--color-surface-tertiary)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
          )}
        >
          <div className={clsx('w-2 h-2 rounded-full', available ? 'bg-[var(--color-primary)] animate-pulse' : 'bg-gray-400')} />
          {available ? t.courier.available : t.courier.busy}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: t.courier.today_deliveries, value: todayDeliveries.length, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: t.courier.today_earnings, value: `${todayEarnings.toLocaleString()}₸`, icon: Wallet, color: 'text-[var(--color-primary)]', bg: 'bg-green-50' },
          { label: lang === 'kk' ? 'Жалпы жеткізу' : lang === 'ru' ? 'Всего доставок' : 'Total deliveries', value: 124, icon: Truck, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.bg)}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl font-black text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active delivery */}
      {activeDelivery && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={20} />
            <h2 className="font-bold">{t.courier.active_delivery}</h2>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 opacity-80 flex-shrink-0" />
              <div>
                <p className="text-xs opacity-70">{t.courier.pickup_from}</p>
                <p className="text-sm font-medium">{activeDelivery.storeName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 opacity-80 flex-shrink-0" />
              <div>
                <p className="text-xs opacity-70">{t.courier.deliver_to}</p>
                <p className="text-sm font-medium">{activeDelivery.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="opacity-80" />
              <p className="text-sm">{activeDelivery.phone}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {activeDelivery.status === 'picked_up' && (
              <Button size="sm" variant="secondary" onClick={() => updateStatus(activeDelivery.id, 'delivering')} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Truck size={14} />
                {lang === 'kk' ? 'Жеткізуде' : lang === 'ru' ? 'В пути' : 'On the way'}
              </Button>
            )}
            {activeDelivery.status === 'delivering' && (
              <Button size="sm" onClick={() => updateStatus(activeDelivery.id, 'delivered')} className="bg-white text-green-700 hover:bg-green-50">
                <CheckCircle size={14} />
                {t.courier.delivered}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Pending requests */}
      {pendingRequests.length > 0 && available && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-[var(--color-text)] mb-4">
            {lang === 'kk' ? 'Жеткізу сұраулары' : lang === 'ru' ? 'Запросы на доставку' : 'Delivery requests'}
          </h2>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <div key={req.id} className="flex items-center gap-3 p-3 bg-[var(--color-surface-secondary)] rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-text)]">{req.storeName}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] truncate">{req.address}</p>
                  <p className="text-xs font-medium text-[var(--color-primary)] mt-0.5">
                    +450₸ {lang === 'kk' ? 'табыс' : lang === 'ru' ? 'заработок' : 'earnings'}
                  </p>
                </div>
                <Button size="sm" onClick={() => acceptDelivery(req.id)}>{t.courier.accept}</Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
