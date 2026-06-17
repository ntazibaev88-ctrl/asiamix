// Shared domain types for the NOMI Delivery Platform.

export type Locale = "kk" | "ru" | "en";

export type Role = "customer" | "courier" | "store_admin" | "super_admin";

export type OrderStatus =
  | "pending" // new, awaiting store confirmation
  | "accepted" // store accepted, preparing
  | "ready" // ready for pickup
  | "on_the_way" // courier delivering
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cash" | "card" | "kaspi";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type DeliveryType = "delivery" | "pickup";
export type CourierStatus = "online" | "offline" | "busy";

export interface Localized {
  kk: string;
  ru: string;
  en: string;
}

export interface Profile {
  id: string;
  role: Role;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  cityId?: string;
  isBanned?: boolean;
}
