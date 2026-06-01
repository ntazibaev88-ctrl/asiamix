'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, MapPin, CreditCard, Banknote } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { clsx } from 'clsx'
import { toast } from 'sonner'

type DeliveryType = 'delivery' | 'pickup'
type PaymentType = 'cash' | 'card'

export default function CheckoutPage() {
  const { t, lang } = useLanguage()
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery')
  const [paymentType, setPaymentType] = useState<PaymentType>('cash')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const DELIVERY_FEE = deliveryType === 'delivery' ? 300 : 0
  const total = subtotal + DELIVERY_FEE

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      toast.error(lang === 'kk' ? 'Аты мен телефонды толтырыңыз' : lang === 'ru' ? 'Заполните имя и телефон' : 'Fill in name and phone')
      return
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      toast.error(lang === 'kk' ? 'Мекенжайды толтырыңыз' : lang === 'ru' ? 'Укажите адрес доставки' : 'Enter delivery address')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSuccess(true)
    clearCart()
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-[var(--color-primary)]" />
        </div>
        <h2 className="text-2xl font-black text-[var(--color-text)] mb-2">
          {lang === 'kk' ? 'Тапсырыс қабылданды!' : lang === 'ru' ? 'Заказ принят!' : 'Order placed!'}
        </h2>
        <p className="text-[var(--color-text-secondary)] mb-8 max-w-xs">
          {lang === 'kk' ? 'Тапсырысыңызды бақылай аласыз' : lang === 'ru' ? 'Вы можете отслеживать свой заказ' : 'You can track your order'}
        </p>
        <Link href="/orders">
          <Button size="lg">{t.nav.orders}</Button>
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <Link href="/stores"><Button>{t.cart.go_to_stores}</Button></Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="p-2 rounded-xl hover:bg-[var(--color-surface-tertiary)] transition-colors">
          <ArrowLeft size={20} className="text-[var(--color-text)]" />
        </Link>
        <h1 className="text-2xl font-black text-[var(--color-text)]">{t.checkout.title}</h1>
      </div>

      <div className="space-y-4">
        {/* Delivery type */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
          <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[var(--color-primary)]" />
            {lang === 'kk' ? 'Жеткізу түрі' : lang === 'ru' ? 'Тип доставки' : 'Delivery type'}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {(['delivery', 'pickup'] as DeliveryType[]).map(type => (
              <button
                key={type}
                onClick={() => setDeliveryType(type)}
                className={clsx(
                  'py-2.5 rounded-xl text-sm font-medium transition-all border',
                  deliveryType === type
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                )}
              >
                {type === 'delivery' ? t.checkout.delivery : t.checkout.pickup}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 space-y-3">
          <h3 className="font-bold text-[var(--color-text)] mb-1">
            {lang === 'kk' ? 'Байланыс мәліметтері' : lang === 'ru' ? 'Контактные данные' : 'Contact details'}
          </h3>
          <Input
            label={t.checkout.name}
            placeholder={t.checkout.name_placeholder}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            label={t.checkout.phone}
            placeholder={t.checkout.phone_placeholder}
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          {deliveryType === 'delivery' && (
            <Input
              label={t.checkout.address}
              placeholder={t.checkout.address_placeholder}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          )}
          <Input
            label={t.checkout.notes}
            placeholder={t.checkout.notes_placeholder}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Payment */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
          <h3 className="font-bold text-[var(--color-text)] mb-3 flex items-center gap-2">
            <CreditCard size={16} className="text-[var(--color-primary)]" />
            {t.checkout.payment}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {([
              { type: 'cash' as PaymentType, icon: <Banknote size={16} />, label: t.checkout.cash },
              { type: 'card' as PaymentType, icon: <CreditCard size={16} />, label: t.checkout.card },
            ]).map(({ type, icon, label }) => (
              <button
                key={type}
                onClick={() => setPaymentType(type)}
                className={clsx(
                  'flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  paymentType === type
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]'
                )}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
          <h3 className="font-bold text-[var(--color-text)] mb-3">{t.checkout.order_summary}</h3>
          <div className="space-y-2 mb-3">
            {items.map(item => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">{item.product.name[lang]} × {item.quantity}</span>
                <span className="font-medium text-[var(--color-text)]">{(item.product.price * item.quantity).toLocaleString()}₸</span>
              </div>
            ))}
          </div>
          <hr className="border-[var(--color-border)] mb-3" />
          <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-1">
            <span>{t.cart.delivery_fee}</span>
            <span>{DELIVERY_FEE === 0 ? t.common.free : `${DELIVERY_FEE}₸`}</span>
          </div>
          <div className="flex justify-between font-bold text-[var(--color-text)]">
            <span>{t.cart.total}</span>
            <span className="text-[var(--color-primary)] text-lg">{total.toLocaleString()}₸</span>
          </div>
        </div>

        <Button fullWidth size="lg" loading={loading} onClick={handleSubmit} className="text-base">
          {t.checkout.place_order}
        </Button>
      </div>
    </div>
  )
}
