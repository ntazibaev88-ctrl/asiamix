'use client'
import { TrendingUp, ShoppingBag, Star, Users } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { MOCK_ORDERS } from '@/lib/mock-data'
import { clsx } from 'clsx'

export default function StoreStatsPage() {
  const { lang, t } = useLanguage()
  const orders = MOCK_ORDERS.filter(o => o.storeId === '1')
  const revenue = orders.reduce((s, o) => s + o.total, 0)

  const weeks = [
    { day: lang === 'kk' ? 'Дс' : 'Пн', value: 85 },
    { day: lang === 'kk' ? 'Сс' : 'Вт', value: 65 },
    { day: lang === 'kk' ? 'Ср' : 'Ср', value: 90 },
    { day: lang === 'kk' ? 'Бс' : 'Чт', value: 75 },
    { day: lang === 'kk' ? 'Жм' : 'Пт', value: 100 },
    { day: lang === 'kk' ? 'Сб' : 'Сб', value: 95 },
    { day: lang === 'kk' ? 'Жс' : 'Вс', value: 70 },
  ]
  const maxVal = Math.max(...weeks.map(w => w.value))

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.store.statistics}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t.store.today_revenue, value: `${revenue.toLocaleString()}₸`, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
          { label: t.store.today_orders, value: orders.length, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: lang === 'kk' ? 'Орташа рейтинг' : lang === 'ru' ? 'Средний рейтинг' : 'Avg rating', value: '4.8 ⭐', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { label: lang === 'kk' ? 'Тұрақты тапсырыс берушілер' : lang === 'ru' ? 'Постоянные клиенты' : 'Regular customers', value: '48', icon: Users, color: 'text-purple-500', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.bg)}>
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-xl font-black text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-[var(--color-text)] mb-5">
          {lang === 'kk' ? 'Апталық табыс' : lang === 'ru' ? 'Выручка за неделю' : 'Weekly revenue'}
        </h2>
        <div className="flex items-end gap-3 h-32">
          {weeks.map(w => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[var(--color-surface-secondary)] rounded-lg overflow-hidden" style={{ height: '96px' }}>
                <div
                  className="w-full bg-gradient-to-t from-[var(--color-primary)] to-green-400 rounded-lg transition-all duration-700"
                  style={{ height: `${(w.value / maxVal) * 100}%`, marginTop: `${100 - (w.value / maxVal) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
        <h2 className="font-bold text-[var(--color-text)] mb-4">
          {lang === 'kk' ? 'Танымал тауарлар' : lang === 'ru' ? 'Популярные товары' : 'Popular products'}
        </h2>
        {[
          { name: 'Филадельфия', orders: 42, revenue: 121800 },
          { name: 'Дракон', orders: 31, revenue: 99200 },
          { name: 'Калифорния', orders: 27, revenue: 70200 },
        ].map((item, i) => (
          <div key={item.name} className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)] last:border-0">
            <span className={clsx(
              'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
              i === 0 ? 'bg-yellow-100 text-yellow-600' : i === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-500'
            )}>
              {i + 1}
            </span>
            <span className="flex-1 font-medium text-[var(--color-text)]">{item.name}</span>
            <span className="text-sm text-[var(--color-text-secondary)]">{item.orders} {lang === 'kk' ? 'тапс.' : lang === 'ru' ? 'зак.' : 'ord.'}</span>
            <span className="font-bold text-[var(--color-primary)]">{item.revenue.toLocaleString()}₸</span>
          </div>
        ))}
      </div>
    </div>
  )
}
