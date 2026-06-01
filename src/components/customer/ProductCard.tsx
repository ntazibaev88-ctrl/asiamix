'use client'
import { Minus, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/lib/types'
import type { Language } from '@/lib/types'

interface ProductCardProps {
  product: Product
  lang: Language
  quantity: number
  onAdd: () => void
  onRemove: () => void
  addLabel: string
  popularLabel: string
  newLabel: string
}

export function ProductCard({ product, lang, quantity, onAdd, onRemove, addLabel, popularLabel, newLabel }: ProductCardProps) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Image area */}
      <div className="relative h-28 bg-gradient-to-br from-[var(--color-surface-secondary)] to-[var(--color-surface-tertiary)] flex items-center justify-center">
        <span className="text-5xl">🍽️</span>
        <div className="absolute top-2 left-2 flex gap-1">
          {product.isPopular && <Badge variant="yellow">{popularLabel}</Badge>}
          {product.isNew && <Badge variant="blue">{newLabel}</Badge>}
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <h4 className="font-semibold text-[var(--color-text)] text-sm mb-0.5 line-clamp-1">
          {product.name[lang]}
        </h4>
        <p className="text-xs text-[var(--color-text-secondary)] mb-3 line-clamp-2">
          {product.description[lang]}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-[var(--color-text)] text-sm">
            {product.price.toLocaleString()}₸
          </span>
          {quantity === 0 ? (
            <button
              onClick={onAdd}
              disabled={!product.isAvailable}
              className="w-8 h-8 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors active:scale-95"
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={onRemove} className="w-7 h-7 border border-[var(--color-border)] rounded-lg flex items-center justify-center hover:bg-[var(--color-surface-tertiary)] transition-colors">
                <Minus size={14} />
              </button>
              <span className="text-sm font-bold text-[var(--color-text)] min-w-[1rem] text-center">{quantity}</span>
              <button onClick={onAdd} className="w-7 h-7 bg-[var(--color-primary)] rounded-lg flex items-center justify-center hover:bg-[var(--color-primary-dark)] transition-colors">
                <Plus size={14} className="text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
