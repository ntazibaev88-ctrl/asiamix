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
  "shop.districtNote": {
    kk: "Әзірге тек Есіл ауданына жеткіземіз. Басқа аудандар жақын арада.",
    ru: "Пока доставляем только в район Есиль. Другие районы — скоро.",
    en: "For now we deliver only to Esil district. Other districts coming soon.",
  },
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
  "store.productName": { kk: "Тауар атауы", ru: "Название товара", en: "Product name" },
  "store.myProducts": { kk: "Дүкеннің тауарлары", ru: "Товары магазина", en: "Store products" },
  "store.baseCatalog": { kk: "Жалпы каталог", ru: "Общий каталог", en: "Base catalog" },
  "store.paymentReport": { kk: "Төлем бойынша есеп", ru: "Отчёт по оплате", en: "Payment report" },
  "store.online": { kk: "Онлайн төлем", ru: "Онлайн оплата", en: "Online payment" },
  "store.cashPay": { kk: "Қолма-қол", ru: "Наличные", en: "Cash" },
  "store.accept": { kk: "Қабылдау", ru: "Принять", en: "Accept" },
  "store.reject": { kk: "Бас тарту", ru: "Отклонить", en: "Reject" },
  "store.ready": { kk: "Дайын болды", ru: "Готов", en: "Ready" },
  "store.stock": { kk: "Қордағы саны", ru: "Остаток", en: "Stock" },
  "store.qty": { kk: "Саны", ru: "Кол-во", en: "Qty" },
  "store.brand": { kk: "Бренд", ru: "Бренд", en: "Brand" },
  "store.description": { kk: "Сипаттама", ru: "Описание", en: "Description" },
  "store.items": { kk: "Тапсырыс құрамы", ru: "Состав заказа", en: "Order items" },
  "store.outOfStock": { kk: "Жоқ затты алып тастаңыз — айырмасы клиентке қайтады", ru: "Уберите отсутствующий товар — разница вернётся клиенту", en: "Remove out-of-stock items — difference is refunded" },
  "store.refund": { kk: "Клиентке қайтарылады", ru: "Вернётся клиенту", en: "Refund to customer" },
  "store.newTotal": { kk: "Жаңа сома", ru: "Новая сумма", en: "New total" },
  "promo.subtitle": { kk: "Сипаттама / жаңалық", ru: "Описание / новость", en: "Description / news" },
  "promo.product": { kk: "Тауар (міндетті емес)", ru: "Товар (необязательно)", en: "Product (optional)" },
  // Courier
  "courier.accept": { kk: "Қабылдау", ru: "Принять", en: "Accept" },
  "courier.myOrders": { kk: "Менің тапсырыстарым", ru: "Мои заказы", en: "My orders" },
  "courier.available": { kk: "Қолжетімді тапсырыстар", ru: "Доступные заказы", en: "Available orders" },
  "pool.title": { kk: "Заказдар пулы", ru: "Пул заказов", en: "Order pool" },
  "pool.byPrice": { kk: "Баға бойынша", ru: "По цене", en: "By price" },
  "pool.byDistance": { kk: "Қашықтық бойынша", ru: "По расстоянию", en: "By distance" },
  "pool.byTime": { kk: "Уақыт бойынша", ru: "По времени", en: "By time" },
  "pool.takeAll": { kk: "Барлығын алу", ru: "Взять все", en: "Take all" },
  "nav.pool": { kk: "Пул", ru: "Пул", en: "Pool" },
  // Promo codes
  "promo.codes": { kk: "Промокодтар", ru: "Промокоды", en: "Promo codes" },
  "promo.code": { kk: "Промокод", ru: "Промокод", en: "Promo code" },
  "promo.discount": { kk: "Жеңілдік %", ru: "Скидка %", en: "Discount %" },
  "promo.apply": { kk: "Қолдану", ru: "Применить", en: "Apply" },
  "promo.applied": { kk: "Промокод қолданылды", ru: "Промокод применён", en: "Promo applied" },
  "promo.invalid": { kk: "Промокод қате", ru: "Неверный промокод", en: "Invalid promo" },
  "promo.codePh": { kk: "Промокод енгізіңіз", ru: "Введите промокод", en: "Enter promo code" },
  "promo.kindGoods": { kk: "Тауарға", ru: "На товары", en: "On goods" },
  "promo.kindDelivery": { kk: "Жеткізуге", ru: "На доставку", en: "On delivery" },
  "promo.copy": { kk: "Көшіру", ru: "Копировать", en: "Copy" },
  "promo.copied": { kk: "Көшірілді", ru: "Скопировано", en: "Copied" },
  "img.upload": { kk: "Сурет жүктеу", ru: "Загрузить фото", en: "Upload image" },
  "img.error": { kk: "Суретті өңдеу қатесі", ru: "Ошибка обработки фото", en: "Image processing error" },
  // Admin extra
  "nav.promocodes": { kk: "Промокодтар", ru: "Промокоды", en: "Promo codes" },
  "nav.notify": { kk: "Хабарлама", ru: "Рассылка", en: "Broadcast" },
  "nav.banners": { kk: "Баннерлер", ru: "Баннеры", en: "Banners" },
  "nav.reports": { kk: "Отчеттар", ru: "Отчёты", en: "Reports" },
  "rep.title": { kk: "Айлық отчет", ru: "Месячный отчёт", en: "Monthly report" },
  "rep.period": { kk: "Кезең", ru: "Период", en: "Period" },
  "rep.store": { kk: "Магазин", ru: "Магазин", en: "Store" },
  "rep.orders": { kk: "Заказ", ru: "Заказы", en: "Orders" },
  "rep.sales": { kk: "Сатылым", ru: "Продажи", en: "Sales" },
  "rep.commission": { kk: "Комиссия", ru: "Комиссия", en: "Commission" },
  "rep.payable": { kk: "Төленеді", ru: "К выплате", en: "Payable" },
  "rep.refunds": { kk: "Қайтарым", ru: "Возвраты", en: "Refunds" },
  "rep.net": { kk: "Таза пайда", ru: "Чистая прибыль", en: "Net profit" },
  "rep.total": { kk: "Барлығы", ru: "Итого", en: "Total" },
  "rep.print": { kk: "Басып шығару", ru: "Печать", en: "Print" },
  "admin.revenueChart": { kk: "Табыс графигі (7 күн)", ru: "Доход (7 дней)", en: "Revenue (7 days)" },
  "admin.notifyTitle": { kk: "Клиенттерге хабарлама", ru: "Рассылка клиентам", en: "Broadcast to customers" },
  "admin.notifyPh": { kk: "Хабарлама мәтіні…", ru: "Текст сообщения…", en: "Message text…" },
  "admin.send": { kk: "Жіберу", ru: "Отправить", en: "Send" },
  "admin.bannerTitle": { kk: "Басты баннерлер", ru: "Главные баннеры", en: "Home banners" },
  "admin.bannerImage": { kk: "Баннер суреті (16:9)", ru: "Фото баннера (16:9)", en: "Banner image (16:9)" },
  // Cart scheduling
  "cart.when": { kk: "Жеткізу уақыты", ru: "Время доставки", en: "Delivery time" },
  "cart.asap": { kk: "Қазір", ru: "Сейчас", en: "ASAP" },
  "cart.scheduled": { kk: "Уақытқа", ru: "Ко времени", en: "Scheduled" },
  // Profile bonus / referral
  "profile.bonus": { kk: "Бонус ұпайлар", ru: "Бонусные баллы", en: "Bonus points" },
  "profile.referral": { kk: "Дос шақыру", ru: "Пригласить друга", en: "Invite a friend" },
  "profile.referralDesc": { kk: "Досыңды шақыр — екеуің де 1000 бонус аласыңдар", ru: "Пригласи друга — оба получите 1000 бонусов", en: "Invite a friend — you both get 1000 bonus" },
  "profile.copy": { kk: "Кодты көшіру", ru: "Скопировать код", en: "Copy code" },
  "profile.copied": { kk: "Көшірілді!", ru: "Скопировано!", en: "Copied!" },
  "shop.promos": { kk: "Акциялар", ru: "Акции", en: "Promotions" },
  "shop.comment": { kk: "Тапсырысқа түсініктеме", ru: "Комментарий к заказу", en: "Order comment" },
  "shop.commentPh": { kk: "Мысалы: есік кодын жазыңыз, қоңырау шалмаңыз…", ru: "Например: код двери, не звонить…", en: "E.g. door code, don't call…" },
  "shop.track": { kk: "Бақылау", ru: "Отслеживать", en: "Track" },
  "shop.activeOrder": { kk: "Белсенді тапсырыс", ru: "Активный заказ", en: "Active order" },
  "track.title": { kk: "Тапсырысты бақылау", ru: "Отслеживание заказа", en: "Order tracking" },
  "track.eta": { kk: "Жеткізуге қалды", ru: "Осталось до доставки", en: "Arrives in" },
  "track.min": { kk: "мин", ru: "мин", en: "min" },
  "track.near": { kk: "🔔 Курьер жақындап қалды!", ru: "🔔 Курьер уже рядом!", en: "🔔 Courier is almost here!" },
  "track.delivered": { kk: "Тапсырыс жеткізілді 🎉", ru: "Заказ доставлен 🎉", en: "Order delivered 🎉" },
  "track.courier": { kk: "Курьер", ru: "Курьер", en: "Courier" },
  "track.chat": { kk: "Курьермен чат", ru: "Чат с курьером", en: "Chat with courier" },
  "track.message": { kk: "Хабарлама…", ru: "Сообщение…", en: "Message…" },
  "track.noOrder": { kk: "Белсенді тапсырыс жоқ", ru: "Нет активных заказов", en: "No active orders" },
  "about.title": { kk: "NOMI туралы", ru: "О NOMI", en: "About NOMI" },
  "about.text": {
    kk: "NOMI — Астана қаласындағы заманауи жеткізу платформасы. Сүйікті дүкендеріңізден азық-түлік пен тауарларды бірнеше минутта үйіңізге жеткіземіз. Жылдам, ыңғайлы әрі сенімді.",
    ru: "NOMI — современная платформа доставки в Астане. Доставляем продукты и товары из любимых магазинов к вам домой за считанные минуты. Быстро, удобно и надёжно.",
    en: "NOMI is a modern delivery platform in Astana. We bring groceries and goods from your favorite stores to your door in minutes. Fast, convenient and reliable.",
  },
  "about.contacts": { kk: "Байланыс", ru: "Контакты", en: "Contacts" },

  // Help / legal / profile links
  "help.title": { kk: "Көмек", ru: "Помощь", en: "Help" },
  "profile.support": { kk: "Қолдау қызметі", ru: "Поддержка", en: "Support" },
  "profile.faq": { kk: "Жиі қойылатын сұрақтар", ru: "Частые вопросы", en: "FAQ" },
  "profile.terms": { kk: "Қолдану шарттары", ru: "Условия использования", en: "Terms of use" },
  "support.title": { kk: "Қолдау қызметі", ru: "Поддержка", en: "Support" },
  "support.greeting": { kk: "Сәлеметсіз бе! Сұрағыңызды жазыңыз, көмектесеміз 🙂", ru: "Здравствуйте! Напишите вопрос, мы поможем 🙂", en: "Hi! Ask your question, we'll help 🙂" },
  "faq.title": { kk: "Жиі қойылатын сұрақтар", ru: "Частые вопросы", en: "FAQ" },
  "terms.title": { kk: "Қолдану шарттары", ru: "Условия использования", en: "Terms of use" },

  // Catalog filter
  "filter.title": { kk: "Сүзгі", ru: "Фильтр", en: "Filter" },
  "filter.brand": { kk: "Бренд", ru: "Бренд", en: "Brand" },
  "filter.allBrands": { kk: "Барлық брендтер", ru: "Все бренды", en: "All brands" },
  "filter.sort": { kk: "Сұрыптау", ru: "Сортировка", en: "Sort" },
  "filter.default": { kk: "Әдепкі", ru: "По умолчанию", en: "Default" },
  "filter.cheap": { kk: "Алдымен арзан", ru: "Сначала дешёвые", en: "Cheapest first" },
  "filter.expensive": { kk: "Алдымен қымбат", ru: "Сначала дорогие", en: "Priciest first" },

  // Home sliders
  "home.new": { kk: "Жаңа өнімдер 🆕", ru: "Новинки 🆕", en: "New products 🆕" },
  "home.popular": { kk: "Танымал тауарлар ⭐", ru: "Популярные товары ⭐", en: "Popular products ⭐" },
  "home.recommended": { kk: "Сізге ұсынамыз 💡", ru: "Рекомендуем вам 💡", en: "Recommended for you 💡" },

  // Tips & reviews
  "tip.title": { kk: "Курьерге рахмет (чаевые)", ru: "Чаевые курьеру", en: "Tip the courier" },
  "tip.custom": { kk: "Басқа сома", ru: "Другая сумма", en: "Custom" },
  "tip.thanks": { kk: "Рахмет! Курьер ризашылығын білдіреді 🙏", ru: "Спасибо! Курьер благодарит 🙏", en: "Thanks! The courier appreciates it 🙏" },
  "review.title": { kk: "Бағалаңыз", ru: "Оцените заказ", en: "Rate your order" },
  "review.comment": { kk: "Пікіріңіз…", ru: "Ваш отзыв…", en: "Your review…" },
  "review.send": { kk: "Жіберу", ru: "Отправить", en: "Send" },
  "review.thanks": { kk: "Пікіріңізге рахмет! ⭐", ru: "Спасибо за отзыв! ⭐", en: "Thanks for your review! ⭐" },
  "review.reviews": { kk: "Пікірлер", ru: "Отзывы", en: "Reviews" },
  "review.add": { kk: "Пікір қалдыру", ru: "Оставить отзыв", en: "Write a review" },
  "nav.promos": { kk: "Акциялар", ru: "Акции", en: "Promotions" },
  "promo.add": { kk: "Акция қосу", ru: "Добавить акцию", en: "Add promo" },
  "promo.title": { kk: "Жазуы", ru: "Заголовок", en: "Title" },
  "promo.color": { kk: "Түсі", ru: "Цвет", en: "Color" },
  "promo.image": { kk: "Сурет (міндетті емес)", ru: "Фото (необязательно)", en: "Image (optional)" },
  "cart.zone": { kk: "Жеткізу аймағы (қашықтық)", ru: "Зона доставки (расстояние)", en: "Delivery zone (distance)" },
  "cart.weather": { kk: "Ауа райы коэффициенті", ru: "Погодный коэффициент", en: "Weather surcharge" },
  "cart.street": { kk: "Көше (Есіл ауданы)", ru: "Улица (район Есиль)", en: "Street (Esil district)" },
  "cart.house": { kk: "Үй, пәтер", ru: "Дом, квартира", en: "House, apt" },
  "cart.serviceFee": { kk: "Сервистік алым", ru: "Сервисный сбор", en: "Service fee" },
  "cart.totalWeight": { kk: "Жалпы салмақ", ru: "Общий вес", en: "Total weight" },
  "cart.kg": { kk: "кг", ru: "кг", en: "kg" },
  "cart.paid": { kk: "Төлем расталды", ru: "Оплата подтверждена", en: "Payment confirmed" },
  "cart.kaspiPay": { kk: "Kaspi-мен төлеу", ru: "Оплатить через Kaspi", en: "Pay with Kaspi" },
  "weather.normal": { kk: "Қалыпты", ru: "Норма", en: "Normal" },
  "weather.medium": { kk: "Орташа", ru: "Средняя", en: "Medium" },
  "weather.high": { kk: "Нашар", ru: "Плохая", en: "Bad" },
  "shop.catalog": { kk: "Каталог", ru: "Каталог", en: "Catalog" },
  "shop.categories": { kk: "Категориялар", ru: "Категории", en: "Categories" },
  "shop.nothingFound": { kk: "Ештеңе табылмады", ru: "Ничего не найдено", en: "Nothing found" },
  "shop.favStores": { kk: "Таңдаулы дүкендер", ru: "Избранные магазины", en: "Favorite stores" },
  "shop.favProducts": { kk: "Таңдаулы тауарлар", ru: "Избранные товары", en: "Favorite products" },

  // Store featured sliders
  "store.hits": { kk: "Хиттер 🔥", ru: "Хиты 🔥", en: "Hits 🔥" },
  "store.new": { kk: "Жаңа түскен 🆕", ru: "Новинки 🆕", en: "New 🆕" },
  "store.sale": { kk: "Жеңілдіктер 💸", ru: "Скидки 💸", en: "Discounts 💸" },
  "store.popular": { kk: "Танымал ⭐", ru: "Популярное ⭐", en: "Popular ⭐" },
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
  "login.username": { kk: "Логин", ru: "Логин", en: "Login" },
  "login.password": { kk: "Құпиясөз", ru: "Пароль", en: "Password" },
  "login.error": { kk: "Логин не құпиясөз қате", ru: "Неверный логин или пароль", en: "Wrong login or password" },
  "login.demoAccounts": { kk: "Демо аккаунттар (басып толтыр)", ru: "Демо-аккаунты (нажмите)", en: "Demo accounts (tap to fill)" },

  // Customer auth
  "auth.login": { kk: "Кіру", ru: "Вход", en: "Sign in" },
  "auth.register": { kk: "Тіркелу", ru: "Регистрация", en: "Register" },
  "auth.name": { kk: "Атыңыз", ru: "Имя", en: "Name" },
  "auth.phone": { kk: "Телефон", ru: "Телефон", en: "Phone" },
  "auth.doLogin": { kk: "Кіру", ru: "Войти", en: "Sign in" },
  "auth.doRegister": { kk: "Аккаунт құру", ru: "Создать аккаунт", en: "Create account" },
  "auth.welcome": { kk: "NOMI-ге қош келдіңіз", ru: "Добро пожаловать в NOMI", en: "Welcome to NOMI" },
  "auth.subtitle": { kk: "Телефон арқылы кіріңіз", ru: "Войдите по номеру телефона", en: "Sign in with your phone" },
  "auth.sendCode": { kk: "Код жіберу", ru: "Отправить код", en: "Send code" },
  "auth.smsCode": { kk: "SMS код", ru: "Код из SMS", en: "SMS code" },
  "auth.demoCode": { kk: "Демо код", ru: "Демо-код", en: "Demo code" },
  "auth.changePhone": { kk: "Нөмірді өзгерту", ru: "Изменить номер", en: "Change number" },
  "auth.errPhone": { kk: "Нөмір қате немесе шектен асты", ru: "Неверный номер или лимит", en: "Bad number or limit" },
  "auth.errCode": { kk: "Код қате немесе ескірген", ru: "Неверный или истёкший код", en: "Wrong or expired code" },
  "auth.errCreds": { kk: "Логин не құпиясөз қате", ru: "Неверный логин или пароль", en: "Wrong login or password" },
  "auth.err2fa": { kk: "2FA коды қате", ru: "Неверный код 2FA", en: "Wrong 2FA code" },
  "auth.errNetwork": { kk: "Желі қатесі", ru: "Ошибка сети", en: "Network error" },
  "auth.pickPanel": { kk: "Қай панельге кіресіз?", ru: "В какую панель войти?", en: "Which panel?" },
  "auth.client": { kk: "Клиент", ru: "Клиент", en: "Customer" },
  "auth.clientDesc": { kk: "Телефон + SMS код", ru: "Телефон + SMS код", en: "Phone + SMS code" },
  "auth.courierDesc": { kk: "Телефон + SMS код", ru: "Телефон + SMS код", en: "Phone + SMS code" },
  "auth.storeDesc": { kk: "Логин/пароль + 2FA", ru: "Логин/пароль + 2FA", en: "Login/password + 2FA" },
  "auth.adminDesc": { kk: "Тек әкімші аккаунты", ru: "Только аккаунт админа", en: "Admin account only" },
  "auth.twofa": { kk: "2FA коды (Authenticator)", ru: "Код 2FA (Authenticator)", en: "2FA code (Authenticator)" },
  "auth.twofaHint": { kk: "Authenticator қосымшасынан 6 санды код", ru: "6-значный код из приложения Authenticator", en: "6-digit code from your Authenticator app" },
  "auth.demoFill": { kk: "Демо кодты толтыру", ru: "Заполнить демо-код", en: "Fill demo code" },

  // Super admin store management
  "admin.addStore": { kk: "Дүкен қосу", ru: "Добавить магазин", en: "Add store" },
  "admin.storeName": { kk: "Дүкен атауы", ru: "Название магазина", en: "Store name" },
  "admin.city": { kk: "Қала", ru: "Город", en: "City" },
  "admin.address": { kk: "Мекенжай", ru: "Адрес", en: "Address" },
  "admin.save": { kk: "Сақтау", ru: "Сохранить", en: "Save" },
  "admin.tempCommission": { kk: "Уақытша комиссия", ru: "Временная комиссия", en: "Temp commission" },
  "admin.activeCommission": { kk: "Қазіргі комиссия", ru: "Активная комиссия", en: "Active commission" },
  "admin.until": { kk: "дейін", ru: "до", en: "until" },
  "admin.weatherTitle": { kk: "Ауа райы коэффициенті (жеткізу)", ru: "Погодный коэффициент (доставка)", en: "Weather surcharge (delivery)" },
  "fin.toStores": { kk: "Дүкендерге төленді", ru: "Выплачено магазинам", en: "Paid to stores" },
  "fin.toCouriers": { kk: "Курьерлерге төленді", ru: "Выплачено курьерам", en: "Paid to couriers" },
  "fin.commission": { kk: "Комиссиядан табыс", ru: "Доход с комиссии", en: "Commission income" },
  "fin.serviceFee": { kk: "Service Fee табысы", ru: "Доход Service Fee", en: "Service fee income" },
  "fin.gross": { kk: "Жалпы айналым", ru: "Общий оборот", en: "Gross revenue" },
  "fin.adminIncome": { kk: "Админ табысы", ru: "Доход админа", en: "Admin income" },
  "fin.transactions": { kk: "Транзакциялар", ru: "Транзакции", en: "Transactions" },
  "fin.failed": { kk: "Сәтсіз төлемдер", ru: "Неуспешные платежи", en: "Failed payments" },
  "admin.weatherNote": { kk: "Клиентке көрінбейді — бағаға автоматты қосылады", ru: "Не виден клиенту — добавляется в цену автоматически", en: "Hidden from customers — added to price automatically" },
  "weather.auto": { kk: "Авто", ru: "Авто", en: "Auto" },
  "admin.current": { kk: "Қазір", ru: "Сейчас", en: "Now" },

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

  // Finance / wallet
  "fin.availableBalance": { kk: "Қолжетімді баланс", ru: "Доступный баланс", en: "Available balance" },
  "fin.totalSales": { kk: "Жалпы сатылым", ru: "Всего продаж", en: "Total sales" },
  "fin.paymentHistory": { kk: "Төлем тарихы", ru: "История платежей", en: "Payment history" },
  "fin.monthlyReport": { kk: "Айлық отчет", ru: "Месячный отчёт", en: "Monthly report" },
  "fin.orders": { kk: "Тапсырыстар", ru: "Заказы", en: "Orders" },
  "fin.net": { kk: "Таза табыс", ru: "К зачислению", en: "Net" },
  "fin.commissionLabel": { kk: "Комиссия", ru: "Комиссия", en: "Commission" },
  "fin.today": { kk: "Бүгін", ru: "Сегодня", en: "Today" },
  "fin.week": { kk: "Апта", ru: "Неделя", en: "Week" },
  "fin.month": { kk: "Ай", ru: "Месяц", en: "Month" },
  "fin.deliveries": { kk: "Жеткізулер", ru: "Доставки", en: "Deliveries" },
  "fin.noPayments": { kk: "Әзірге төлем жоқ", ru: "Пока нет платежей", en: "No payments yet" },
  "fin.payout": { kk: "Төлемге", ru: "К выплате", en: "Payout" },
  "fin.order": { kk: "Тапсырыс", ru: "Заказ", en: "Order" },

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
  "courier.open": { kk: "Ашу", ru: "Открыть", en: "Open" },
  "courier.pickup": { kk: "Дүкеннен алу", ru: "Забрать из магазина", en: "Pick up" },
  "courier.dropoff": { kk: "Клиентке жеткізу", ru: "Доставить клиенту", en: "Deliver to" },
  "courier.chat": { kk: "Клиентпен чат", ru: "Чат с клиентом", en: "Chat with client" },
  "courier.message": { kk: "Хабарлама…", ru: "Сообщение…", en: "Message…" },
  "courier.markAs": { kk: "Статусты ауыстыру", ru: "Сменить статус", en: "Mark as" },
  "courier.items": { kk: "Товарлар", ru: "Товары", en: "Items" },
  "courier.totalItems": { kk: "Жалпы товар", ru: "Всего товаров", en: "Total items" },
  "courier.bags": { kk: "пакет", ru: "пакетов", en: "bags" },
  "courier.weight": { kk: "Жалпы салмақ", ru: "Общий вес", en: "Total weight" },
  "courier.newOrder": { kk: "Жаңа заказ", ru: "Новый заказ", en: "New order" },
  "weight.medium": { kk: "⚠️ Орташа ауыр заказ", ru: "⚠️ Заказ средней тяжести", en: "⚠️ Medium-heavy order" },
  "weight.heavy": { kk: "⚠️ Ауыр заказ", ru: "⚠️ Тяжёлый заказ", en: "⚠️ Heavy order" },
  "weight.very_heavy": { kk: "🚨 Өте ауыр заказ", ru: "🚨 Очень тяжёлый заказ", en: "🚨 Very heavy order" },

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
