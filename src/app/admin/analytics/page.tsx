'use client'
import { TrendingUp, Users, ShoppingBag, Truck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { clsx } from 'clsx'

export default function AdminAnalyticsPage() {
  const { lang } = useLanguage()

  const kpis = [
    { label: lang === 'kk' ? 'Айлық GMV' : lang === 'ru' ? 'GMV за месяц' : 'Monthly GMV', value: '12.4M ₸', change: '+18%', icon: TrendingUp, up: true },
    { label: lang === 'kk' ? 'Жаңа пайдаланушылар' : lang === 'ru' ? 'Новых пользователей' : 'New users', value: '486', change: '+23%', icon: Users, up: true },
    { label: lang === 'kk' ? 'Тапсырыстар саны' : lang === 'ru' ? 'Кол-во заказов' : 'Total orders', value: '2,341', change: '+11%', icon: ShoppingBag, up: true },
    { label: lang === 'kk' ? 'Белсенді курьерлер' : lang === 'ru' ? 'Активных курьеров' : 'Active couriers', value: '34', change: '+5', icon: Truck, up: true },
  ]

  const months = [
    { m: lang === 'kk' ? 'Қаң' : 'Янв', v: 55 },
    { m: lang === 'kk' ? 'Ақп' : 'Фев', v: 62 },
    { m: lang === 'kk' ? 'Нау' : 'Мар', v: 78 },
    { m: lang === 'kk' ? 'Сәу' : 'Апр', v: 71 },
    { m: lang === 'kk' ? 'Мам' : 'Май', v: 89 },
    { m: lang === 'kk' ? 'Мау' : 'Июн', v: 100 },
  ]
  const maxV = 100

  const categoryData = [
    { name: lang === 'kk' ? 'Роллдар' : lang === 'ru' ? 'Суши и роллы' : 'Sushi', pct: 32, color: 'bg-green-500' },
    { name: lang === 'kk' ? 'Бургерлер' : lang === 'ru' ? 'Бургеры' : 'Burgers', pct: 24, color: 'bg-blue-500' },
    { name: lang === 'kk' ? 'Пицца' : lang === 'ru' ? 'Пицца' : 'Pizza', pct: 21, color: 'bg-purple-500' },
    { name: lang === 'kk' ? 'Азиат' : lang === 'ru' ? 'Азиатская' : 'Asian', pct: 15, color: 'bg-orange-500' },
    { name: lang === 'kk' ? 'Басқа' : lang === 'ru' ? 'Прочее' : 'Other', pct: 8, color: 'bg-gray-400' },
  ]

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{lang === 'kk' ? 'Аналитика' : lang === 'ru' ? 'Аналитика' : 'Analytics'}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <k.icon size={20} className="text-[var(--color-primary)]" />
              </div>
              <span className="text-xs font-semibold text-green-600">+{k.change}</span>
            </div>
            <p className="text-xl font-black text-[var(--color-text)]">{k.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--color-text)] mb-5">
            {lang === 'kk' ? 'GMV динамикасы' : lang === 'ru' ? 'Динамика GMV' : 'GMV Trend'}
          </h2>
          <div className="flex items-end gap-3 h-36">
            {months.map(m => (
              <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-[var(--color-surface-secondary)] rounded-lg overflow-hidden" style={{ height: '112px' }}>
                  <div className="w-full bg-gradient-to-t from-[var(--color-primary)] to-green-400 rounded-lg"
                    style={{ height: `${(m.v / maxV) * 100}%`, marginTop: `${100 - (m.v / maxV) * 100}%` }} />
                </div>
                <span className="text-[10px] text-[var(--color-text-muted)]">{m.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--color-text)] mb-5">
            {lang === 'kk' ? 'Санаттар бойынша' : lang === 'ru' ? 'По категориям' : 'By category'}
          </h2>
          <div className="space-y-3">
            {categoryData.map(c => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-[var(--color-text)]">{c.name}</span>
                  <span className="text-[var(--color-text-secondary)]">{c.pct}%</span>
                </div>
                <div className="h-2 bg-[var(--color-surface-secondary)] rounded-full overflow-hidden">
                  <div className={clsx('h-full rounded-full', c.color)} style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
