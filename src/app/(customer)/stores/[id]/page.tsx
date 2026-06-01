'use client'
import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star, Clock, ShoppingBag, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { ProductCard } from '@/components/customer/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { STORES, PRODUCTS } from '@/lib/mock-data'
import { clsx } from 'clsx'

export default function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lang, t } = useLanguage()
  const { addItem, removeItem, items } = useCart()
  const [activeCategory, setActiveCategory] = useState('all')

  const store = STORES.find(s => s.id === id)
  if (!store) notFound()

  const products = PRODUCTS.filter(p => p.storeId === id)
  const categories = Array.from(new Set(products.map(p => p.category)))

  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory)

  const getQuantity = (productId: string) => {
    return items.find(i => i.product.id === productId)?.quantity ?? 0
  }

  const cartTotal = items.filter(i => i.storeId === id).reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const cartCount = items.filter(i => i.storeId === id).reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Cover */}
      <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center">
        <span className="text-8xl">{store.logo}</span>
        <Link href="/stores" className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <ArrowLeft size={18} className="text-gray-700" />
        </Link>
        {!store.isOpen && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="gray" size="md">{t.stores.closed}</Badge>
          </div>
        )}
      </div>

      <div className="px-4 py-5">
        {/* Store info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--color-text)] mb-1">{store.name}</h1>
            <p className="text-sm text-[var(--color-text-secondary)]">{store.description[lang]}</p>
          </div>
          {store.isOpen ? (
            <Badge variant="green">{t.stores.open}</Badge>
          ) : (
            <Badge variant="gray">{t.stores.closed}</Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm mb-6 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-[var(--color-text)]">{store.rating}</span>
            <span className="text-[var(--color-text-muted)]">({store.reviewCount} {t.stores.reviews})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Clock size={15} />
            <span>{store.deliveryTime} {t.common.min}</span>
          </div>
          <div className="text-[var(--color-text-secondary)]">
            {store.deliveryFee === 0 ? (
              <span className="text-[var(--color-primary)] font-medium">🎁 {t.common.free}</span>
            ) : (
              <span>{store.deliveryFee}₸ {t.stores.delivery_fee.toLowerCase()}</span>
            )}
          </div>
          <div className="text-[var(--color-text-secondary)]">
            {t.stores.min_order}: {store.minOrder.toLocaleString()}₸
          </div>
        </div>

        {/* Telegram support */}
        <a
          href="https://t.me/tezi_support"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <MessageSquare size={14} />
          {t.profile.telegram}
        </a>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-none">
          <button
            onClick={() => setActiveCategory('all')}
            className={clsx(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all',
              activeCategory === 'all'
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
            )}
          >
            {t.common.all}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all capitalize',
                activeCategory === cat
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-24">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              lang={lang}
              quantity={getQuantity(product.id)}
              onAdd={() => addItem(product, store.id, store.name)}
              onRemove={() => {
                const qty = getQuantity(product.id)
                if (qty > 0) removeItem(product.id)
              }}
              addLabel={t.product.add_to_cart}
              popularLabel={t.product.popular}
              newLabel={t.product.new}
            />
          ))}
        </div>
      </div>

      {/* Floating cart bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 max-w-md mx-auto z-30">
          <Link href="/cart"
            className="flex items-center justify-between bg-[var(--color-primary)] text-white rounded-2xl px-5 py-4 shadow-lg hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} />
              <span className="font-semibold">{cartCount} {t.cart.items}</span>
            </div>
            <span className="font-bold">{cartTotal.toLocaleString()}₸ →</span>
          </Link>
        </div>
      )}
    </div>
  )
}
