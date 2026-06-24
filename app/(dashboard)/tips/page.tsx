import { Lightbulb } from "lucide-react";

const allTips = [
  { tip: "Кірісіңіздің 20%-ін жинаққа салыңыз. 50/30/20 ережесі: 50% қажеттілік, 30% тілек, 20% жинақ.", emoji: "💡", category: "Жинақ" },
  { tip: "Депозит ашу — ақшаңызды жұмысқа жіберудің ең қауіпсіз жолы. Қазақстанда жылдық 14–16% пайыз бар.", emoji: "🏦", category: "Инвестиция" },
  { tip: "Шығындарыңызды жазып отырыңыз. Не жұмсайтыныңызды білмей, жинауға болмайды.", emoji: "📊", category: "Қаржы" },
  { tip: "Кредит картасының қарызын толығымен өтеңіз. Айлық пайыз жылдық 30–40%-ке жетуі мүмкін.", emoji: "💳", category: "Қарыз" },
  { tip: "Алтынға инвестиция — инфляциядан қорғаудың классикалық әдісі. Ұлттық Банктен монета сатып алуға болады.", emoji: "🥇", category: "Инвестиция" },
  { tip: "Апта сайын кем дегенде 1 қаржы мақаласын оқыңыз. Білім — ең жақсы инвестиция.", emoji: "📚", category: "Білім" },
  { tip: "Қаржылық жастықша жасаңыз: 3–6 айлық шығындарыңызды депозитке салыңыз.", emoji: "🛡️", category: "Жинақ" },
  { tip: "Жалақы алған күні бірінші болып жинақ шотыңызға аударыңыз. Автоматты жинақ — ең тиімді әдіс.", emoji: "⚙️", category: "Жинақ" },
  { tip: "Импульсивті сатып алудан аулақ болыңыз. «24 сағат ереже»: сатып алмас бұрын бір күн ойланыңыз.", emoji: "🛒", category: "Қаржы" },
  { tip: "Кіріс көздерін диверсификациялаңыз. Бір жұмысқа тәуелді болмаңыз — бизнес, фриланс, инвестиция.", emoji: "🌐", category: "Кіріс" },
  { tip: "Акцияларға инвестиция ету үшін ұзақ мерзімді ойлаңыз. Қысқа мерзімде баға ауытқиды, ұзақта өседі.", emoji: "📈", category: "Инвестиция" },
  { tip: "Зейнетақыға ерте жинай бастаңыз. Күрделі пайыз уақыт өткен сайын керемет нәтиже береді.", emoji: "🧓", category: "Болашақ" },
  { tip: "Сақтандыру — шығын емес, қорғаныс. Денсаулық, мүлік, өмір сақтандыруын қарастырыңыз.", emoji: "🔒", category: "Қорғаныс" },
  { tip: "Облигациялар — тұрақты кіріс алудың жолы. Мемлекеттік облигациялар ең қауіпсіз деп саналады.", emoji: "📜", category: "Инвестиция" },
];

export default function TipsPage() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const todayIndex = dayOfYear % allTips.length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white">
        <div className="absolute top-3 right-6 text-6xl opacity-10">💡</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb className="h-5 w-5" />
            <h1 className="text-xl font-bold">Қаржылық кеңестер</h1>
          </div>
          <p className="text-sm text-white/70">{allTips.length} пайдалы кеңес • Күн сайын жаңасы ерекшеленеді</p>
        </div>
      </div>

      {/* Today's tip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600/15 to-violet-700/15 border border-primary-500/20 p-5">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-primary-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm">🔥</span>
            <span className="font-semibold text-primary-400 text-xs uppercase tracking-wide">Бүгінгі кеңес</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400">
              {allTips[todayIndex].category}
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            <span className="text-2xl mr-2">{allTips[todayIndex].emoji}</span>
            {allTips[todayIndex].tip}
          </p>
        </div>
      </div>

      {/* All tips */}
      <h2 className="font-semibold text-[var(--muted-foreground)] text-sm uppercase tracking-wider">Барлық кеңестер</h2>
      <div className="space-y-3">
        {allTips.map((item, i) => (
          <div
            key={i}
            className={`rounded-2xl border p-4 transition-all ${
              i === todayIndex
                ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
                : "bg-[var(--card)] border-[var(--border)]"
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)]">
                    {item.category}
                  </span>
                  {i === todayIndex && (
                    <span className="text-xs font-semibold text-amber-600">● Бүгін</span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">{item.tip}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
