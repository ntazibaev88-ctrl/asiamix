import type { Localized, OrderStatus } from "./types";

// ---- Storefront catalog ----

export interface Category {
  slug: string;
  name: Localized;
}

export interface Product {
  id: number;
  cat: string;
  name: Localized;
  desc: Localized;
  price: number;
  oldPrice?: number;
  tag?: "HIT" | "NEW" | "HOT";
  emoji: string;
}

export const categories: Category[] = [
  { slug: "all", name: { kk: "Барлығы", ru: "Все", en: "All" } },
  { slug: "rolls", name: { kk: "Роллдар", ru: "Роллы", en: "Rolls" } },
  { slug: "burgers", name: { kk: "Бургерлер", ru: "Бургеры", en: "Burgers" } },
  { slug: "pizza", name: { kk: "Пицца", ru: "Пицца", en: "Pizza" } },
  { slug: "wok", name: { kk: "Вок", ru: "Вок", en: "Wok" } },
  { slug: "drinks", name: { kk: "Сусындар", ru: "Напитки", en: "Drinks" } },
];

export const products: Product[] = [
  { id: 1, cat: "rolls", name: { kk: "Филадельфия", ru: "Филадельфия", en: "Philadelphia" }, desc: { kk: "Лосось, кілегей ірімшік, авокадо", ru: "Лосось, сливочный сыр, авокадо", en: "Salmon, cream cheese, avocado" }, price: 2900, tag: "HIT", emoji: "🍱" },
  { id: 2, cat: "rolls", name: { kk: "Дракон", ru: "Дракон", en: "Dragon" }, desc: { kk: "Тунец, авокадо, жапондық сос", ru: "Тунец, авокадо, японский соус", en: "Tuna, avocado, japanese sauce" }, price: 3200, tag: "HOT", emoji: "🍣" },
  { id: 3, cat: "rolls", name: { kk: "Калифорния", ru: "Калифорния", en: "California" }, desc: { kk: "Краб, авокадо, қияр", ru: "Краб, авокадо, огурец", en: "Crab, avocado, cucumber" }, price: 2600, emoji: "🫙" },
  { id: 4, cat: "burgers", name: { kk: "Классик Бургер", ru: "Классик Бургер", en: "Classic Burger" }, desc: { kk: "Сиыр еті, салат, қыша, кетчуп", ru: "Говядина, салат, горчица, кетчуп", en: "Beef, lettuce, mustard, ketchup" }, price: 1800, oldPrice: 2200, tag: "NEW", emoji: "🍔" },
  { id: 5, cat: "burgers", name: { kk: "Чикен Бургер", ru: "Чикен Бургер", en: "Chicken Burger" }, desc: { kk: "Тауық, картофель, сос", ru: "Курица, картофель, соус", en: "Chicken, fries, sauce" }, price: 1600, emoji: "🍗" },
  { id: 6, cat: "pizza", name: { kk: "Маргарита", ru: "Маргарита", en: "Margherita" }, desc: { kk: "Классикалық помидор, моцарелла", ru: "Классические томаты, моцарелла", en: "Tomato, mozzarella" }, price: 2400, emoji: "🍕" },
  { id: 7, cat: "pizza", name: { kk: "Пепперони", ru: "Пепперони", en: "Pepperoni" }, desc: { kk: "Пепперони, моцарелла, итальян шөп", ru: "Пепперони, моцарелла, итальянские травы", en: "Pepperoni, mozzarella, herbs" }, price: 2700, tag: "HIT", emoji: "🍕" },
  { id: 8, cat: "wok", name: { kk: "Тауықты вок", ru: "Вок с курицей", en: "Chicken Wok" }, desc: { kk: "Тауық, нудл, азиаттық сос", ru: "Курица, лапша, азиатский соус", en: "Chicken, noodles, asian sauce" }, price: 2100, tag: "HIT", emoji: "🥢" },
  { id: 9, cat: "wok", name: { kk: "Сиыр етті вок", ru: "Вок с говядиной", en: "Beef Wok" }, desc: { kk: "Сиыр еті, нудл, устрица сосы", ru: "Говядина, лапша, устричный соус", en: "Beef, noodles, oyster sauce" }, price: 2400, emoji: "🥢" },
  { id: 10, cat: "drinks", name: { kk: "Кола 0.5", ru: "Кола 0.5", en: "Cola 0.5" }, desc: { kk: "Суытылған", ru: "Охлаждённая", en: "Chilled" }, price: 400, emoji: "🥤" },
  { id: 11, cat: "drinks", name: { kk: "Апельсин шырыны", ru: "Апельсиновый сок", en: "Orange juice" }, desc: { kk: "Табиғи, 330мл", ru: "Натуральный, 330мл", en: "Fresh, 330ml" }, price: 550, emoji: "🧃" },
];

