'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, MapPin, Zap, Shield, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { StoreCard } from '@/components/customer/StoreCard'
import { STORES, CATEGORIES } from '@/lib/mock-data'
import { clsx } from 'clsx'

export default function HomePage() {
  const { lang, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStores = STORES.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl mt-6 mb-8 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 p-6 md:p-10">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 text-[120px]">🍔</div>
          <div className="absolute bottom-4 right-32 text-[80px]">🍕</div>
          <div className="absolute top-10 right-48 text-[60px]">🍣</div>
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 text-green-200 text-sm font-medium mb-3">
            <MapPin size={14} />
            <span>Алматы, Казахстан</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
            {t.home.hero_title}
          </h1>
          <p className="text-green-200 text-base mb-6">
            {t.home.hero_subtitle}
          </p>
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              { icon: '⚡', text: '30-45 мин' },
              { icon: '🛡️', text: lang === 'kk' ? 'Қауіпсіз' : lang === 'ru' ? 'Безопасно' : 'Safe' },
              { icon: '⭐', text: '4.8+' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-1.5 text-white text-sm">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.home.search_placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl text-gray-800 placeholder:text-gray-400 text-sm font-medium shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      {/* Feature pills */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-1 scrollbar-none">
        {[
          { icon: '🚀', label: t.home.fast_delivery },
          { icon: '🎁', label: t.home.free_delivery },
          { icon: '⭐', label: t.home.top_rated },
        ].map(item => (
          <div key={item.label} className="flex-shrink-0 flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text)]">
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--color-text)]">{t.home.categories}</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={clsx(
                'flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                activeCategory === cat.slug
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              )}
            >
              <span>{cat.icon}</span>
              <span>{cat.name[lang]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Stores grid */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            {activeCategory === 'all' ? t.home.popular_stores : t.home.all_stores}
          </h2>
          <Link href="/stores" className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]">
            {t.home.all_stores}
            <ChevronRight size={16} />
          </Link>
        </div>
        {filteredStores.length === 0 ? (
          <div className="text-center py-16 text-[var(--color-text-muted)]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">{t.common.search}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredStores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                lang={lang}
                deliveryFeeLabel={t.stores.delivery_fee}
                freeLabel={t.common.free}
                minLabel={t.common.min}
                reviewsLabel={t.stores.reviews}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust section */}
      <section className="mb-10 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-6 text-center">
          {lang === 'kk' ? 'Неліктен TEZI-ді таңдайды?' : lang === 'ru' ? 'Почему выбирают TEZI?' : 'Why choose TEZI?'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="text-[var(--color-primary)]" size={24} />, title: lang === 'kk' ? 'Жылдам жеткізу' : lang === 'ru' ? 'Быстрая доставка' : 'Fast delivery', desc: lang === 'kk' ? '30-45 минут ішінде' : lang === 'ru' ? 'За 30-45 минут' : 'In 30-45 minutes' },
            { icon: <Shield className="text-blue-500" size={24} />, title: lang === 'kk' ? 'Қауіпсіз' : lang === 'ru' ? 'Безопасно' : 'Safe', desc: lang === 'kk' ? 'Тамақ сапасы кепілдендірілген' : lang === 'ru' ? 'Гарантия качества еды' : 'Food quality guaranteed' },
            { icon: <Star className="text-yellow-500" size={24} />, title: lang === 'kk' ? 'Жоғары рейтинг' : lang === 'ru' ? 'Высокий рейтинг' : 'Top rated', desc: lang === 'kk' ? '4.8+ орташа баға' : lang === 'ru' ? 'Средняя оценка 4.8+' : 'Average rating 4.8+' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 bg-[var(--color-surface-secondary)] rounded-2xl flex items-center justify-center">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-[var(--color-text)] mb-1">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
