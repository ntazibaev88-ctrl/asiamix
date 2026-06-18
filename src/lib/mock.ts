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

export interface Nutrition {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
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
  rating: number;
  desc: Localized;
  brand?: string;
  weight?: string;
  nutrition?: Nutrition;
  /** EAN/barcode used to fetch a real photo from Open Food Facts */
  barcode?: string;
  /** Explicit image URL (overrides barcode lookup) */
  image?: string;
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
  /** square logo (512×512) — falls back to the emoji on the cover */
  logo?: string;
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

interface ProductExtra {
  oldPrice?: number;
  tag?: Product["tag"];
  rating?: number;
  brand?: string;
  weight?: string;
  desc?: Localized;
  nutrition?: Nutrition;
  barcode?: string;
  image?: string;
}

const p = (
  id: number,
  cat: string,
  kk: string,
  ru: string,
  en: string,
  price: number,
  unit: string,
  emoji: string,
  extra?: ProductExtra,
): Product => ({
  id,
  cat,
  name: { kk, ru, en },
  price,
  unit,
  emoji,
  // Every product gets a rating and a description (auto-generated when not
  // supplied), so the product detail page is always complete.
  rating: extra?.rating ?? Math.round((4.3 + ((id * 7) % 7) / 10) * 10) / 10,
  desc:
    extra?.desc ??
    {
      kk: `${kk} — сапалы әрі жаңа өнім. NOMI арқылы үйіңізге жылдам жеткіземіз.`,
      ru: `${ru} — качественный свежий продукт. Быстро доставим домой через NOMI.`,
      en: `${en} — a fresh, quality product. Quickly delivered to your door by NOMI.`,
    },
  ...(extra?.oldPrice !== undefined ? { oldPrice: extra.oldPrice } : {}),
  ...(extra?.tag ? { tag: extra.tag } : {}),
  ...(extra?.brand ? { brand: extra.brand } : {}),
  ...(extra?.weight ? { weight: extra.weight } : {}),
  ...(extra?.nutrition ? { nutrition: extra.nutrition } : {}),
  ...(extra?.barcode ? { barcode: extra.barcode } : {}),
  ...(extra?.image ? { image: extra.image } : {}),
});

export const products: Product[] = [
  // dairy
  p(1, "dairy", "Сүт 2.5% 1л", "Молоко 2.5% 1л", "Milk 2.5% 1L", 450, "шт", "🥛", { tag: "HIT", brand: "Food Master", weight: "1 л", nutrition: { kcal: 53, protein: 2.9, fat: 2.5, carbs: 4.7 } }),
  p(2, "dairy", "Айран 0.5л", "Айран 0.5л", "Ayran 0.5L", 280, "шт", "🥛", { brand: "Президент", weight: "0.5 л" }),
  p(3, "dairy", "Сметана 20%", "Сметана 20%", "Sour cream 20%", 520, "шт", "🥛", { brand: "Food Master", weight: "0.4 кг", nutrition: { kcal: 206, protein: 2.8, fat: 20, carbs: 3.2 } }),
  p(52, "dairy", "Грек йогурты 8.4%", "Йогурт греческий 8.4%", "Greek yogurt 8.4%", 437, "шт", "🥛", { tag: "NEW", brand: "Food Master", weight: "0.135 кг", nutrition: { kcal: 122, protein: 4.8, fat: 8.4, carbs: 6.9 }, desc: { kk: "Құрамы: қалпына келтірілген сүт, ұйытқы. Food Master табиғи грек йогурты — жұмсақ, қою құрылымды. Салаттарға таптырмас.", ru: "Состав: нормализованное молоко, закваска. Натуральный греческий йогурт Food Master с нежной густой текстурой. Идеален для салатов.", en: "Ingredients: normalized milk, starter culture. Food Master natural Greek yogurt with a thick, creamy texture. Perfect for salads." } }),
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
  p(16, "soda", "Coca-Cola 0.5л", "Coca-Cola 0.5л", "Coca-Cola 0.5L", 250, "шт", "🥤", { tag: "HIT", brand: "Coca-Cola", weight: "0.5 л", barcode: "5449000054227", nutrition: { kcal: 42, protein: 0, fat: 0, carbs: 10.6 } }),
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
  p(27, "snacks", "Чипсы Lay's", "Чипсы Lay's", "Lay's chips", 550, "шт", "🥔", { brand: "Lay's", barcode: "5900259035378" }),
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
  // --- extra assortment ---
  p(53, "dairy", "Кефир 2.5% 1л", "Кефир 2.5% 1л", "Kefir 2.5% 1L", 420, "шт", "🥛", { brand: "Простоквашино" }),
  p(54, "cheese", "Ірімшік Моцарелла", "Сыр Моцарелла", "Mozzarella", 1290, "уп", "🧀", { tag: "HIT", weight: "0.2 кг" }),
  p(55, "bread", "Лаваш", "Лаваш", "Lavash", 160, "шт", "🫓"),
  p(56, "pastry", "Самса", "Самса", "Samsa", 250, "шт", "🥟", { tag: "HIT" }),
  p(57, "fruits", "Апельсин 1кг", "Апельсины 1кг", "Oranges 1kg", 690, "кг", "🍊"),
  p(58, "fruits", "Жүзім 1кг", "Виноград 1кг", "Grapes 1kg", 1190, "кг", "🍇", { tag: "NEW" }),
  p(59, "veg", "Сәбіз 1кг", "Морковь 1кг", "Carrots 1kg", 250, "кг", "🥕"),
  p(60, "veg", "Пияз 1кг", "Лук 1кг", "Onion 1kg", 190, "кг", "🧅"),
  p(61, "veg", "Қияр 1кг", "Огурцы 1кг", "Cucumbers 1kg", 590, "кг", "🥒"),
  p(62, "soda", "Fanta 1л", "Fanta 1л", "Fanta 1L", 450, "шт", "🥤", { brand: "Coca-Cola", barcode: "5449000011527" }),
  p(63, "soda", "Sprite 1л", "Sprite 1л", "Sprite 1L", 450, "шт", "🥤", { brand: "Coca-Cola", barcode: "5449000014535" }),
  p(64, "juice", "Алма шырыны Gracio", "Сок яблочный Gracio", "Apple juice", 590, "шт", "🧃", { tag: "SALE", oldPrice: 750 }),
  p(65, "coffee", "Кофе 3в1 Nescafe", "Кофе 3в1 Nescafe", "Coffee 3in1", 90, "шт", "☕", { brand: "Nescafe" }),
  p(66, "tea", "Шай Pickwick жеміс", "Чай Pickwick фрукт.", "Fruit tea", 1190, "уп", "🍵"),
  p(67, "pasta", "Гречка 800г", "Гречка 800г", "Buckwheat 800g", 690, "уп", "🌾"),
  p(68, "oil", "Зәйтүн майы 0.5л", "Оливковое масло 0.5л", "Olive oil 0.5L", 2890, "шт", "🫒", { tag: "NEW" }),
  p(69, "canned", "Жүгері консерві", "Кукуруза консерв.", "Canned corn", 590, "шт", "🌽"),
  p(70, "choco", "Snickers 50г", "Snickers 50г", "Snickers 50g", 290, "шт", "🍫", { brand: "Mars", tag: "HIT", barcode: "5000159461122" }),
  p(71, "snacks", "Сухарики Хрусteam", "Сухарики Хрусteam", "Croutons", 250, "шт", "🥨"),
  p(72, "cookies", "Орео 95г", "Орео 95г", "Oreo 95g", 490, "уп", "🍪", { brand: "Oreo", barcode: "7622210449283" }),
  p(73, "meat", "Тауық филе 1кг", "Филе куриное 1кг", "Chicken fillet 1kg", 1990, "кг", "🍗", { tag: "HIT" }),
  p(74, "fish", "Скумбрия с/м", "Скумбрия с/м", "Mackerel", 1490, "кг", "🐟"),
  p(75, "sausage", "Сосиски молочные", "Сосиски молочные", "Milk sausages", 1290, "уп", "🌭", { tag: "SALE", oldPrice: 1590 }),
  p(76, "frozen", "Мұздатылған көкөніс", "Овощи зам. микс", "Frozen veg mix", 890, "уп", "🧊"),
  p(77, "personal", "Дезодорант Rexona", "Дезодорант Rexona", "Deodorant", 1290, "шт", "🧴", { brand: "Rexona" }),
  p(78, "hair", "Бальзам Pantene", "Бальзам Pantene", "Hair balm", 1890, "шт", "🧴", { brand: "Pantene" }),
  p(79, "cleaning", "Шүберек микрофибра", "Тряпка микрофибра", "Microfiber cloth", 390, "шт", "🧽"),
  p(80, "chemicals", "Освежитель Glade", "Освежитель Glade", "Air freshener", 990, "шт", "🧴", { brand: "Glade" }),
];

/** Catalog visible in a given store. Demo: every store carries the full
 *  catalog; in production this is the store's own product table. */
export function productsForStore(slug: string): Product[] {
  // Demo: every store carries the full catalog. `slug` will scope this to the
  // store's own product table once wired to Supabase.
  void slug;
  return products;
}

export const stores: Store[] = [
  { slug: "altyn-orda", name: "Алтын Орда", address: "Аль-Фараби 15/1", time: "15–25", rating: 4.8, open: true, emoji: "🏪", cover: "linear-gradient(135deg,#1fa45a,#0c6e3a)" },
  { slug: "capital", name: "Capital", address: "Аль-Фараби 9", time: "20–30", rating: 4.6, open: true, emoji: "🛒", cover: "linear-gradient(135deg,#16a34a,#157f3c)" },
];

export const promos: Promo[] = [
  { id: 1, badge: "ЧМ 2026 Edition", title: { kk: "4500₸-дан — Coca-Cola 0.5л ТЕГІН!", ru: "От 4500₸ — Coca-Cola 0.5л БЕСПЛАТНО!", en: "From 4500₸ — free Coca-Cola 0.5L!" }, oldPrice: "250₸", price: "0₸", emoji: "🥤", gradient: "linear-gradient(135deg,#ff3b30,#b3160d)" },
  { id: 2, badge: "NOMI PLUS", title: { kk: "5000₸-нан жеткізу ТЕГІН", ru: "Доставка БЕСПЛАТНО от 5000₸", en: "Free delivery from 5000₸" }, price: "0₸", emoji: "🚀", gradient: "linear-gradient(135deg,#ff7a45,#e23c1f)" },
  { id: 3, badge: "Cashback", title: { kk: "Әр тапсырыстан 5% кэшбэк", ru: "5% кэшбэк с каждого заказа", en: "5% cashback on every order" }, price: "+5%", emoji: "💰", gradient: "linear-gradient(135deg,#18a957,#0c7a3c)" },
];

export const specialOffers = [
  { id: 1, title: { kk: "Футбол кезі!", ru: "Время футбола!", en: "Football time!" }, emoji: "⚽", gradient: "linear-gradient(135deg,#ffe7a3,#ffd36b)" },
  { id: 2, title: { kk: "Жаңа қайнаған кофе", ru: "Свежесваренный кофе", en: "Freshly brewed coffee" }, emoji: "☕", gradient: "linear-gradient(135deg,#f3e1d2,#e6c6ac)" },
  { id: 3, title: { kk: "Berry Much", ru: "Berry Much", en: "Berry Much" }, emoji: "🫐", gradient: "linear-gradient(135deg,#ffd9e3,#f7b8cd)" },
  { id: 4, title: { kk: "Тиімді ай", ru: "Выгодный месяц", en: "Great month" }, emoji: "💰", gradient: "linear-gradient(135deg,#ffd1dc,#ff9fb6)" },
  { id: 5, title: { kk: "Әр сатып алуда сыйлық", ru: "Призы в каждой покупке", en: "Prizes in every order" }, emoji: "🎁", gradient: "linear-gradient(135deg,#e7ecff,#c9d6ff)" },
  { id: 6, title: { kk: "Өзіңе қамқорлық", ru: "Забота о себе", en: "Self care" }, emoji: "🧴", gradient: "linear-gradient(135deg,#d7f3d2,#aee3a6)" },
  { id: 7, title: { kk: "Сусыннан да көп", ru: "Больше чем напиток", en: "More than a drink" }, emoji: "🥤", gradient: "linear-gradient(135deg,#ffe0c2,#ffc08a)" },
  { id: 8, title: { kk: "Жеңілдік пен сапа", ru: "Лёгкость и качество", en: "Light & quality" }, emoji: "🧽", gradient: "linear-gradient(135deg,#cdefff,#a7dcf5)" },
];

export const reviews = [
  { name: "Айгерим", rating: 5, text: { kk: "Тауарлар жаңа, жеткізу жылдам. Рахмет!", ru: "Продукты свежие, доставка быстрая. Спасибо!", en: "Fresh products, fast delivery. Thanks!" } },
  { name: "Дамир", rating: 5, text: { kk: "Бағасы дүкендегідей, әрі үйге жеткізеді.", ru: "Цены как в магазине, да ещё и домой везут.", en: "Prices like in store, delivered home." } },
  { name: "Зарина", rating: 4, text: { kk: "Ыңғайлы қосымша, кейде күттіреді.", ru: "Удобное приложение, иногда ждём.", en: "Convenient app, sometimes a wait." } },
  { name: "Әлібек", rating: 5, text: { kk: "NOMI — түнде де ашық дүкен табамын!", ru: "NOMI — нахожу магазин даже ночью!", en: "NOMI — I find an open store even at night!" } },
];

// ---- Dashboard demo data ----

export interface OrderLine {
  name: string;
  price: number;
  qty: number;
  emoji: string;
}

export interface DemoOrder {
  num: number;
  customer: string;
  store: string;
  items: number;
  total: number;
  status: OrderStatus;
  minsAgo: number;
  comment?: string;
  lines?: OrderLine[];
}

export const demoOrders: DemoOrder[] = [
  { num: 1042, customer: "Айгерим С.", store: "Алтын Орда", items: 8, total: 6700, status: "pending", minsAgo: 2, comment: "Домофон жұмыс істемейді, қоңырау шалыңыз",
    lines: [
      { name: "Сүт 2.5% 1л", price: 450, qty: 2, emoji: "🥛" },
      { name: "Батон наны", price: 180, qty: 3, emoji: "🍞" },
      { name: "Жұмыртқа 10шт", price: 980, qty: 1, emoji: "🥚" },
      { name: "Сыр Гауда", price: 1890, qty: 2, emoji: "🧀" },
    ] },
  { num: 1041, customer: "Дамир К.", store: "Capital", items: 4, total: 3400, status: "accepted", minsAgo: 9, comment: "Есік коды #1234, ұялы дыбыссыз",
    lines: [
      { name: "Coca-Cola 0.5л", price: 250, qty: 4, emoji: "🥤" },
      { name: "Чипсы Lay's", price: 550, qty: 2, emoji: "🥔" },
      { name: "Шоколад Рахат", price: 420, qty: 3, emoji: "🍫" },
    ] },
  { num: 1040, customer: "Зарина Т.", store: "Алтын Орда", items: 12, total: 12600, status: "on_the_way", minsAgo: 18,
    lines: [
      { name: "Тауық еті 1кг", price: 1290, qty: 2, emoji: "🍗" },
      { name: "Күріш 1кг", price: 690, qty: 3, emoji: "🍚" },
      { name: "Алма 1кг", price: 590, qty: 4, emoji: "🍎" },
    ] },
  { num: 1039, customer: "Әлібек Н.", store: "Capital", items: 3, total: 2700, status: "delivered", minsAgo: 41 },
  { num: 1038, customer: "Мадина О.", store: "Алтын Орда", items: 9, total: 9200, status: "delivered", minsAgo: 58 },
  { num: 1037, customer: "Тимур А.", store: "Capital", items: 2, total: 1800, status: "cancelled", minsAgo: 72 },
];

export interface CourierJob {
  id: number;
  store: { name: string; address: string; lat: number; lng: number };
  client: { name: string; phone: string; address: string; lat: number; lng: number };
  items: number;
  total: number;
  payment: "online" | "cash";
  status: OrderStatus;
  minsAgo: number;
  comment?: string;
}

export const courierJobs: CourierJob[] = [
  {
    id: 1042,
    store: { name: "Алтын Орда", address: "Аль-Фараби 15/1", lat: 51.0915, lng: 71.4178 },
    client: { name: "Айгерим С.", phone: "+7 701 222 33 44", address: "Қабанбай батыр 11, кв. 52", lat: 51.1009, lng: 71.4231 },
    items: 8, total: 6700, payment: "online", status: "ready", minsAgo: 4,
    comment: "Домофон жұмыс істемейді, қоңырау шалыңыз",
  },
  {
    id: 1041,
    store: { name: "Capital", address: "Аль-Фараби 9", lat: 51.0922, lng: 71.4101 },
    client: { name: "Дамир К.", phone: "+7 705 444 55 66", address: "Сығанақ 18, кв. 7", lat: 51.0876, lng: 71.4302 },
    items: 4, total: 3400, payment: "cash", status: "on_the_way", minsAgo: 12,
    comment: "Есік коды #1234, ұялы дыбыссыз",
  },
  {
    id: 1040,
    store: { name: "Алтын Орда", address: "Аль-Фараби 15/1", lat: 51.0915, lng: 71.4178 },
    client: { name: "Зарина Т.", phone: "+7 702 777 88 99", address: "Тұран 24, кв. 130", lat: 51.1102, lng: 71.4156 },
    items: 12, total: 12600, payment: "online", status: "accepted", minsAgo: 18,
  },
];

export const demoCouriers = [
  { name: "Ерлан Б.", status: "online" as const, deliveries: 14, rating: 4.9, earnings: 18400 },
  { name: "Санжар М.", status: "busy" as const, deliveries: 11, rating: 4.8, earnings: 15200 },
  { name: "Нурлан Т.", status: "online" as const, deliveries: 9, rating: 4.7, earnings: 12600 },
  { name: "Аскар Ж.", status: "offline" as const, deliveries: 0, rating: 4.9, earnings: 0 },
];

export const demoStores = [
  { slug: "altyn-orda", name: "Алтын Орда", city: "Астана", address: "Аль-Фараби 15/1", orders: 312, revenue: 2840000, rating: 4.8, commission: 3, active: true },
  { slug: "capital", name: "Capital", city: "Астана", address: "Аль-Фараби 9", orders: 198, revenue: 1120000, rating: 4.6, commission: 3, active: true },
];
