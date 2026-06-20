import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  PiggyBank,
  GraduationCap,
  BookMarked,
  TrendingUp,
  BookOpen,
  Film,
  Shield,
  Zap,
  Star,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles,
  Crown,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Target,
      title: "Мақсат қою",
      description:
        "Үй, көлік, бизнес, білім — кез-келген мақсатыңызды жоспарлаңыз және прогрессіңізді бақылаңыз.",
      colorFrom: "from-primary-500",
      colorTo: "to-violet-600",
      bg: "bg-primary-50 dark:bg-primary-950/30",
    },
    {
      icon: PiggyBank,
      title: "Жинақ жоспарлаушы",
      description:
        "Айлық жинақтарыңызды есептеңіз, қаржылық мақсаттарыңызды орнатыңыз және прогрессіңізді көріңіз.",
      colorFrom: "from-emerald-500",
      colorTo: "to-teal-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      icon: GraduationCap,
      title: "Қаржылық білім",
      description:
        "Инвестиция, алтын, күміс, облигациялар туралы тереңдетілген мақалалар мен нұсқаулар.",
      colorFrom: "from-amber-500",
      colorTo: "to-orange-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      icon: BookMarked,
      title: "Жеке күнделік",
      description:
        "Толық жеке күнделік — настроение бақылаушы, тегтер, күнтізбе көрінісі.",
      colorFrom: "from-rose-500",
      colorTo: "to-pink-600",
      bg: "bg-rose-50 dark:bg-rose-950/30",
    },
    {
      icon: BookOpen,
      title: "Кітаптар кітапханасы",
      description:
        "Ақша, бизнес, жеке даму туралы ең жақсы кітаптардың таңдамасы.",
      colorFrom: "from-cyan-500",
      colorTo: "to-blue-600",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      icon: Film,
      title: "Фильмдер",
      description:
        "Табыс, ақша және бизнес туралы ең жақсы фильмдер мен документалдар.",
      colorFrom: "from-purple-500",
      colorTo: "to-indigo-600",
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Белсенді пайдаланушы" },
    { value: "50,000+", label: "Орындалған мақсат" },
    { value: "₸2 млрд+", label: "Жинақталған қаражат" },
    { value: "4.9★", label: "Пайдаланушы бағасы" },
  ];

  const testimonials = [
    {
      name: "Аружан М.",
      role: "Маркетинг менеджері",
      text: "Qadam-ның арқасында 6 ай ішінде үшінші пәтерге бастапқы жарна жинадым. Мақсат жоспарлау модулі өте ыңғайлы!",
      avatar: "А",
    },
    {
      name: "Дамир С.",
      role: "IT маман",
      text: "Қаржылық білім бөлімі — менің өміріме деген көзқарасымды өзгертті. Енді акцияларға инвестиция саламын.",
      avatar: "Д",
    },
    {
      name: "Малика Т.",
      role: "Кәсіпкер",
      text: "Жеке күнделік модулі маған өте ыңғайлы болды. Толық жеке, қауіпсіз және ыңғайлы.",
      avatar: "М",
    },
  ];

  const freePlanFeatures = [
    "3 мақсатқа дейін",
    "10 күнделік жазбаға дейін",
    "Негізгі қаржылық білім",
    "Кітаптар каталогы",
    "Жинақ калькуляторы",
  ];

  const vipPlanFeatures = [
    "Шексіз мақсаттар",
    "Шексіз күнделік жазбалары",
    "Толық қаржылық білім",
    "Premium кітаптар мен фильмдер",
    "Кеңейтілген аналитика",
    "Жинақ есептері",
    "Басымдықты қолдау",
    "Ерте рұқсат мүмкіндіктері",
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              <Sparkles className="h-3 w-3" />
              Қазақстандағы №1 жеке даму платформасы
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-6 leading-[1.1]">
              Болашағыңа{" "}
              <span className="gradient-text">бүгіннен</span>{" "}
              бастап қадам жаса
            </h1>

            <p className="text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Мақсат қою, қаржылық сауаттылық, жинақтар, инвестициялар және
              жеке даму — бәрі бір жерде. Qadam-мен өміріңізді жоспарлаңыз.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                  Тегін бастау
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Мүмкіндіктерді көру
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Тегін тіркеліңіз • Кредит карта қажет емес
            </p>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm"
              >
                <div className="text-3xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] text-xs font-medium mb-4">
              Мүмкіндіктер
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Бәрі бір платформада
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Жеке дамуыңыз үшін барлық қажетті құралдар
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-primary-200 dark:hover:border-primary-800 card-hover"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
                >
                  <div
                    className={`w-6 h-6 bg-gradient-to-br ${feature.colorFrom} ${feature.colorTo} rounded-lg flex items-center justify-center`}
                  >
                    <feature.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Education */}
      <section
        id="education"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-medium mb-4">
                Қаржылық білім
              </div>
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-6">
                Қаржылық сауаттылықты арттырыңыз
              </h2>
              <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed">
                Инвестиция, алтын, облигациялар, бизнес — қаржы әлеміндегі
                барлық маңызды тақырыптар бойынша тереңдетілген мақалалар мен
                нұсқаулар.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { emoji: "📈", label: "Инвестиция" },
                  { emoji: "🏅", label: "Алтын" },
                  { emoji: "🥈", label: "Күміс" },
                  { emoji: "📊", label: "Облигациялар" },
                  { emoji: "🐷", label: "Жинақ" },
                  { emoji: "💼", label: "Бизнес" },
                ].map((topic) => (
                  <div
                    key={topic.label}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                  >
                    <span className="text-xl">{topic.emoji}</span>
                    <span className="text-sm font-medium">{topic.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/register">
                <Button variant="gradient">
                  Білімді бастау
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 p-8 text-white shadow-2xl shadow-primary-500/25">
                <div className="text-sm font-medium opacity-80 mb-2">
                  Инвестиция негіздері
                </div>
                <h3 className="text-2xl font-bold mb-4">
                  Акцияларға қалай инвестиция салу керек?
                </h3>
                <p className="text-sm opacity-90 leading-relaxed mb-6">
                  Бастаушыларға арналған толық нұсқаулық. Қауіп-қатерді
                  бағалаудан бастап, портфолио құруға дейін.
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                    Q
                  </div>
                  <div>
                    <div className="text-sm font-medium">Qadam редакциясы</div>
                    <div className="text-xs opacity-70">12 минут оқу</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] p-4 shadow-xl">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">
                  Жинақ мақсаты
                </div>
                <div className="text-lg font-bold text-[var(--foreground)]">
                  ₸5,000,000
                </div>
                <div className="mt-2 h-2 bg-[var(--secondary)] rounded-full">
                  <div className="h-2 w-3/5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
                <div className="text-xs text-emerald-600 mt-1">
                  60% орындалды
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] text-xs font-medium mb-4">
              Пікірлер
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Пайдаланушылар не дейді?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="premium"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium mb-4">
              <Crown className="h-3 w-3" />
              Баға
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
              Өзіңізге сай жоспар таңдаңыз
            </h2>
            <p className="text-lg text-[var(--muted-foreground)]">
              Тегін бастаңыз, керек болса Premium-ға өтіңіз
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">Тегін</h3>
                <div className="text-4xl font-bold text-[var(--foreground)]">
                  ₸0
                </div>
                <div className="text-sm text-[var(--muted-foreground)] mt-1">
                  Мәңгілік тегін
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">
                  Тегін тіркелу
                </Button>
              </Link>
            </div>

            {/* VIP */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary-600 to-violet-700 text-white shadow-2xl shadow-primary-500/30">
              <div className="absolute top-4 right-4">
                <div className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                  Ең танымал
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="h-5 w-5 text-amber-300" />
                  <h3 className="text-xl font-bold">VIP</h3>
                </div>
                <div className="text-4xl font-bold">₸990</div>
                <div className="text-sm opacity-80 mt-1">айына</div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 mb-6 text-sm">
                🎁 <strong>Арнайы ұсыныс:</strong> 1 ай төлеңіз + 1 ай тегін
                алыңыз!
              </div>

              <ul className="space-y-3 mb-8">
                {vipPlanFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full bg-white text-primary-700 hover:bg-white/90 font-semibold">
                  <Zap className="h-4 w-4" />
                  VIP бастау
                </Button>
              </Link>
            </div>
          </div>

          {/* Referral */}
          <div className="mt-12 text-center p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
              Достарыңызды шақырыңыз
            </h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Досыңызды шақырсаңыз, екеуіңіз де тегін VIP күндер аласыздар!
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-6">
            Болашағыңа <span className="gradient-text">қазір</span> қадам жаса
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-10">
            10,000+ адам Qadam-ды таңдады. Сіздің кезегіңіз.
          </p>
          <Link href="/register">
            <Button variant="gradient" size="xl">
              Тегін бастау
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Кредит карта қажет емес • 2 минутта тіркелу
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-violet-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">Q</span>
                </div>
                <span className="text-lg font-bold gradient-text">Qadam</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Болашағыңа бүгіннен бастап қадам жаса.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Платформа</h4>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <Link
                    href="/register"
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    Тіркелу
                  </Link>
                </li>
                <li>
                  <Link
                    href="/login"
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    Кіру
                  </Link>
                </li>
                <li>
                  <Link
                    href="#premium"
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    Premium
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Мүмкіндіктер</h4>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>Мақсат қою</li>
                <li>Жинақ жоспарлаушы</li>
                <li>Қаржылық білім</li>
                <li>Жеке күнделік</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">Байланыс</h4>
              <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                <li>
                  <a
                    href="mailto:support@qadam.kz"
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    support@qadam.kz
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/qadam_kz"
                    className="hover:text-[var(--foreground)] transition-colors"
                  >
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
            <p>&copy; 2025 Qadam. Барлық құқықтар қорғалған.</p>
            <div className="flex gap-4">
              <Link
                href="/privacy"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Құпиялылық
              </Link>
              <Link
                href="/terms"
                className="hover:text-[var(--foreground)] transition-colors"
              >
                Шарттар
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
