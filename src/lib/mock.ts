import type { Localized, OrderStatus } from "./types";

// ============================================================================
// NOMI catalog — Рядом/Choco-style category tree shared across stores.
// Groups -> categories (tiles) -> products. Each store carries this catalog;
// per-store availability/price is managed in the (isolated) store admin panel.
// ============================================================================

export interface CatalogGroup {
  key: string;
  name: Localized;
}

export interface Category {
  slug: string;
  group: string;
  name: Localized;
  emoji: string;
}

export interface Product {
  id: number;
  cat: string;
  name: Localized;
  price: number;
  oldPrice?: number;
  unit: string;
  tag?: "HIT" | "NEW" | "SALE";
  emoji: string;
}

export interface Store {
  slug: string;
  name: string;
  address: string;
  time: string;
  rating: number;
  open: boolean;
  emoji: string;
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

export const catalogGroups: CatalogGroup[] = [
  { key: "dairy", name: { kk: "Сүт, ірімшік, жұмыртқа", ru: "Молочное, сыры, яйца", en: "Dairy & eggs" } },
  { key: "bakery", name: { kk: "Нан, тоқаш", ru: "Хлеб, выпечка", en: "Bakery" } },
  { key: "produce", name: { kk: "Жеміс-көкөніс", ru: "Фрукты, овощи", en: "Fruits & veg" } },
  { key: "drinks", name: { kk: "Су, сусын, шырын", ru: "Вода, напитки, соки", en: "Drinks" } },
  { key: "coffee", name: { kk: "Кофе, шай", ru: "Кофе, чай", en: "Coffee & tea" } },
  { key: "grocery", name: { kk: "Бакалея", ru: "Бакалея", en: "Grocery" } },
  { key: "sweets", name: { kk: "Тәтті, снек", ru: "Сладкое, снеки", en: "Sweets & snacks" } },
  { key: "meat", name: { kk: "Ет, балық", ru: "Мясо, рыба", en: "Meat & fish" } },
  { key: "frozen", name: { kk: "Шұжық, мұздатылған", ru: "Колбасы, заморозка", en: "Sausages & frozen" } },
  { key: "baby", name: { kk: "Балаларға", ru: "Детям", en: "For kids" } },
  { key: "hygiene", name: { kk: "Гигиена", ru: "Гигиена", en: "Hygiene" } },
  { key: "home", name: { kk: "Үй, химия", ru: "Дом, бытовая химия", en: "Home & chemicals" } },
  { key: "pets", name: { kk: "Жануарларға", ru: "Для животных", en: "For pets" } },
  { key: "misc", name: { kk: "Пайдалы ұсақ-түйек", ru: "Полезные мелочи", en: "Handy items" } },
];

export const categories: Category[] = [
  // dairy
  { slug: "dairy", group: "dairy", emoji: "🥛", name: { kk: "Сүт өнімдері", ru: "Молочная продукция", en: "Dairy" } },
  { slug: "cheese", group: "dairy", emoji: "🧀", name: { kk: "Ірімшік", ru: "Сыры", en: "Cheese" } },
  { slug: "eggs", group: "dairy", emoji: "🥚", name: { kk: "Жұмыртқа", ru: "Яйца", en: "Eggs" } },
  { slug: "icecream", group: "dairy", emoji: "🍦", name: { kk: "Балмұздақ", ru: "Мороженое", en: "Ice cream" } },
  // bakery
  { slug: "bread", group: "bakery", emoji: "🍞", name: { kk: "Нан", ru: "Хлеб", en: "Bread" } },
  { slug: "pastry", group: "bakery", emoji: "🥐", name: { kk: "Тоқаш", ru: "Выпечка", en: "Pastry" } },
  // produce
  { slug: "fruits", group: "produce", emoji: "🍎", name: { kk: "Жеміс-жидек", ru: "Фрукты, ягоды", en: "Fruits" } },
  { slug: "veg", group: "produce", emoji: "🥦", name: { kk: "Көкөніс", ru: "Овощи, зелень", en: "Vegetables" } },
  { slug: "nuts", group: "produce", emoji: "🥜", name: { kk: "Жаңғақ, кепкен жеміс", ru: "Орехи, сухофрукты", en: "Nuts & dried" } },
  // drinks
  { slug: "water", group: "drinks", emoji: "💧", name: { kk: "Су", ru: "Вода", en: "Water" } },
  { slug: "soda", group: "drinks", emoji: "🥤", name: { kk: "Газдалған", ru: "Газировка", en: "Soda" } },
  { slug: "juice", group: "drinks", emoji: "🧃", name: { kk: "Шырын", ru: "Соки", en: "Juice" } },
  { slug: "energy", group: "drinks", emoji: "⚡", name: { kk: "Энергетик", ru: "Энергетики", en: "Energy" } },
  // coffee
  { slug: "coffee", group: "coffee", emoji: "☕", name: { kk: "Кофе", ru: "Кофе", en: "Coffee" } },
  { slug: "tea", group: "coffee", emoji: "🍵", name: { kk: "Шай", ru: "Чай", en: "Tea" } },
  // grocery
  { slug: "pasta", group: "grocery", emoji: "🍝", name: { kk: "Макарон, жарма", ru: "Макароны, крупы", en: "Pasta & grains" } },
  { slug: "oil", group: "grocery", emoji: "🫒", name: { kk: "Май, соус, дәмдеуіш", ru: "Масло, соусы, специи", en: "Oil & sauces" } },
  { slug: "canned", group: "grocery", emoji: "🥫", name: { kk: "Консерв", ru: "Консервы", en: "Canned" } },
  // sweets
  { slug: "choco", group: "sweets", emoji: "🍫", name: { kk: "Шоколад, кәмпит", ru: "Шоколад, конфеты", en: "Chocolate" } },
  { slug: "snacks", group: "sweets", emoji: "🥔", name: { kk: "Снек, чипсы", ru: "Снеки, чипсы", en: "Snacks" } },
  { slug: "cookies", group: "sweets", emoji: "🍪", name: { kk: "Печенье", ru: "Печенье", en: "Cookies" } },
  // meat
  { slug: "meat", group: "meat", emoji: "🥩", name: { kk: "Ет, құс", ru: "Мясо, птица", en: "Meat" } },
  { slug: "fish", group: "meat", emoji: "🐟", name: { kk: "Балық", ru: "Рыба", en: "Fish" } },
  // frozen
  { slug: "sausage", group: "frozen", emoji: "🌭", name: { kk: "Шұжық", ru: "Колбасы, сосиски", en: "Sausages" } },
  { slug: "frozen", group: "frozen", emoji: "🧊", name: { kk: "Мұздатылған", ru: "Заморозка", en: "Frozen" } },
  // baby
  { slug: "babyfood", group: "baby", emoji: "🍼", name: { kk: "Балалар тағамы", ru: "Детское питание", en: "Baby food" } },
  { slug: "babycare", group: "baby", emoji: "🧸", name: { kk: "Бала күтімі", ru: "Уход за детьми", en: "Baby care" } },
  // hygiene
  { slug: "paper", group: "hygiene", emoji: "🧻", name: { kk: "Қағаз, майлық", ru: "Бумага, салфетки", en: "Paper" } },
  { slug: "hair", group: "hygiene", emoji: "🧴", name: { kk: "Шаш күтімі", ru: "Уход за волосами", en: "Hair care" } },
  { slug: "oral", group: "hygiene", emoji: "🪥", name: { kk: "Ауыз күтімі", ru: "Уход за полостью рта", en: "Oral care" } },
  { slug: "personal", group: "hygiene", emoji: "🧼", name: { kk: "Жеке гигиена", ru: "Личная гигиена", en: "Personal" } },
  { slug: "pharmacy", group: "hygiene", emoji: "🩹", name: { kk: "Дәріхана", ru: "Аптечка", en: "Pharmacy" } },
  // home & chemicals
  { slug: "laundry", group: "home", emoji: "🧺", name: { kk: "Кір жуу", ru: "Стирка", en: "Laundry" } },
  { slug: "cleaning", group: "home", emoji: "🧽", name: { kk: "Тазалау құралдары", ru: "Уборка", en: "Cleaning" } },
  { slug: "chemicals", group: "home", emoji: "🧴", name: { kk: "Үй химиясы", ru: "Бытовая химия", en: "Household chemicals" } },
  // pets
  { slug: "cats", group: "pets", emoji: "🐱", name: { kk: "Мысыққа", ru: "Для кошек", en: "Cats" } },
  { slug: "dogs", group: "pets", emoji: "🐶", name: { kk: "Итке", ru: "Для собак", en: "Dogs" } },
  // misc
  { slug: "battery", group: "misc", emoji: "🔋", name: { kk: "Батарейка, шам", ru: "Батарейки, лампы", en: "Batteries" } },
  { slug: "stationery", group: "misc", emoji: "✏️", name: { kk: "Кеңсе тауары", ru: "Канцтовары", en: "Stationery" } },
];

const p = (
  id: number,
  cat: string,
  kk: string,
  ru: string,
  en: string,
  price: number,
  unit: string,
  emoji: string,
  extra?: { oldPrice?: number; tag?: Product["tag"] },
): Product => ({ id, cat, name: { kk, ru, en }, price, unit, emoji, ...extra });

export const products: Product[] = [
  // dairy
  p(1, "dairy", "Сүт 1л", "Молоко 1л", "Milk 1L", 450, "шт", "🥛", { tag: "HIT" }),
  p(2, "dairy", "Айран 0.5л", "Айран 0.5л", "Ayran 0.5L", 280, "шт", "🥛"),
  p(3, "dairy", "Сметана 20%", "Сметана 20%", "Sour cream", 520, "шт", "🥛"),
  p(4, "cheese", "Ірімшік Гауда", "Сыр Гауда", "Gouda cheese", 1890, "кг", "🧀"),
  p(5, "cheese", "Сүзбе 5%", "Творог 5%", "Cottage cheese", 640, "шт", "🧀"),
  p(6, "eggs", "Жұмыртқа 10шт", "Яйца 10шт", "Eggs 10pc", 980, "уп", "🥚", { oldPrice: 1100, tag: "SALE" }),
  p(7, "icecream", "Балмұздақ Пломбир", "Мороженое Пломбир", "Ice cream", 350, "шт", "🍦"),
  // bakery
  p(8, "bread", "Батон наны", "Батон", "Baguette", 180, "шт", "🍞", { tag: "NEW" }),
  p(9, "bread", "Қара нан", "Хлеб тёмный", "Dark bread", 220, "шт", "🍞"),
  p(10, "pastry", "Тоқаш кілегейлі", "Булочка сливочная", "Cream bun", 150, "шт", "🥐"),
  // produce
  p(11, "fruits", "Алма 1кг", "Яблоки 1кг", "Apples 1kg", 590, "кг", "🍎"),
  p(12, "fruits", "Банан 1кг", "Бананы 1кг", "Bananas 1kg", 750, "кг", "🍌", { tag: "HIT" }),
  p(13, "veg", "Қызанақ 1кг", "Помидоры 1кг", "Tomatoes 1kg", 690, "кг", "🍅"),
  p(14, "veg", "Картоп 1кг", "Картофель 1кг", "Potato 1kg", 220, "кг", "🥔"),
  p(15, "nuts", "Кешью 200г", "Кешью 200г", "Cashew 200g", 1450, "уп", "🥜"),
  // drinks
  p(16, "soda", "Coca-Cola 0.5л", "Coca-Cola 0.5л", "Coca-Cola 0.5L", 250, "шт", "🥤", { tag: "HIT" }),
  p(17, "water", "Тұрсын су 1.5л", "Вода 1.5л", "Water 1.5L", 180, "шт", "💧"),
  p(18, "juice", "Piko шырыны 1л", "Сок Piko 1л", "Piko juice 1L", 650, "шт", "🧃"),
  p(19, "energy", "Flash энергетик", "Flash энергетик", "Flash energy", 420, "шт", "⚡"),
  // coffee
  p(20, "coffee", "Кофе Jacobs 100г", "Кофе Jacobs 100г", "Coffee 100g", 1990, "уп", "☕"),
  p(21, "tea", "Шай Lipton 25п", "Чай Lipton 25п", "Tea Lipton", 890, "уп", "🍵"),
  // grocery
  p(22, "pasta", "Макарон 400г", "Макароны 400г", "Pasta 400g", 320, "уп", "🍝"),
  p(23, "pasta", "Күріш 1кг", "Рис 1кг", "Rice 1kg", 690, "кг", "🍚"),
  p(24, "oil", "Күнбағыс майы 1л", "Масло подсолнечное 1л", "Sunflower oil", 850, "шт", "🫒"),
  p(25, "canned", "Тушёнка 325г", "Тушёнка 325г", "Stew 325g", 1290, "шт", "🥫"),
  // sweets
  p(26, "choco", "Шоколад Рахат", "Шоколад Рахат", "Chocolate", 420, "шт", "🍫"),
  p(27, "snacks", "Чипсы Lay's", "Чипсы Lay's", "Lay's chips", 550, "шт", "🥔"),
  p(28, "cookies", "Печенье Юбилейное", "Печенье Юбилейное", "Cookies", 380, "уп", "🍪"),
  // meat
  p(29, "meat", "Тауық еті 1кг", "Курица 1кг", "Chicken 1kg", 1290, "кг", "🍗", { tag: "HIT" }),
  p(30, "meat", "Сиыр еті 1кг", "Говядина 1кг", "Beef 1kg", 3490, "кг", "🥩"),
  p(31, "fish", "Лосось филе", "Лосось филе", "Salmon fillet", 4990, "кг", "🐟"),
  // frozen
  p(32, "sausage", "Шұжық сүрленген", "Колбаса копчёная", "Smoked sausage", 1890, "кг", "🌭"),
  p(33, "frozen", "Пельмень 800г", "Пельмени 800г", "Dumplings 800g", 1690, "уп", "🥟"),
  // baby
  p(34, "babyfood", "Нәресте пюресі", "Детское пюре", "Baby puree", 320, "шт", "🍼"),
  p(35, "babycare", "Жөргек Tomiko", "Подгузники Tomiko", "Diapers", 3990, "уп", "🧸"),
  // hygiene
  p(36, "paper", "Дәретхана қағазы 8", "Туалетная бумага 8", "Toilet paper 8", 1290, "уп", "🧻"),
  p(37, "hair", "Шампунь Head&Sh.", "Шампунь Head&Sh.", "Shampoo", 1690, "шт", "🧴"),
  p(38, "oral", "Тіс пастасы", "Зубная паста", "Toothpaste", 690, "шт", "🪥"),
  p(39, "personal", "Сабын Dove", "Мыло Dove", "Soap Dove", 480, "шт", "🧼"),
  p(40, "pharmacy", "Лейкопластырь", "Лейкопластырь", "Plasters", 290, "уп", "🩹"),
  // home & household chemicals (химия)
  p(41, "laundry", "Кір ұнтағы Tide 3кг", "Порошок Tide 3кг", "Tide powder 3kg", 3290, "уп", "🧺", { tag: "SALE", oldPrice: 3890 }),
  p(42, "laundry", "Гель капсула Ariel", "Капсулы Ariel", "Ariel pods", 4490, "уп", "🧺"),
  p(43, "cleaning", "Ыдыс жуғыш Fairy", "Fairy для посуды", "Fairy dish soap", 990, "шт", "🧽", { tag: "HIT" }),
  p(44, "cleaning", "Еден жуғыш Mr.Proper", "Mr.Proper для пола", "Floor cleaner", 1190, "шт", "🧽"),
  p(45, "chemicals", "Domestos 1л", "Domestos 1л", "Domestos 1L", 1490, "шт", "🧴"),
  p(46, "chemicals", "Терезе жуғыш", "Средство для окон", "Glass cleaner", 890, "шт", "🧴"),
  // pets
  p(47, "cats", "Мысық жемі Whiskas", "Корм Whiskas", "Cat food", 380, "шт", "🐱"),
  p(48, "dogs", "Ит жемі Pedigree", "Корм Pedigree", "Dog food", 520, "шт", "🐶"),
  // misc
  p(49, "battery", "Батарейка AA 4шт", "Батарейки AA 4шт", "AA batteries", 690, "уп", "🔋"),
  p(50, "battery", "LED шам 9W", "Лампа LED 9W", "LED bulb 9W", 790, "шт", "💡"),
  p(51, "stationery", "Қалам көк", "Ручка синяя", "Pen blue", 120, "шт", "🖊️"),
];

/** Catalog visible in a given store. Demo: every store carries the full
 *  catalog; in production this is the store's own product table. */
export function productsForStore(_slug: string): Product[] {
  return products;
}

export const stores: Store[] = [
  { slug: "altyn-orda", name: "Алтын Орда", address: "Аль-Фараби 15/1", time: "15–25", rating: 4.8, open: true, emoji: "🏪", cover: "linear-gradient(135deg,#ff7a45,#e23c1f)" },
  { slug: "capital", name: "Capital", address: "Аль-Фараби 9", time: "20–30", rating: 4.6, open: true, emoji: "🛒", cover: "linear-gradient(135deg,#3a7afe,#1f3fae)" },
];

export const promos: Promo[] = [
  { id: 1, badge: "ЧМ 2026 Edition", title: { kk: "4500₸-дан — Coca-Cola 0.5л ТЕГІН!", ru: "От 4500₸ — Coca-Cola 0.5л БЕСПЛАТНО!", en: "From 4500₸ — free Coca-Cola 0.5L!" }, oldPrice: "250₸", price: "0₸", emoji: "🥤", gradient: "linear-gradient(135deg,#ff3b30,#b3160d)" },
  { id: 2, badge: "NOMI PLUS", title: { kk: "5000₸-нан жеткізу ТЕГІН", ru: "Доставка БЕСПЛАТНО от 5000₸", en: "Free delivery from 5000₸" }, price: "0₸", emoji: "🚀", gradient: "linear-gradient(135deg,#ff7a45,#e23c1f)" },
  { id: 3, badge: "Cashback", title: { kk: "Әр тапсырыстан 5% кэшбэк", ru: "5% кэшбэк с каждого заказа", en: "5% cashback on every order" }, price: "+5%", emoji: "💰", gradient: "linear-gradient(135deg,#18a957,#0c7a3c)" },
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
  { num: 1039, customer: "Әлібек Н.", store: "Capital", items: 3, total: 2700, status: "delivered", minsAgo: 41 },
  { num: 1038, customer: "Мадина О.", store: "Алтын Орда", items: 9, total: 9200, status: "delivered", minsAgo: 58 },
  { num: 1037, customer: "Тимур А.", store: "Capital", items: 2, total: 1800, status: "cancelled", minsAgo: 72 },
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
];
