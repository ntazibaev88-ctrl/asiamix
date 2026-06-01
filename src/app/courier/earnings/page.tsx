'use client'
import { TrendingUp, Wallet, Calendar, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { clsx } from 'clsx'

export default function CourierEarningsPage() {
  const { lang, t } = useLanguage()

  const weeks = [
    { day: lang === 'kk' ? 'Дс' : 'Пн', earnings: 1350, count: 3 },
    { day: lang === 'kk' ? 'Сс' : 'Вт', earnings: 900, count: 2 },
    { day: lang === 'kk' ? 'Ср' : 'Ср', earnings: 1800, count: 4 },
    { day: lang === 'kk' ? 'Бс' : 'Чт', earnings: 1350, count: 3 },
    { day: lang === 'kk' ? 'Жм' : 'Пт', earnings: 2250, count: 5 },
    { day: lang === 'kk' ? 'Сб' : 'Сб', earnings: 2700, count: 6 },
    { day: lang === 'kk' ? 'Жс' : 'Вс', earnings: 1800, count: 4 },
  ]
  const maxEarnings = Math.max(...weeks.map(w => w.earnings))
  const totalWeek = weeks.reduce((s, w) => s + w.earnings, 0)

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.courier.earnings}</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: t.courier.today_earnings, value: '1 350₸', icon: Wallet, color: 'text-[var(--color-primary)]', bg: 'bg-green-50', change: '+12%' },
          { label: lang === 'kk' ? 'Апталық табыс' : lang === 'ru' ? 'За неделю' : 'This week', value: `${totalWeek.toLocaleString()}₸`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50', change: '+8%' },
          { label: lang === 'kk' ? 'Ай сайын' : lang === 'ru' ? 'За месяц' : 'This month', value: '48 600₸', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50', change: '+15%' },
        ].map(s => (
          <div key={s.label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}>
                <s.icon size={20} className={s.color} />
              </div>
              <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                <ArrowUpRight size={12} />{s.change}
              </span>
            </div>
            <p className="text-xl font-black text-[var(--color-text)]">{s.value}</p>
            <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-[var(--color-text)] mb-5">
          {lang === 'kk' ? 'Апталық табыс' : lang === 'ru' ? 'Заработок за неделю' : 'Weekly earnings'}
        </h2>
        <div className="flex items-end gap-3 h-32">
          {weeks.map(w => (
            <div key={w.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-[var(--color-surface-secondary)] rounded-lg overflow-hidden" style={{ height: '96px' }}>
                <div
                  className="w-full bg-gradient-to-t from-[var(--color-primary)] to-green-400 rounded-lg"
                  style={{ height: `${(w.earnings / maxEarnings) * 100}%`, marginTop: `${100 - (w.earnings / maxEarnings) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-[var(--color-text-muted)]">{w.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent earnings */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
        <h2 className="font-bold text-[var(--color-text)] mb-4">
          {lang === 'kk' ? 'Соңғы жеткізулер' : lang === 'ru' ? 'Последние доставки' : 'Recent deliveries'}
        </h2>
        {[
          { store: 'Sakura Sushi', addr: 'ул. Абай 15', time: '14:30', amount: 450 },
          { store: 'Burger House', addr: 'пр. Назарбаева 100', time: '12:15', amount: 350 },
          { store: 'Pizza Palace', addr: 'ул. Достык 55', time: '10:45', amount: 550 },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
            <div className="w-9 h-9 bg-[var(--color-primary-light)] rounded-xl flex items-center justify-center">
              <Wallet size={16} className="text-[var(--color-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--color-text)] truncate">{item.store}</p>
              <p className="text-xs text-[var(--color-text-muted)] truncate">{item.addr} · {item.time}</p>
            </div>
            <span className="font-bold text-[var(--color-primary)] text-sm">+{item.amount}₸</span>
          </div>
        ))}
      </div>
    </div>
  )
}
