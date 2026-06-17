# NOMI — Delivery Platform

Современная платформа доставки еды. Web-first, с архитектурой, готовой к
переносу на мобильные приложения (React Native) в будущем.

Стек: **Next.js 16** (App Router, Turbopack) · **React 19** · **Tailwind CSS v4**
· **Supabase** (PostgreSQL + Auth) · **framer-motion** · **TypeScript**.

## Возможности (текущий каркас)

Заложена структура для всех четырёх ролей из ТЗ:

| Раздел | Маршрут | Что внутри |
| --- | --- | --- |
| 🛒 Клиент | `/` | Витрина: меню по категориям, корзина, оформление заказа, отзывы |
| 🏍️ Курьер | `/courier` | Онлайн/офлайн, доступные заказы, доход, баланс, вывод средств |
| 🏪 Магазин | `/store` | Дашборд продаж, заказы, товары (наличие/цена), аналитика |
| 🛡️ Супер админ | `/admin` | Пользователи, курьеры, магазины, комиссии, финансы, бан |
| 🔐 Вход | `/login` | Выбор роли (демо), затем редирект в нужный портал |

Дополнительно реализовано:

- **Тёмная/светлая тема** — семантические дизайн-токены (`globals.css`),
  без мигания при загрузке (inline-скрипт в `<head>`), переключатель в шапке.
- **Мультиязычность** — Қазақша / Русский / English (`src/lib/i18n.tsx`).
- **Премиальный UI** — единая система компонентов (`src/components/ui`),
  плавные анимации framer-motion.
- **Защита маршрутов** — `src/proxy.ts` (в Next.js 16 middleware называется
  Proxy) делает оптимистичную проверку роли перед порталами.

## Структура проекта

```
src/
  app/
    layout.tsx            # шрифты, провайдеры темы и i18n, метаданные NOMI
    page.tsx              # витрина клиента
    login/                # вход и выбор роли
    courier/              # портал курьера (layout + страницы)
    store/                # портал магазина
    admin/                # портал супер-админа
    api/orders/route.ts   # приём заказа + уведомление в Telegram
  components/
    ui/                   # Button, Card, Badge, StatCard, PageHeader
    DashboardShell.tsx    # сайдбар + топбар для всех порталов
    OrdersTable.tsx, ThemeToggle.tsx, LangSwitch.tsx
  lib/
    i18n.tsx, theme.tsx   # локали и тема (useSyncExternalStore)
    types.ts, brand.ts    # доменные типы и бренд
    mock.ts               # демо-данные витрины и дашбордов
    format.ts, cn.ts, cookies.ts
    supabase/             # client, server, auth helpers
  proxy.ts                # ролевая защита маршрутов
supabase/
  schema.sql              # полная схема БД (роли, магазины, заказы, RLS …)
```

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
```

Окружение (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
TELEGRAM_BOT_TOKEN=...      # опционально, уведомления о заказах
TELEGRAM_CHAT_ID=...
```

База данных: выполните `supabase/schema.sql` в SQL-редакторе Supabase.

## Следующие шаги

- Подключить реальную авторизацию Supabase (телефон/OTP) вместо демо-cookie
  в `/login` и `src/proxy.ts`.
- Заменить `src/lib/mock.ts` на запросы к Supabase.
- Live-трекинг курьера на карте (Yandex/Google Maps) и real-time чат через
  Supabase Realtime.
- Платежи: Kaspi Pay, Visa, Mastercard.
- Промокоды, рефералы, кэшбэк, программа лояльности (таблицы уже в схеме).
