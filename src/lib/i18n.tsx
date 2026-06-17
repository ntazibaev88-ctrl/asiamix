"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Locale } from "./types";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "kk", label: "ҚАЗ" },
  { code: "ru", label: "РУС" },
  { code: "en", label: "ENG" },
];

type Dict = Record<string, { kk: string; ru: string; en: string }>;

// Flat key -> translations. Keep keys grouped by area with a prefix.
const DICT: Dict = {
  // Common
  "common.cart": { kk: "Себет", ru: "Корзина", en: "Cart" },
  "common.search": { kk: "Іздеу", ru: "Поиск", en: "Search" },
  "common.total": { kk: "Жалпы", ru: "Итого", en: "Total" },
  "common.delivery": { kk: "Жеткізу", ru: "Доставка", en: "Delivery" },
  "common.pickup": { kk: "Өзі алу", ru: "Самовывоз", en: "Pickup" },
  "common.checkout": { kk: "Тапсырыс беру", ru: "Оформить заказ", en: "Checkout" },
  "common.confirm": { kk: "Растау", ru: "Подтвердить", en: "Confirm" },
  "common.back": { kk: "Артқа", ru: "Назад", en: "Back" },
  "common.signin": { kk: "Кіру", ru: "Войти", en: "Sign in" },
  "common.signout": { kk: "Шығу", ru: "Выйти", en: "Sign out" },
  "common.empty": { kk: "Бос", ru: "Пусто", en: "Empty" },
  "common.online": { kk: "Желіде", ru: "Онлайн", en: "Online" },
  "common.offline": { kk: "Желіден тыс", ru: "Офлайн", en: "Offline" },
  "common.today": { kk: "Бүгін", ru: "Сегодня", en: "Today" },

  // Storefront
  "store.hero.cta": { kk: "Мәзірді ашу", ru: "Открыть меню", en: "Browse menu" },
  "store.menu": { kk: "Мәзір", ru: "Меню", en: "Menu" },
  "store.reviews": { kk: "Пікірлер", ru: "Отзывы", en: "Reviews" },
  "store.add": { kk: "Қосу", ru: "Добавить", en: "Add" },
  "store.cartEmpty": { kk: "Себет бос", ru: "Корзина пуста", en: "Your cart is empty" },
  "store.name": { kk: "Атыңыз", ru: "Ваше имя", en: "Your name" },
  "store.phone": { kk: "Телефон", ru: "Телефон", en: "Phone" },
  "store.address": { kk: "Мекенжай", ru: "Адрес", en: "Address" },
  "store.payment": { kk: "Төлем", ru: "Оплата", en: "Payment" },
  "store.cash": { kk: "Қолма-қол", ru: "Наличные", en: "Cash" },
  "store.card": { kk: "Картамен", ru: "Картой", en: "Card" },
  "store.orderPlaced": { kk: "Тапсырыс қабылданды!", ru: "Заказ принят!", en: "Order placed!" },
  "store.orderPlacedDesc": {
    kk: "Оператор сізге жақын арада хабарласады",
    ru: "Оператор свяжется с вами в ближайшее время",
    en: "An operator will contact you shortly",
  },
  "store.ok": { kk: "Жарайды", ru: "Хорошо", en: "OK" },

  // Shop (grocery marketplace)
  "shop.tab.home": { kk: "Басты", ru: "Главная", en: "Home" },
  "shop.tab.stores": { kk: "Дүкен", ru: "Магазины", en: "Stores" },
  "shop.tab.favorites": { kk: "Таңдаулы", ru: "Избранное", en: "Favorites" },
  "shop.tab.cart": { kk: "Себет", ru: "Корзина", en: "Cart" },
  "shop.tab.orders": { kk: "Заказдар", ru: "Заказы", en: "Orders" },
  "shop.tab.profile": { kk: "Профиль", ru: "Профиль", en: "Profile" },
  "shop.stores": { kk: "Дүкендер", ru: "Магазины", en: "Stores" },
  "shop.all": { kk: "Барлығы", ru: "Все", en: "All" },
  "shop.open": { kk: "Ашық", ru: "Открыто", en: "Open" },
  "shop.closed": { kk: "Жабық", ru: "Закрыто", en: "Closed" },
  "shop.min": { kk: "мин", ru: "мин", en: "min" },
  "shop.searchStores": { kk: "Дүкен іздеу…", ru: "Поиск магазина…", en: "Search stores…" },
  "shop.searchProducts": { kk: "Тауар іздеу…", ru: "Поиск товара…", en: "Search products…" },
  "shop.deliveryTo": { kk: "Жеткізу", ru: "Доставка в", en: "Delivery to" },
  "shop.toStore": { kk: "Дүкенге кіру", ru: "В магазин", en: "Enter store" },
  "shop.favEmpty": { kk: "Таңдаулы дүкендер жоқ", ru: "Нет избранных магазинов", en: "No favorite stores yet" },
  "shop.ordersEmpty": { kk: "Әзірге тапсырыс жоқ", ru: "Заказов пока нет", en: "No orders yet" },
  "shop.repeat": { kk: "Қайталау", ru: "Повторить", en: "Reorder" },
  "shop.goShopping": { kk: "Сатып алуды бастау", ru: "За покупками", en: "Start shopping" },
  "shop.guest": { kk: "Қонақ", ru: "Гость", en: "Guest" },
  "shop.settings": { kk: "Баптаулар", ru: "Настройки", en: "Settings" },
  "shop.theme": { kk: "Тема", ru: "Тема", en: "Theme" },
  "shop.language": { kk: "Тіл", ru: "Язык", en: "Language" },
  "shop.portals": { kk: "Қызметкер порталдары", ru: "Порталы сотрудников", en: "Staff portals" },
  "shop.items": { kk: "тауар", ru: "товаров", en: "items" },
  "shop.catalog": { kk: "Каталог", ru: "Каталог", en: "Catalog" },
  "shop.categories": { kk: "Категориялар", ru: "Категории", en: "Categories" },
  "shop.nothingFound": { kk: "Ештеңе табылмады", ru: "Ничего не найдено", en: "Nothing found" },
  "shop.favStores": { kk: "Таңдаулы дүкендер", ru: "Избранные магазины", en: "Favorite stores" },
  "shop.favProducts": { kk: "Таңдаулы тауарлар", ru: "Избранные товары", en: "Favorite products" },

  // Store featured slider
  "store.hits": { kk: "Хиттер мен жеңілдіктер 🔥", ru: "Хиты и скидки 🔥", en: "Hits & discounts 🔥" },
  "shop.specialOffers": { kk: "Арнайы ұсыныстар", ru: "Специальные предложения", en: "Special offers" },

  // Product detail
  "product.per100": { kk: "100 грамға", ru: "На 100 грамм", en: "Per 100 g" },
  "product.kcal": { kk: "ккал", ru: "ккал", en: "kcal" },
  "product.protein": { kk: "ақуыз", ru: "белки", en: "protein" },
  "product.fat": { kk: "майлар", ru: "жиры", en: "fat" },
  "product.carbs": { kk: "көмірсу", ru: "углеводы", en: "carbs" },
  "product.weight": { kk: "Салмағы", ru: "Вес", en: "Weight" },
  "product.description": { kk: "Сипаттама", ru: "Описание", en: "Description" },

  // Login / store admin
  "login.storeAdmin": { kk: "Дүкен админі", ru: "Админ магазина", en: "Store admin" },

  // Customer auth
  "auth.login": { kk: "Кіру", ru: "Вход", en: "Sign in" },
  "auth.register": { kk: "Тіркелу", ru: "Регистрация", en: "Register" },
  "auth.name": { kk: "Атыңыз", ru: "Имя", en: "Name" },
  "auth.phone": { kk: "Телефон", ru: "Телефон", en: "Phone" },
  "auth.doLogin": { kk: "Кіру", ru: "Войти", en: "Sign in" },
  "auth.doRegister": { kk: "Аккаунт құру", ru: "Создать аккаунт", en: "Create account" },
  "auth.welcome": { kk: "NOMI-ге қош келдіңіз", ru: "Добро пожаловать в NOMI", en: "Welcome to NOMI" },
  "auth.subtitle": { kk: "Телефон арқылы кіріңіз", ru: "Войдите по номеру телефона", en: "Sign in with your phone" },

  // Profile / loyalty
  "profile.rating": { kk: "Рейтинг", ru: "Рейтинг", en: "Rating" },
  "profile.points": { kk: "Ұпай", ru: "Баллы", en: "Points" },
  "profile.cashback": { kk: "Кэшбэк", ru: "Кэшбэк", en: "Cashback" },

  // Roles / portals
  "role.customer": { kk: "Клиент", ru: "Клиент", en: "Customer" },
  "role.courier": { kk: "Курьер", ru: "Курьер", en: "Courier" },
  "role.store": { kk: "Дүкен", ru: "Магазин", en: "Store" },
  "role.admin": { kk: "Супер админ", ru: "Супер админ", en: "Super admin" },
  "portal.title": { kk: "NOMI порталдары", ru: "Порталы NOMI", en: "NOMI portals" },

  // Dashboard nav
  "nav.dashboard": { kk: "Басты бет", ru: "Главная", en: "Dashboard" },
  "nav.orders": { kk: "Тапсырыстар", ru: "Заказы", en: "Orders" },
  "nav.products": { kk: "Тауарлар", ru: "Товары", en: "Products" },
  "nav.earnings": { kk: "Табыс", ru: "Доход", en: "Earnings" },
  "nav.balance": { kk: "Баланс", ru: "Баланс", en: "Balance" },
  "nav.users": { kk: "Пайдаланушылар", ru: "Пользователи", en: "Users" },
  "nav.couriers": { kk: "Курьерлер", ru: "Курьеры", en: "Couriers" },
  "nav.stores": { kk: "Дүкендер", ru: "Магазины", en: "Stores" },
  "nav.analytics": { kk: "Аналитика", ru: "Аналитика", en: "Analytics" },
  "nav.finance": { kk: "Қаржы", ru: "Финансы", en: "Finance" },

  // Dashboard widgets
  "dash.revenue": { kk: "Түсім", ru: "Выручка", en: "Revenue" },
  "dash.ordersCount": { kk: "Тапсырыстар", ru: "Заказы", en: "Orders" },
  "dash.avgCheck": { kk: "Орташа чек", ru: "Средний чек", en: "Avg. check" },
  "dash.rating": { kk: "Рейтинг", ru: "Рейтинг", en: "Rating" },
  "dash.recentOrders": { kk: "Соңғы тапсырыстар", ru: "Последние заказы", en: "Recent orders" },
  "dash.deliveriesToday": { kk: "Бүгінгі жеткізулер", ru: "Доставок сегодня", en: "Deliveries today" },
  "dash.activeCouriers": { kk: "Белсенді курьерлер", ru: "Активных курьеров", en: "Active couriers" },
  "dash.commission": { kk: "Комиссия", ru: "Комиссия", en: "Commission" },
  "dash.withdraw": { kk: "Шығаруға өтінім", ru: "Вывод средств", en: "Withdraw" },
  "dash.addProduct": { kk: "Тауар қосу", ru: "Добавить товар", en: "Add product" },
  "dash.goOnline": { kk: "Желіге шығу", ru: "Выйти онлайн", en: "Go online" },
  "dash.goOffline": { kk: "Желіден шығу", ru: "Уйти офлайн", en: "Go offline" },
  "dash.acceptOrder": { kk: "Қабылдау", ru: "Принять", en: "Accept" },

  // Order statuses
  "status.pending": { kk: "Жаңа", ru: "Новый", en: "Pending" },
  "status.accepted": { kk: "Дайындалуда", ru: "Готовится", en: "Preparing" },
  "status.ready": { kk: "Дайын", ru: "Готов", en: "Ready" },
  "status.on_the_way": { kk: "Жолда", ru: "В пути", en: "On the way" },
  "status.delivered": { kk: "Жеткізілді", ru: "Доставлен", en: "Delivered" },
  "status.cancelled": { kk: "Бас тартылды", ru: "Отменён", en: "Cancelled" },

  // Login
  "login.subtitle": {
    kk: "Рөліңізді таңдап, порталға кіріңіз",
    ru: "Выберите роль и войдите в портал",
    en: "Pick a role and enter the portal",
  },
  "login.demoNote": {
    kk: "Демо режимі — Supabase авторизациясы дайын болғанша",
    ru: "Демо-режим — пока подключается авторизация Supabase",
    en: "Demo mode — until Supabase auth is wired up",
  },
  "login.enter": { kk: "Кіру", ru: "Войти как", en: "Enter as" },
};

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: keyof typeof DICT | string) => string;
}

const STORAGE_KEY = "nomi.locale";

// External store for the active locale, read via useSyncExternalStore so the
// persisted value is picked up on the client without syncing state in effects.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Locale {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s === "kk" || s === "ru" || s === "en") return s;
  } catch {
    /* storage unavailable */
  }
  return "ru";
}

function getServerSnapshot(): Locale {
  return "ru";
}

/** Kept for API stability / future provider-level concerns. */
export function I18nProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useI18n(): I18nValue {
  const locale = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setLocale = useCallback((l: Locale) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
    document.documentElement.lang = l;
    listeners.forEach((fn) => fn());
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = DICT[key];
      return entry ? entry[locale] : key;
    },
    [locale],
  );

  return { locale, setLocale, t };
}
