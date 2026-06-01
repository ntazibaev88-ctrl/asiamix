'use client'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { STORES } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function StoreSettingsPage() {
  const { t, lang } = useLanguage()
  const store = STORES[0]
  const [name, setName] = useState(store.name)
  const [phone, setPhone] = useState(store.phone)
  const [address, setAddress] = useState(store.address)
  const [descRu, setDescRu] = useState(store.description.ru)
  const [deliveryFee, setDeliveryFee] = useState(store.deliveryFee.toString())
  const [minOrder, setMinOrder] = useState(store.minOrder.toString())
  const [deliveryTime, setDeliveryTime] = useState(store.deliveryTime.toString())
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success(lang === 'kk' ? 'Баптаулар сақталды' : lang === 'ru' ? 'Настройки сохранены' : 'Settings saved')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.store.settings}</h1>

      <div className="space-y-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-[var(--color-text)]">
            {lang === 'kk' ? 'Дүкен туралы' : lang === 'ru' ? 'О магазине' : 'About store'}
          </h2>
          <Input label={lang === 'kk' ? 'Дүкен атауы' : lang === 'ru' ? 'Название магазина' : 'Store name'} value={name} onChange={e => setName(e.target.value)} />
          <div>
            <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1.5">
              {lang === 'kk' ? 'Сипаттама (RU)' : lang === 'ru' ? 'Описание (RU)' : 'Description (RU)'}
            </label>
            <textarea
              value={descRu}
              onChange={e => setDescRu(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-[var(--color-text)]">
            {lang === 'kk' ? 'Байланыс' : lang === 'ru' ? 'Контакты' : 'Contact'}
          </h2>
          <Input label={t.profile.phone} value={phone} onChange={e => setPhone(e.target.value)} />
          <Input label={lang === 'kk' ? 'Мекенжай' : lang === 'ru' ? 'Адрес' : 'Address'} value={address} onChange={e => setAddress(e.target.value)} />
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-[var(--color-text)]">
            {lang === 'kk' ? 'Жеткізу баптаулары' : lang === 'ru' ? 'Настройки доставки' : 'Delivery settings'}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <Input label={`${t.stores.delivery_fee} (₸)`} type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} />
            <Input label={`${t.stores.min_order} (₸)`} type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} />
            <Input label={`${t.stores.delivery_time} (${t.common.min})`} type="number" value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} />
          </div>
        </div>

        <Button fullWidth size="lg" loading={loading} onClick={handleSave}>{t.common.save}</Button>
      </div>
    </div>
  )
}
