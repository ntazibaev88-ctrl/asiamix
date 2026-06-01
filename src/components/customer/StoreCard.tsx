'use client'
import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import type { Store } from '@/lib/types'
import type { Language } from '@/lib/types'

interface StoreCardProps {
  store: Store
  lang: Language
  deliveryFeeLabel: string
  freeLabel: string
  minLabel: string
  reviewsLabel: string
}

export function StoreCard({ store, lang, deliveryFeeLabel, freeLabel, minLabel, reviewsLabel }: StoreCardProps) {
  return (
    <Link href={`/stores/${store.id}`} className="group block">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {/* Cover */}
        <div className="relative h-36 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/20 dark:to-green-800/10 flex items-center justify-center">
          <span className="text-6xl">{store.logo}</span>
          {!store.isOpen && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-semibold text-sm px-3 py-1 bg-black/50 rounded-full">Закрыт</span>
            </div>
          )}
          {store.deliveryFee === 0 && store.isOpen && (
            <div className="absolute top-2 right-2">
              <Badge variant="green">{freeLabel}</Badge>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-[var(--color-text)] text-sm">{store.name}</h3>
            <div className="flex items-center gap-0.5 shrink-0">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-[var(--color-text)]">{store.rating}</span>
              <span className="text-xs text-[var(--color-text-muted)]">({store.reviewCount})</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)] mb-2 line-clamp-1">
            {store.description[lang]}
          </p>
          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{store.deliveryTime} {minLabel}</span>
            </div>
            <div className="text-[var(--color-text-secondary)]">
              {store.deliveryFee === 0 ? (
                <span className="text-[var(--color-primary)] font-medium">{freeLabel}</span>
              ) : (
                <span>{store.deliveryFee}₸</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
