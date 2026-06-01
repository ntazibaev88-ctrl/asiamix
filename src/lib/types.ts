export type Language = 'kk' | 'ru' | 'en'
export type Theme = 'light' | 'dark'
export type Role = 'customer' | 'store' | 'courier' | 'admin'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivering'
  | 'delivered'
  | 'cancelled'

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: Role
  avatar?: string
  createdAt: string
}

export interface Category {
  id: string
  name: { kk: string; ru: string; en: string }
  icon: string
  slug: string
}

export interface Store {
  id: string
  name: string
  description: { kk: string; ru: string; en: string }
  category: string
  logo?: string
  coverImage?: string
  rating: number
  reviewCount: number
  deliveryTime: number
  deliveryFee: number
  minOrder: number
  isOpen: boolean
  address: string
  phone: string
}

export interface Product {
  id: string
  storeId: string
  name: { kk: string; ru: string; en: string }
  description: { kk: string; ru: string; en: string }
  price: number
  originalPrice?: number
  image?: string
  category: string
  isAvailable: boolean
  isPopular: boolean
  isNew: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  storeId: string
  storeName: string
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  storeId: string
  storeName: string
  courierId?: string
  courierName?: string
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  deliveryFee: number
  total: number
  address: string
  phone: string
  paymentMethod: 'cash' | 'card'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
}

export interface Delivery {
  id: string
  orderId: string
  courierId: string
  status: OrderStatus
  pickupAddress: string
  deliveryAddress: string
  distance: number
  earnings: number
  createdAt: string
  completedAt?: string
}
