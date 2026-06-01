'use client'
import { useState } from 'react'
import { Search, CheckCircle, XCircle, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { STORES } from '@/lib/mock-data'
import type { Store } from '@/lib/types'
import { toast } from 'sonner'
import { clsx } from 'clsx'

export default function AdminStoresPage() {
  const { lang, t } = useLanguage()
  const [stores, setStores] = useState<(Store & { approved: boolean })[]>(STORES.map(s => ({ ...s, approved: true })))
  const [search, setSearch] = useState('')

  const filtered = stores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  const toggleApprove = (id: string) => {
    setStores(prev => prev.map(s => s.id === id ? { ...s, approved: !s.approved } : s))
    toast.success(lang === 'ru' ? 'Статус магазина обновлён' : 'Дүкен мәртебесі жаңартылды')
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.admin.stores}</h1>
      <div className="mb-6">
        <Input placeholder={t.stores.search} value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} />
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(store => (
            <div key={store.id} className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-[var(--color-surface-secondary)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {store.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[var(--color-text)]">{store.name}</span>
                  <Badge variant={store.approved ? 'green' : 'yellow'} size="sm">
                    {store.approved ? t.admin.approve : lang === 'kk' ? 'Күтуде' : lang === 'ru' ? 'Ожидает' : 'Pending'}
                  </Badge>
                  {!store.isOpen && <Badge variant="gray" size="sm">{t.stores.closed}</Badge>}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-[var(--color-text-muted)]">
                  <span>{store.category}</span>
                  <div className="flex items-center gap-0.5">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span>{store.rating}</span>
                  </div>
                  <span>{store.address}</span>
                </div>
              </div>
              <button onClick={() => toggleApprove(store.id)}
                className={clsx(
                  'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0',
                  store.approved ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                )}
              >
                {store.approved ? <><XCircle size={14} />{t.admin.reject}</> : <><CheckCircle size={14} />{t.admin.approve}</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