export const reviews = [
  { name: "Айгерим", rating: 5, text: { kk: "Роллдар өте дәмді, жеткізу жылдам. Тағы тапсырыс беремін!", ru: "Роллы очень вкусные, доставка быстрая. Закажу снова!", en: "Rolls are delicious, fast delivery. Will order again!" } },
  { name: "Дамир", rating: 5, text: { kk: "Бургер тамаша дайындалған. Бағасы да жақсы.", ru: "Бургер отлично приготовлен. Цена тоже хорошая.", en: "Burger was great. Good price too." } },
  { name: "Зарина", rating: 4, text: { kk: "Вок дәмді, аздап күттік. Жалпы жақсы!", ru: "Вок вкусный, немного подождали. В целом хорошо!", en: "Tasty wok, waited a bit. Overall good!" } },
  { name: "Әлібек", rating: 5, text: { kk: "NOMI — менің сүйікті жеткізу сервисім. Ұсынамын!", ru: "NOMI — мой любимый сервис доставки. Рекомендую!", en: "NOMI is my favorite delivery service. Recommended!" } },
];

// ---- Dashboard demo data ----

export interface DemoOrder {
  num: number;
  customer: string;
  store: string;
  items: number;
  total: number;
  status: OrderStatus;
  minsAgo: number;
}

export const demoOrders: DemoOrder[] = [
  { num: 1042, customer: "Айгерим С.", store: "NOMI Sushi", items: 3, total: 8700, status: "pending", minsAgo: 2 },
  { num: 1041, customer: "Дамир К.", store: "Burger Lab", items: 2, total: 3400, status: "accepted", minsAgo: 9 },
  { num: 1040, customer: "Зарина Т.", store: "NOMI Sushi", items: 5, total: 12600, status: "on_the_way", minsAgo: 18 },
  { num: 1039, customer: "Әлібек Н.", store: "Pizza House", items: 1, total: 2700, status: "delivered", minsAgo: 41 },
  { num: 1038, customer: "Мадина О.", store: "Wok Street", items: 4, total: 9200, status: "delivered", minsAgo: 58 },
  { num: 1037, customer: "Тимур А.", store: "Burger Lab", items: 2, total: 3800, status: "cancelled", minsAgo: 72 },
];

export const demoCouriers = [
  { name: "Ерлан Б.", status: "online" as const, deliveries: 14, rating: 4.9, earnings: 18400 },
  { name: "Санжар М.", status: "busy" as const, deliveries: 11, rating: 4.8, earnings: 15200 },
  { name: "Нурлан Т.", status: "online" as const, deliveries: 9, rating: 4.7, earnings: 12600 },
  { name: "Аскар Ж.", status: "offline" as const, deliveries: 0, rating: 4.9, earnings: 0 },
];

export const demoStores = [
  { name: "NOMI Sushi", city: "Алматы", orders: 312, revenue: 2840000, rating: 4.8, commission: 12, active: true },
  { name: "Burger Lab", city: "Астана", orders: 198, revenue: 1120000, rating: 4.6, commission: 15, active: true },
  { name: "Pizza House", city: "Алматы", orders: 154, revenue: 980000, rating: 4.7, commission: 12, active: true },
  { name: "Wok Street", city: "Шымкент", orders: 87, revenue: 540000, rating: 4.5, commission: 15, active: false },
];
