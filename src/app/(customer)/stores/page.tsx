'use client'
import { useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { StoreCard } from '@/components/customer/StoreCard'
import { STORES, CATEGORIES } from '@/lib/mock-data'
import { clsx } from 'clsx'

export default function StoresPage() {
  const { lang, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [onlyOpen, setOnlyOpen] = useState(false)

  const filtered = STORES.filter(s => {
    if (onlyOpen && !s.isOpen) return false
    if (activeCategory !== 'all' && s.category !== activeCategory) return false
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.stores.title}</h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
        <input
          type="text"
          placeholder={t.stores.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-text)]"
        />
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setOnlyOpen(!onlyOpen)}
          className={clsx(
            'flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
            onlyOpen
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
              : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
          )}
        >
          <SlidersHorizontal size={14} />
          {t.stores.open}
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.slug}
            onClick={() => setActiveCategory(cat.slug)}
            className={clsx(
              'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
              activeCategory === cat.slug
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
            )}
          >
            {cat.icon} {cat.name[lang]}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🍽️</div>
          <p className="text-[var(--color-text-muted)] font-medium">
            {lang === 'kk' ? 'Дүкендер табылмады' : lang === 'ru' ? 'Рестораны не найдены' : 'No restaurants found'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">{filtered.length} {lang === 'kk' ? 'дүкен' : lang === 'ru' ? 'ресторана' : 'restaurants'}</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(store => (
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
        </>
      )}
    </div>
  )
}
