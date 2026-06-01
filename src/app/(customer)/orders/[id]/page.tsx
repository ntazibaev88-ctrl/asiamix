'use client'
import { use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, CreditCard, Package, CheckCircle, Truck, Clock } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Badge } from '@/components/ui/Badge'
import { MOCK_ORDERS } from '@/lib/mock-data'
import type { OrderStatus } from '@/lib/types'
import { clsx } from 'clsx'

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivering', 'delivered']

function statusBadgeVariant(status: OrderStatus): 'green' | 'yellow' | 'blue' | 'red' | 'gray' {
  if (status === 'delivered') return 'green'
  if (status === 'cancelled') return 'red'
  if (status === 'delivering' || status === 'picked_up') return 'blue'
  if (status === 'pending') return 'gray'
  return 'yellow'
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lang, t } = useLanguage()

  const order = MOCK_ORDERS.find(o => o.id === id)
  if (!order) notFound()

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/orders" className="p-2 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--color-text)]" />
        </Link>
        <div>
          <p className="text-xs text-[var(--color-text-muted)]">{t.orders.order_number}{order.id}</p>
          <h1 className="text-xl font-black text-[var(--color-text)]">{order.storeName}</h1>
        </div>
        <div className="ml-auto">
          <Badge variant={statusBadgeVariant(order.status)} size="md">
            {t.orders.status[order.status]}
          </Badge>
        </div>
      </div>

      {/* Status tracker */}
      {order.status !== 'cancelled' && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-4">
          <h3 className="font-bold text-[var(--color-text)] mb-4">{t.orders.track}</h3>
          <div className="space-y-3">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentStep
              const isCurrent = i === currentStep
              return (
                <div key={step} className="flex items-center gap-3">
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    isDone ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-surface-tertiary)]'
                  )}>
                    {isDone ? <CheckCircle size={16} className="text-white" /> : (
                      <span className="text-[var(--color-text-muted)] text-xs">{i + 1}</span>
                    )}
                  </div>
                  <span className={clsx(
                    'text-sm font-medium transition-all',
                    isCurrent ? 'text-[var(--color-primary)] font-bold' : isDone ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'
                  )}>
                    {t.orders.status[step]}
                  </span>
                  {isCurrent && (
                    <div className="ml-auto w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-4">
        <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
          <Package size={16} className="text-[var(--color-primary)]" />
          {t.checkout.order_summary}
        </h3>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.productId} className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">{item.productName} × {item.quantity}</span>
              <span className="font-medium text-[var(--color-text)]">{(item.price * item.quantity).toLocaleString()}₸</span>
            </div>
          ))}
          <hr className="border-[var(--color-border)]" />
          <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>{t.cart.delivery_fee}</span>
            <span>{order.deliveryFee}₸</span>
          </div>
          <div className="flex justify-between font-bold text-[var(--color-text)]">
            <span>{t.cart.total}</span>
            <span className="text-[var(--color-primary)]">{order.total.toLocaleString()}₸</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">{t.checkout.address}</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{order.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">{t.profile.phone}</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{order.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CreditCard size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">{t.checkout.payment}</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {order.paymentMethod === 'cash' ? t.checkout.cash : t.checkout.card}
            </p>
          </div>
        </div>
        {order.courierName && (
          <div className="flex items-center gap-3">
            <Truck size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{lang === 'kk' ? 'Курьер' : lang === 'ru' ? 'Курьер' : 'Courier'}</p>
              <p className="text-sm font-medium text-[var(--color-text)]">{order.courierName}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Clock size={16} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">{lang === 'kk' ? 'Тапсырыс уақыты' : lang === 'ru' ? 'Время заказа' : 'Order time'}</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
