"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

const FAQ = [
  {
    q: { kk: "Жеткізу қанша уақыт алады?", ru: "Сколько занимает доставка?", en: "How long is delivery?" },
    a: { kk: "Есіл ауданы бойынша орта есеппен 15–40 минут.", ru: "В среднем 15–40 минут по району Есиль.", en: "On average 15–40 minutes in Esil district." },
  },
  {
    q: { kk: "Жеткізу бағасы қалай есептеледі?", ru: "Как считается стоимость доставки?", en: "How is the delivery fee calculated?" },
    a: { kk: "Қашықтыққа қарай автоматты: 350₸-дан 1000₸-ге дейін. Ауа райы нашар болса үстеме қосылады.", ru: "Автоматически по расстоянию: от 350₸ до 1000₸. В плохую погоду добавляется надбавка.", en: "Automatically by distance: 350₸–1000₸. Bad weather adds a surcharge." },
  },
  {
    q: { kk: "Қалай төлеймін?", ru: "Как оплатить?", en: "How do I pay?" },
    a: { kk: "Kaspi, картамен немесе қолма-қол.", ru: "Kaspi, картой или наличными.", en: "Kaspi, card or cash." },
  },
  {
    q: { kk: "Тауар жоқ болса не болады?", ru: "Что если товара нет в наличии?", en: "What if an item is out of stock?" },
    a: { kk: "Дүкен оны тапсырыстан алып тастайды, ал ақшасы сізге қайтарылады.", ru: "Магазин убирает его из заказа, а деньги возвращаются вам.", en: "The store removes it and the money is refunded to you." },
  },
  {
    q: { kk: "Промокод қайда енгіземін?", ru: "Где ввести промокод?", en: "Where do I enter a promo code?" },
    a: { kk: "Себетте, тапсырыс рәсімдеу кезінде.", ru: "В корзине при оформлении заказа.", en: "In the cart at checkout." },
  },
];

export default function FaqPage() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-2xl font-bold">{t("faq.title")}</h1>
      <div className="flex flex-col gap-2">
        {FAQ.map((item, i) => (
          <Card key={i} className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-3 p-4 text-left font-semibold cursor-pointer"
            >
              {item.q[locale]}
              <ChevronDown size={18} className={open === i ? "rotate-180 transition" : "transition"} />
            </button>
            {open === i && (
              <p className="px-4 pb-4 text-sm leading-relaxed text-muted">{item.a[locale]}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
