'use client'
import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Package } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { PRODUCTS } from '@/lib/mock-data'
import type { Product } from '@/lib/types'
import { toast } from 'sonner'

const storeId = '1'

export default function StoreProductsPage() {
  const { t, lang } = useLanguage()
  const [products, setProducts] = useState<Product[]>(PRODUCTS.filter(p => p.storeId === storeId))
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', nameRu: '', nameEn: '', desc: '', descRu: '', descEn: '', price: '', category: '' })

  const filtered = products.filter(p =>
    p.name.ru.toLowerCase().includes(search.toLowerCase()) ||
    p.name.kk.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ name: '', nameRu: '', nameEn: '', desc: '', descRu: '', descEn: '', price: '', category: '' })
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingProduct(p)
    setForm({ name: p.name.kk, nameRu: p.name.ru, nameEn: p.name.en, desc: p.description.kk, descRu: p.description.ru, descEn: p.description.en, price: p.price.toString(), category: p.category })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.nameRu || !form.price) {
      toast.error('Атауы мен бағасы міндетті')
      return
    }
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: { kk: form.name || form.nameRu, ru: form.nameRu, en: form.nameEn || form.nameRu },
        description: { kk: form.desc || form.descRu, ru: form.descRu, en: form.descEn || form.descRu },
        price: Number(form.price),
        category: form.category,
      } : p))
      toast.success(lang === 'ru' ? 'Товар обновлён' : 'Тауар жаңартылды')
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`, storeId,
        name: { kk: form.name || form.nameRu, ru: form.nameRu, en: form.nameEn || form.nameRu },
        description: { kk: form.desc || form.descRu, ru: form.descRu, en: form.descEn || form.descRu },
        price: Number(form.price),
        category: form.category,
        isAvailable: true, isPopular: false, isNew: true,
      }
      setProducts(prev => [...prev, newProduct])
      toast.success(lang === 'ru' ? 'Товар добавлен' : 'Тауар қосылды')
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm(lang === 'ru' ? 'Удалить товар?' : 'Тауарды жоясыз ба?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
      toast.success(lang === 'ru' ? 'Удалено' : 'Жойылды')
    }
  }

  const toggleAvailable = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p))
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[var(--color-text)]">{t.store.products}</h1>
        <Button onClick={openAdd}>
          <Plus size={16} />
          {t.store.add_product}
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder={t.common.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Products table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_2fr_1fr_1fr_auto] gap-4 px-4 py-3 border-b border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <span>{t.store.product_name}</span>
          <span>{t.store.product_desc}</span>
          <span>{t.store.product_price}</span>
          <span>{lang === 'kk' ? 'Қолжетімді' : lang === 'ru' ? 'Наличие' : 'Status'}</span>
          <span>{t.admin.action}</span>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(product => (
            <div key={product.id} className="flex md:grid md:grid-cols-[1fr_2fr_1fr_1fr_auto] items-center gap-3 md:gap-4 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-[var(--color-surface-secondary)] rounded-xl flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-text)] truncate">{product.name[lang]}</p>
                  <div className="flex gap-1 mt-0.5">
                    {product.isPopular && <Badge variant="yellow" size="sm">{t.product.popular}</Badge>}
                    {product.isNew && <Badge variant="blue" size="sm">{t.product.new}</Badge>}
                  </div>
                </div>
              </div>
              <p className="hidden md:block text-xs text-[var(--color-text-secondary)] line-clamp-2">{product.description[lang]}</p>
              <p className="font-bold text-[var(--color-text)]">{product.price.toLocaleString()}₸</p>
              <button onClick={() => toggleAvailable(product.id)} className="flex items-center gap-1.5 text-sm">
                {product.isAvailable ? (
                  <><ToggleRight size={20} className="text-[var(--color-primary)]" /><span className="text-[var(--color-primary)] font-medium text-xs">{t.store.available}</span></>
                ) : (
                  <><ToggleLeft size={20} className="text-[var(--color-text-muted)]" /><span className="text-[var(--color-text-muted)] text-xs">{t.store.unavailable}</span></>
                )}
              </button>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-[var(--color-surface-tertiary)] transition-colors text-[var(--color-text-secondary)]">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>{lang === 'kk' ? 'Тауарлар жоқ' : lang === 'ru' ? 'Нет товаров' : 'No products'}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? t.store.edit_product : t.store.add_product} size="lg">
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Атауы (KK)" placeholder="Тауар атауы" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Название (RU) *" placeholder="Название товара" value={form.nameRu} onChange={e => setForm({ ...form, nameRu: e.target.value })} />
            <Input label="Name (EN)" placeholder="Product name" value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} />
            <Input label={`${t.store.product_price} (₸) *`} placeholder="0" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Сипаттама (KK)" placeholder="Сипаттама" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
            <Input label="Описание (RU)" placeholder="Описание" value={form.descRu} onChange={e => setForm({ ...form, descRu: e.target.value })} />
          </div>
          <Input label={t.store.product_category} placeholder="rolls, burgers, pizza..." value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button fullWidth onClick={handleSave}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
