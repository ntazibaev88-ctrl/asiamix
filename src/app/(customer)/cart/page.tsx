'use client'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const { t, lang } = useLanguage()
  const { items, updateQuantity, removeItem, subtotal, storeName } = useCart()

  const DELIVERY_FEE = items.length > 0 ? 300 : 0
  const total = subtotal + DELIVERY_FEE

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">{t.cart.empty}</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">{t.cart.empty_desc}</p>
        <Link href="/stores">
          <Button size="lg">{t.cart.go_to_stores}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-2">{t.cart.title}</h1>
      {storeName && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          📍 {storeName}
        </p>
      )}

      {/* Items list */}
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div key={item.product.id} className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-3">
            <div className="w-14 h-14 bg-[var(--color-surface-secondary)] rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
              🍽️
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-text)] text-sm truncate">{item.product.name[lang]}</p>
              <p className="text-[var(--color-primary)] font-bold text-sm">{item.product.price.toLocaleString()}₸</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-7 h-7 border border-[var(--color-border)] rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-tertiary)] transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-[var(--color-text)] w-5 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-7 h-7 bg-[var(--color-primary)] rounded-lg flex items-center justify-center hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                <Plus size={14} className="text-white" />
              </button>
              <button
                onClick={() => removeItem(item.product.id)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors ml-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 mb-6">
        <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-2">
          <span>{t.cart.subtotal}</span>
          <span>{subtotal.toLocaleString()}₸</span>
        </div>
        <div className="flex justify-between text-sm text-[var(--color-text-secondary)] mb-3">
          <span>{t.cart.delivery_fee}</span>
          <span>{DELIVERY_FEE === 0 ? t.common.free : `${DELIVERY_FEE}₸`}</span>
        </div>
        <hr className="border-[var(--color-border)] mb-3" />
        <div className="flex justify-between font-bold text-[var(--color-text)]">
          <span>{t.cart.total}</span>
          <span className="text-[var(--color-primary)]">{total.toLocaleString()}₸</span>
        </div>
      </div>

      <Link href="/checkout">
        <Button fullWidth size="lg" className="text-base">
          {t.cart.checkout}
          <ArrowRight size={18} />
        </Button>
      </Link>
    </div>
  )
}
