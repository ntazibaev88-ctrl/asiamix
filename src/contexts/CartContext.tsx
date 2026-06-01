'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem, Product } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, storeId: string, storeName: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  storeId: string | null
  storeName: string | null
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('tezi_cart')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch {}
    }
  }, [])

  const persist = (next: CartItem[]) => {
    setItems(next)
    localStorage.setItem('tezi_cart', JSON.stringify(next))
  }

  const storeId = items[0]?.storeId ?? null
  const storeName = items[0]?.storeName ?? null

  const addItem = (product: Product, sid: string, sName: string) => {
    if (storeId && storeId !== sid) {
      if (!confirm('Корзина содержит товары из другого ресторана. Очистить?')) return
      persist([])
    }
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      const next = existing
        ? prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { product, quantity: 1, storeId: sid, storeName: sName }]
      localStorage.setItem('tezi_cart', JSON.stringify(next))
      return next
    })
  }

  const removeItem = (productId: string) => {
    persist(items.filter(i => i.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId)
    persist(items.map(i => i.product.id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => persist([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, storeId, storeName }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
