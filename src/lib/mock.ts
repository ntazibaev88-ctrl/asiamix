import type { Localized, OrderStatus } from "./types";

// ---- Grocery catalog (azyk-tulik) ----

export interface Category {
  slug: string;
  name: Localized;
  emoji: string;
}

export interface Product {
  id: number;
  cat: string;
  name: Localized;
  desc: Localized;
  price: number;
  oldPrice?: number;
  unit: string; // "шт", "кг", "л", ...
  tag?: "HIT" | "NEW" | "SALE";
  emoji: string;
}

export interface Store {
  slug: string;
  name: string;
  address: string;
  /** delivery time range in minutes, e.g. "15–25" */
  time: string;
  rating: number;
  open: boolean;
  emoji: string;
  /** CSS gradient used for the store cover */
  cover: string;
}

export interface Promo {
  id: number;
  badge: string;
  title: Localized;
  oldPrice?: string;
  price: string;
  emoji: string;
  gradient: string;
}

export const categories: Category[] = [
  { slug: "all", name: { kk: "Барлығы", ru: "Все", en: "All" }, emoji: "🛒" },
  { slug: "drinks", name: { kk: "Сусындар", ru: "Напитки", en: "Drinks" }, emoji: "🥤" },
  { slug: "bakery", name: { kk: "Нан", ru: "Хлеб", en: "Bakery" }, emoji: "🍞" },
  { slug: "dairy", name: { kk: "Сүт өнімдері", ru: "Молочное", en: "Dairy" }, emoji: "🥛" },
  { slug: "fruits", name: { kk: "Жеміс-көкөніс", ru: "Фрукты-овощи", en: "Fruits & veg" }, emoji: "🍎" },
  { slug: "snacks", name: { kk: "Тоқаштар", ru: "Снеки", en: "Snacks" }, emoji: "🍫" },
  { slug: "household", name: { kk: "Тазалық", ru: "Бытовое", en: "Household" }, emoji: "🧼" },
];

export const products: Product[] = [
  { id: 1, cat: "drinks", name: { kk: "Coca-Cola 0.5л", ru: "Coca-Cola 0.5л", en: "Coca-Cola 0.5L" }, desc: { kk: "Суытылған", ru: "Охлаждённая", en: "Chilled" }, price: 250, unit: "шт", tag: "HIT", emoji: "🥤" },
  { id: 2, cat: "drinks", name: { kk: "Piko шырыны 1л", ru: "Сок Piko 1л", en: "Piko juice 1L" }, desc: { kk: "Апельсин", ru: "Апельсин", en: "Orange" }, price: 650, unit: "шт", emoji: "🧃" },
  { id: 3, cat: "drinks", name: { kk: "Тұрсын-Ата су 1.5л", ru: "Вода 1.5л", en: "Water 1.5L" }, desc: { kk: "Минералды", ru: "Минеральная", en: "Mineral" }, price: 180, unit: "шт", emoji: "💧" },
  { id: 4, cat: "bakery", name: { kk: "Батон наны", ru: "Батон", en: "Baguette" }, desc: { kk: "Жаңа піскен", ru: "Свежий", en: "Fresh" }, price: 180, unit: "шт", tag: "NEW", emoji: "🍞" },
  { id: 5, cat: "bakery", name: { kk: "Тоқаш", ru: "Булочка", en: "Bun" }, desc: { kk: "Кілегейлі", ru: "Сливочная", en: "Creamy" }, price: 150, unit: "шт", emoji: "🥐" },
  { id: 6, cat: "dairy", name: { kk: "Сүт 1л", ru: "Молоко 1л", en: "Milk 1L" }, desc: { kk: "2.5% майлылық", ru: "2.5% жирность", en: "2.5% fat" }, price: 450, unit: "шт", tag: "HIT", emoji: "🥛" },
  { id: 7, cat: "dairy", name: { kk: "Йогурт", ru: "Йогурт", en: "Yogurt" }, desc: { kk: "Жемісті", ru: "Фруктовый", en: "Fruit" }, price: 320, unit: "шт", emoji: "🥛" },
  { id: 8, cat: "dairy", name: { kk: "Жұмыртқа 10шт", ru: "Яйца 10шт", en: "Eggs 10pc" }, desc: { kk: "С1 категория", ru: "С1 категория", en: "Grade C1" }, price: 980, oldPrice: 1100, unit: "уп", tag: "SALE", emoji: "🥚" },
  { id: 9, cat: "fruits", name: { kk: "Алма 1кг", ru: "Яблоки 1кг", en: "Apples 1kg" }, desc: { kk: "Қызыл", ru: "Красные", en: "Red" }, price: 590, unit: "кг", emoji: "🍎" },
  { id: 10, cat: "fruits", name: { kk: "Банан 1кг", ru: "Бананы 1кг", en: "Bananas 1kg" }, desc: { kk: "Эквадор", ru: "Эквадор", en: "Ecuador" }, price: 750, unit: "кг", tag: "HIT", emoji: "🍌" },
  { id: 11, cat: "fruits", name: { kk: "Қызанақ 1кг", ru: "Помидоры 1кг", en: "Tomatoes 1kg" }, desc: { kk: "Бұрыш", ru: "Грунтовые", en: "Local" }, price: 690, unit: "кг", emoji: "🍅" },
  { id: 12, cat: "snacks", name: { kk: "Шоколад", ru: "Шоколад", en: "Chocolate" }, desc: { kk: "Сүтті", ru: "Молочный", en: "Milk" }, price: 420, unit: "шт", emoji: "🍫" },
  { id: 13, cat: "snacks", name: { kk: "Чипсы Lay's", ru: "Чипсы Lay's", en: "Lay's chips" }, desc: { kk: "Сметана-көк", ru: "Сметана-зелень", en: "Sour cream" }, price: 550, unit: "шт", emoji: "🥔" },
  { id: 14, cat: "household", name: { kk: "Сабын", ru: "Мыло", en: "Soap" }, desc: { kk: "Сұйық", ru: "Жидкое", en: "Liquid" }, price: 380, unit: "шт", emoji: "🧼" },
  { id: 15, cat: "household", name: { kk: "Дәретхана қағазы", ru: "Туалетная бумага", en: "Toilet paper" }, desc: { kk: "8 орам", ru: "8 рулонов", en: "8 rolls" }, price: 1290, unit: "уп", emoji: "🧻" },
];

