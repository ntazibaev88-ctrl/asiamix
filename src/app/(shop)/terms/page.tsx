"use client";

import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

const SECTIONS = [
  {
    h: { kk: "1. Жалпы ережелер", ru: "1. Общие положения", en: "1. General" },
    p: {
      kk: "NOMI — Астана қаласындағы тауарларды жеткізу платформасы. Қосымшаны пайдалана отырып, осы шарттармен келісесіз.",
      ru: "NOMI — платформа доставки товаров в Астане. Используя приложение, вы соглашаетесь с этими условиями.",
      en: "NOMI is a delivery platform in Astana. By using the app you agree to these terms.",
    },
  },
  {
    h: { kk: "2. Тапсырыс және төлем", ru: "2. Заказ и оплата", en: "2. Orders & payment" },
    p: {
      kk: "Тапсырыс расталғаннан кейін төлем алынады. Тауар жоқ болса, оның ақшасы автоматты қайтарылады.",
      ru: "Оплата списывается после подтверждения заказа. При отсутствии товара его стоимость возвращается автоматически.",
      en: "Payment is taken after order confirmation. If an item is unavailable, its cost is refunded automatically.",
    },
  },
  {
    h: { kk: "3. Жеткізу", ru: "3. Доставка", en: "3. Delivery" },
    p: {
      kk: "Жеткізу Астана, Есіл ауданы бойынша орындалады. Бағасы қашықтық пен ауа райына байланысты.",
      ru: "Доставка осуществляется по району Есиль, Астана. Стоимость зависит от расстояния и погоды.",
      en: "Delivery covers Esil district, Astana. The fee depends on distance and weather.",
    },
  },
  {
    h: { kk: "4. Дербес деректер", ru: "4. Персональные данные", en: "4. Personal data" },
    p: {
      kk: "Деректеріңіз тек тапсырысты орындау үшін қолданылады және үшінші тұлғаларға берілмейді.",
      ru: "Ваши данные используются только для выполнения заказа и не передаются третьим лицам.",
      en: "Your data is used only to fulfil the order and is not shared with third parties.",
    },
  },
  {
    h: { kk: "5. Байланыс", ru: "5. Контакты", en: "5. Contact" },
    p: {
      kk: "Сұрақтар бойынша: +7 700 000 00 00, hello@nomi.kz",
      ru: "По вопросам: +7 700 000 00 00, hello@nomi.kz",
      en: "Questions: +7 700 000 00 00, hello@nomi.kz",
    },
  },
];

export default function TermsPage() {
  const { t, locale } = useI18n();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("terms.title")}</h1>
      <Card className="flex flex-col gap-5 p-5">
        {SECTIONS.map((s, i) => (
          <div key={i}>
            <h2 className="font-semibold">{s.h[locale]}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.p[locale]}</p>
          </div>
        ))}
        <p className="border-t border-border pt-3 text-xs text-faint">© 2026 NOMI Delivery</p>
      </Card>
    </div>
  );
}
