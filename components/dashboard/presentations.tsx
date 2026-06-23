"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const presentations = [
  {
    id: "goals",
    title: "Қалай мақсатқа жетуге болады",
    emoji: "🎯",
    color: "from-violet-600/20 to-purple-600/20",
    borderColor: "border-violet-500/20",
    accentColor: "text-violet-400",
    dotColor: "bg-violet-500",
    slides: [
      {
        num: "01",
        title: "Мақсат не үшін қажет?",
        body: "Мақсатсыз адам бағыты жоқ кемедей. Нақты мақсат — дұрыс шешім қабылдаудың негізі. Зерттеулер бойынша мақсатын жазған адамдар оны 42%-ке жиірек орындайды.",
        emoji: "🧭",
      },
      {
        num: "02",
        title: "SMART мақсат",
        body: "Мақсатыңыз SMART болуы керек:\n• Specific — нақты\n• Measurable — өлшемді\n• Achievable — қол жетімді\n• Relevant — маңызды\n• Time-bound — мерзімді",
        emoji: "📋",
      },
      {
        num: "03",
        title: "Мақсатты жазып қою",
        body: "Мақсатыңызды ашық жазып қойыңыз. «Ақша жинаймын» емес, «2025 жылдың желтоқсанына дейін 500 000 теңге жинаймын» — осылай нақтылаңыз.",
        emoji: "✍️",
      },
      {
        num: "04",
        title: "Кішкентай қадамдар",
        body: "Үлкен мақсатты шағын міндеттерге бөліңіз. Күн сайын 1 қадам жасаңыз. 30 күнде 30 қадам — бұл орасан зор прогресс.",
        emoji: "👣",
      },
      {
        num: "05",
        title: "Прогресті бақылау",
        body: "Аптасына бір рет прогресіңізді тексеріңіз. Нені жасадыңыз? Қандай кедергі болды? Қалай жақсартуға болады? Жазып отырыңыз.",
        emoji: "📊",
      },
      {
        num: "06",
        title: "Мотивация сақтау",
        body: "Мақсатыңызға неге қол жеткізгіңіз келеді? Сол «Неліктен?» сұрағын есіңізде ұстаңыз. Әрбір шағын жеңісті тойлаңыз — бұл алға жылжудың отыны.",
        emoji: "🔥",
      },
    ],
  },
  {
    id: "savings",
    title: "Қалай қаржы жинауды үйренуге болады",
    emoji: "💰",
    color: "from-emerald-600/20 to-teal-600/20",
    borderColor: "border-emerald-500/20",
    accentColor: "text-emerald-400",
    dotColor: "bg-emerald-500",
    slides: [
      {
        num: "01",
        title: "Жинақтаудың маңызы",
        body: "Жинақ — қаржылық еркіндіктің бірінші қадамы. Жинақ болмаса, кез келген күтпеген жағдай: ауру, жұмыссыздық — сізді қарызға итереді.",
        emoji: "🛡️",
      },
      {
        num: "02",
        title: "50/30/20 ережесі",
        body: "Кірісіңізді осылай бөліңіз:\n• 50% — тұрмыстық қажеттіліктер\n• 30% — ләззат пен демалыс\n• 20% — жинақ пен инвестиция\n\nБасты жинақты бірінші аударыңыз!",
        emoji: "📐",
      },
      {
        num: "03",
        title: "Автоматты жинақ",
        body: "Жалақы келген күні жинақ шотына автоматты аудару орнатыңыз. «Артылғанын жинаймын» деген ешқашан жұмыс істемейді. Алдымен жинаңыз, одан кейін жұмсаңыз.",
        emoji: "⚙️",
      },
      {
        num: "04",
        title: "Шығындарды азайту",
        body: "30 күн бойы барлық шығындарыңызды жазыңыз. Не жұмсайтыныңызды білген соң, қажетсіз шығындарды оңай табасыз. Кофе, сплатформалар, жиі жеп алу — осыларды тексеріңіз.",
        emoji: "✂️",
      },
      {
        num: "05",
        title: "Депозит пен инвестиция",
        body: "Жинақтаған ақшаңызды жұмысқа жіберіңіз:\n• Депозит — жылдық 14-16% (қауіпсіз)\n• Облигация — тұрақты кіріс\n• Акция — ұзақ мерзімді өсім\n\nИнфляция ақшаңызды жейді, инвестиция сақтайды.",
        emoji: "📈",
      },
      {
        num: "06",
        title: "Қаржылық жастықша",
        body: "Ең алдымен 3-6 айлық шығындарыңызға тең «жастықша» жинаңыз. Бұл — қаржылық қауіпсіздіктің негізі. Жастықша болса, кез келген дағдарысты сабырмен қарсы аласыз.",
        emoji: "🏦",
      },
    ],
  },
];

export function Presentations() {
  const [activePresentation, setActivePresentation] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const pres = presentations[activePresentation];
  const slide = pres.slides[currentSlide];
  const total = pres.slides.length;

  const prev = () => setCurrentSlide((s) => (s === 0 ? total - 1 : s - 1));
  const next = () => setCurrentSlide((s) => (s === total - 1 ? 0 : s + 1));

  const switchPresentation = (index: number) => {
    setActivePresentation(index);
    setCurrentSlide(0);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {presentations.map((p, i) => (
          <button
            key={p.id}
            onClick={() => switchPresentation(i)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all border ${
              activePresentation === i
                ? `bg-gradient-to-r ${p.color} ${p.borderColor} ${p.accentColor}`
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)]"
            }`}
          >
            {p.emoji} {p.title.split(" ").slice(0, 3).join(" ")}…
          </button>
        ))}
      </div>

      <div className={`rounded-2xl bg-gradient-to-br ${pres.color} border ${pres.borderColor} overflow-hidden`}>
        <div className={`px-5 py-3 border-b ${pres.borderColor} flex items-center justify-between`}>
          <span className={`font-semibold text-sm ${pres.accentColor}`}>
            {pres.emoji} {pres.title}
          </span>
          <span className="text-xs text-[var(--muted-foreground)]">
            {currentSlide + 1} / {total}
          </span>
        </div>

        <div className="p-5 min-h-[180px] flex flex-col justify-between">
          <div>
            <div className={`text-xs font-bold ${pres.accentColor} mb-2`}>
              {slide.num} / 0{total}
            </div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{slide.emoji}</span>
              <h3 className="font-bold text-base leading-snug">{slide.title}</h3>
            </div>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
              {slide.body}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1.5">
              {pres.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`rounded-full transition-all ${
                    i === currentSlide
                      ? `w-5 h-2 ${pres.dotColor}`
                      : "w-2 h-2 bg-[var(--border)]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--border)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