export const stores: Store[] = [
  { slug: "altyn-orda", name: "Алтын Орда", address: "Аль-Фараби 15/1", time: "15–25", rating: 4.8, open: true, emoji: "🏪", cover: "linear-gradient(135deg,#ff7a45,#e23c1f)" },
  { slug: "capital", name: "Capital", address: "Аль-Фараби 9", time: "20–30", rating: 4.6, open: true, emoji: "🛒", cover: "linear-gradient(135deg,#3a7afe,#1f3fae)" },
  { slug: "magnum", name: "Magnum", address: "Достык 5", time: "25–40", rating: 4.7, open: true, emoji: "🛍️", cover: "linear-gradient(135deg,#18a957,#0c7a3c)" },
  { slug: "arzan", name: "Арзан", address: "Абая 12", time: "30–45", rating: 4.5, open: false, emoji: "🏬", cover: "linear-gradient(135deg,#9a6bff,#5e2fae)" },
];

export const promos: Promo[] = [
  {
    id: 1,
    badge: "ЧМ 2026 Edition",
    title: { kk: "4500₸-дан — Coca-Cola 0.5л ТЕГІН!", ru: "От 4500₸ — Coca-Cola 0.5л БЕСПЛАТНО!", en: "From 4500₸ — free Coca-Cola 0.5L!" },
    oldPrice: "250₸",
    price: "0₸",
    emoji: "🥤",
    gradient: "linear-gradient(135deg,#ff3b30,#b3160d)",
  },
  {
    id: 2,
    badge: "NOMI PLUS",
    title: { kk: "5000₸-нан жеткізу ТЕГІН", ru: "Доставка БЕСПЛАТНО от 5000₸", en: "Free delivery from 5000₸" },
    price: "0₸",
    emoji: "🚀",
    gradient: "linear-gradient(135deg,#ff7a45,#e23c1f)",
  },
  {
    id: 3,
    badge: "Cashback",
    title: { kk: "Әр тапсырыстан 5% кэшбэк", ru: "5% кэшбэк с каждого заказа", en: "5% cashback on every order" },
    price: "+5%",
    emoji: "💰",
    gradient: "linear-gradient(135deg,#18a957,#0c7a3c)",
  },
];

export const reviews = [
  { name: "Айгерим", rating: 5, text: { kk: "Тауарлар жаңа, жеткізу жылдам. Рахмет!", ru: "Продукты свежие, доставка быстрая. Спасибо!", en: "Fresh products, fast delivery. Thanks!" } },
  { name: "Дамир", rating: 5, text: { kk: "Бағасы дүкендегідей, әрі үйге жеткізеді.", ru: "Цены как в магазине, да ещё и домой везут.", en: "Prices like in store, delivered home." } },
  { name: "Зарина", rating: 4, text: { kk: "Ыңғайлы қосымша, кейде күттіреді.", ru: "Удобное приложение, иногда ждём.", en: "Convenient app, sometimes a wait." } },
  { name: "Әлібек", rating: 5, text: { kk: "NOMI — түнде де ашық дүкен табамын!", ru: "NOMI — нахожу магазин даже ночью!", en: "NOMI — I find an open store even at night!" } },
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
  { num: 1042, customer: "Айгерим С.", store: "Алтын Орда", items: 8, total: 6700, status: "pending", minsAgo: 2 },
  { num: 1041, customer: "Дамир К.", store: "Capital", items: 4, total: 3400, status: "accepted", minsAgo: 9 },
  { num: 1040, customer: "Зарина Т.", store: "Алтын Орда", items: 12, total: 12600, status: "on_the_way", minsAgo: 18 },
  { num: 1039, customer: "Әлібек Н.", store: "Magnum", items: 3, total: 2700, status: "delivered", minsAgo: 41 },
  { num: 1038, customer: "Мадина О.", store: "Capital", items: 9, total: 9200, status: "delivered", minsAgo: 58 },
  { num: 1037, customer: "Тимур А.", store: "Арзан", items: 2, total: 1800, status: "cancelled", minsAgo: 72 },
];

export const demoCouriers = [
  { name: "Ерлан Б.", status: "online" as const, deliveries: 14, rating: 4.9, earnings: 18400 },
  { name: "Санжар М.", status: "busy" as const, deliveries: 11, rating: 4.8, earnings: 15200 },
  { name: "Нурлан Т.", status: "online" as const, deliveries: 9, rating: 4.7, earnings: 12600 },
  { name: "Аскар Ж.", status: "offline" as const, deliveries: 0, rating: 4.9, earnings: 0 },
];

export const demoStores = [
  { name: "Алтын Орда", city: "Алматы", orders: 312, revenue: 2840000, rating: 4.8, commission: 12, active: true },
  { name: "Capital", city: "Астана", orders: 198, revenue: 1120000, rating: 4.6, commission: 15, active: true },
  { name: "Magnum", city: "Алматы", orders: 154, revenue: 980000, rating: 4.7, commission: 12, active: true },
  { name: "Арзан", city: "Шымкент", orders: 87, revenue: 540000, rating: 4.5, commission: 15, active: false },
];
