"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/landing/count-up";
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
  ArrowUp,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

function ScrollReveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={fadeUp}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const features = [
    {
      icon: Target,
      title: "Мақсат қою",
      description: "Үй, көлік, бизнес, білім — кез-келген мақсатыңызды жоспарлаңыз және прогрессіңізді бақылаңыз.",
      color: "from-[#6D5EF6] to-violet-600",
      accent: "rgba(109,94,246,0.15)",
      span: "md:col-span-2",
      big: true,
    },
    {
      icon: PiggyBank,
      title: "Жинақ жоспарлаушы",
      description: "Айлық жинақтарыңызды есептеңіз, қаржылық мақсаттарыңызды орнатыңыз.",
      color: "from-emerald-500 to-teal-600",
      accent: "rgba(0,200,150,0.15)",
      span: "",
    },
    {
      icon: GraduationCap,
      title: "Қаржылық білім",
      description: "Инвестиция, алтын, күміс, облигациялар туралы тереңдетілген мақалалар мен нұсқаулар.",
      color: "from-amber-500 to-orange-600",
      accent: "rgba(245,158,11,0.12)",
      span: "",
    },
    {
      icon: BookMarked,
      title: "Жеке күнделік",
      description: "Толық жеке күнделік — настроение бақылаушы, тегтер, күнтізбе көрінісі.",
      color: "from-rose-500 to-pink-600",
      accent: "rgba(244,63,94,0.12)",
      span: "md:col-span-2",
      big: true,
    },
    {
      icon: BookOpen,
      title: "Кітаптар кітапханасы",
      description: "Ақша, бизнес, жеке даму туралы ең жақсы кітаптардың таңдамасы.",
      color: "from-cyan-500 to-blue-600",
      accent: "rgba(6,182,212,0.12)",
      span: "",
    },
    {
      icon: Film,
      title: "Фильмдер",
      description: "Табыс, ақша және бизнес туралы ең жақсы фильмдер мен документалдар.",
      color: "from-purple-500 to-indigo-600",
      accent: "rgba(168,85,247,0.12)",
      span: "md:col-span-2",
    },
  ];

  const stats = [
    { value: 10000, suffix: "+", label: "Белсенді пайдаланушы" },
    { value: 50000, suffix: "+", label: "Орындалған мақсат" },
    { value: 2, prefix: "₸", suffix: " млрд+", label: "Жинақталған қаражат" },
    { value: 4.9, suffix: "★", label: "Пайдаланушы бағасы" },
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
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 hero-gradient overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#6D5EF6]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-violet-500/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00C896]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)] border border-[var(--primary)]/30 text-[var(--accent-foreground)] text-sm font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Қазақстандағы №1 жеке даму платформасы
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-6 leading-[1.1]"
            >
              Болашағыңа{" "}
              <span className="gradient-text">бүгіннен</span>{" "}
              бастап қадам жаса
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Мақсат қою, қаржылық сауаттылық, жинақтар, инвестициялар және
              жеке даму — бәрі бір жерде. Qadam-мен өміріңізді жоспарлаңыз.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto btn-glow">
                  Тегін бастау
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Мүмкіндіктерді көру
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeUp} className="mt-4 text-sm text-[var(--muted-foreground)]">
              Тегін тіркеліңіз • Кредит карта қажет емес
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/40 transition-all duration-300"
              >
                <div className="text-3xl font-bold gradient-text mb-1">
                  <CountUp
                    to={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
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
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 60} className={feature.span}>
                <div
                  className="group relative p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full"
                  style={{
                    background: `linear-gradient(135deg, var(--card), color-mix(in srgb, var(--card) 85%, ${feature.accent}))`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${feature.accent} 0%, transparent 70%)`,
                    }}
                  />

                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg relative`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>

                  <div className="relative">
                    <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {feature.big && (
                    <div className="mt-4 relative">
                      <div className="h-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${feature.color} rounded-full`}
                          style={{ width: "68%" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1.5 text-xs text-[var(--muted-foreground)]">
                        <span>68% орындалды</span>
                        <span>₸1,700,000 / ₸2,500,000</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Education */}
      <section id="education" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <div className="inline-flex px-3 py-1 rounded-full bg-[var(--accent)] border border-[var(--primary)]/30 text-[var(--accent-foreground)] text-xs font-medium mb-4">
                  Қаржылық білім
                </div>
                <h2 className="text-4xl font-bold text-[var(--foreground)] mb-6">
                  Қаржылық сауаттылықты арттырыңыз
                </h2>
                <p className="text-lg text-[var(--muted-foreground)] mb-8 leading-relaxed">
                  Инвестиция, алтын, облигациялар, бизнес — қаржы әлеміндегі
                  барлық маңызды тақырыптар бойынша тереңдетілген мақалалар мен нұсқаулар.
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
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors"
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
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="relative">
                <div className="rounded-2xl bg-gradient-to-br from-[#6D5EF6] to-violet-700 p-8 text-white shadow-2xl shadow-[#6D5EF6]/25">
                  <div className="text-sm font-medium opacity-80 mb-2">Инвестиция негіздері</div>
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
                  <div className="text-xs text-[var(--muted-foreground)] mb-1">Жинақ мақсаты</div>
                  <div className="text-lg font-bold text-[var(--foreground)]">₸5,000,000</div>
                  <div className="mt-2 h-2 bg-[var(--secondary)] rounded-full">
                    <div className="h-2 w-3/5 bg-gradient-to-r from-[#00C896] to-teal-500 rounded-full" />
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--success, #00C896)" }}>
                    60% орындалды
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16">
              <div className="inline-flex px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] text-xs font-medium mb-4">
                Пікірлер
              </div>
              <h2 className="text-4xl font-bold text-[var(--foreground)] mb-4">
                Пайдаланушылар не дейді?
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 80}>
                <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] hover:border-[var(--primary)]/30 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--foreground)] leading-relaxed mb-6">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-[var(--muted-foreground)]">{t.role}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="premium" className="py-24 px-4 sm:px-6 lg:px-8 bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
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
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <ScrollReveal>
              <div className="p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] h-full">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-1">Тегін</h3>
                  <div className="text-4xl font-bold text-[var(--foreground)]">₸0</div>
                  <div className="text-sm text-[var(--muted-foreground)] mt-1">Мәңгілік тегін</div>
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
                  <Button variant="outline" className="w-full">Тегін тіркелу</Button>
                </Link>
              </div>
            </ScrollReveal>

            {/* VIP */}
            <ScrollReveal delay={100}>
              <div className="relative p-8 rounded-2xl glow-border-violet bg-gradient-to-br from-[#6D5EF6] to-violet-700 text-white shadow-2xl h-full">
                <div className="absolute top-4 right-4">
                  <div className="px-2.5 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                    Ең танымал
                  </div>
                </div>

                {/* Ambient glow overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                <div className="mb-6 relative">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="h-5 w-5 text-amber-300" />
                    <h3 className="text-xl font-bold">VIP</h3>
                  </div>
                  <div className="text-4xl font-bold">₸990</div>
                  <div className="text-sm opacity-80 mt-1">айына</div>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm mb-6 text-sm relative">
                  🎁 <strong>Арнайы ұсыныс:</strong> 1 ай төлеңіз + 1 ай тегін алыңыз!
                </div>

                <ul className="space-y-3 mb-8 relative">
                  {vipPlanFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="h-4 w-4 text-white/80 mt-0.5 shrink-0" />
                      <span className="opacity-90">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="relative">
                  <Button className="w-full bg-white text-[#6D5EF6] hover:bg-white/90 font-semibold shadow-lg">
                    <Zap className="h-4 w-4" />
                    VIP бастау
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Referral */}
          <ScrollReveal delay={100}>
            <div className="mt-12 text-center p-6 rounded-2xl bg-[var(--card)] border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl mb-2">👥</div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Достарыңызды шақырыңыз
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Досыңызды шақырсаңыз, екеуіңіз де тегін VIP күндер аласыздар!
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6D5EF6]/8 via-transparent to-violet-500/6 pointer-events-none" />
        <ScrollReveal>
          <div className="max-w-4xl mx-auto text-center relative">
            <h2 className="text-4xl sm:text-5xl font-bold text-[var(--foreground)] mb-6">
              Болашағыңа <span className="gradient-text">қазір</span> қадам жаса
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] mb-10">
              10,000+ адам Qadam-ды таңдады. Сіздің кезегіңіз.
            </p>
            <Link href="/register">
              <Button variant="gradient" size="xl" className="btn-glow">
                Тегін бастау
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              Кредит карта қажет емес • 2 минутта тіркелу
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D5EF6] to-violet-600 flex items-center justify-center">
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
                <li><Link href="/register" className="hover:text-[var(--foreground)] transition-colors">Тіркелу</Link></li>
                <li><Link href="/login" className="hover:text-[var(--foreground)] transition-colors">Кіру</Link></li>
                <li><Link href="#premium" className="hover:text-[var(--foreground)] transition-colors">Premium</Link></li>
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
                  <a href="mailto:support@qadam.kz" className="hover:text-[var(--foreground)] transition-colors">
                    support@qadam.kz
                  </a>
                </li>
                <li>
                  <a href="https://t.me/qadam_kz" className="hover:text-[var(--foreground)] transition-colors">
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--muted-foreground)]">
            <p>&copy; 2025 Qadam. Барлық құқықтар қорғалған.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Құпиялылық</Link>
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Шарттар</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-xl bg-gradient-to-br from-[#6D5EF6] to-violet-600 text-white flex items-center justify-center shadow-lg btn-glow hover:scale-110 transition-transform"
            aria-label="Жоғарыға"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
