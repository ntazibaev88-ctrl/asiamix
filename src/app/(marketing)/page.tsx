'use client'
import Link from 'next/link'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  BookOpen, Target, Repeat2, Wallet, ImageIcon, Newspaper,
  Shield, Sparkles, TrendingUp, Lock, Check, ArrowRight, Star
} from 'lucide-react'

const quotes = [
  'Әр үлкен жетістік бір қадамнан басталады.',
  'Мақсатқа жету үшін алдымен оны белгілеу керек.',
  'Ең ұзақ сапар бір қадамнан басталады.',
]

const features = [
  {
    icon: BookOpen,
    titleKk: 'Жеке күнделік',
    titleRu: 'Личный дневник',
    titleEn: 'Private Diary',
    descKk: 'Жазбаларыңыз тек сізге арналған. Настрой, тегтер, күнтізбе.',
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Target,
    titleKk: 'Мақсаттар',
    titleRu: 'Цели и мечты',
    titleEn: 'Goals & Dreams',
    descKk: 'Арманыңызды жазыңыз, прогресіңізді қадағалаңыз.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Repeat2,
    titleKk: 'Дағдылар',
    titleRu: 'Трекер привычек',
    titleEn: 'Habit Tracker',
    descKk: 'Күнделікті дағдыларды қадағалаңыз, streak есептегіші.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Wallet,
    titleKk: 'Жеке қаржы',
    titleRu: 'Личные финансы',
    titleEn: 'Personal Finance',
    descKk: 'Кіріс, шығыс, жинақ, аналитика — бәрі бір жерде.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: ImageIcon,
    titleKk: 'Арман тақтасы',
    titleRu: 'Доска мечты',
    titleEn: 'Vision Board',
    descKk: 'Арманыңызды суреттермен бейнелеңіз.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Newspaper,
    titleKk: 'Мақалалар',
    titleRu: 'Статьи',
    titleEn: 'Articles',
    descKk: 'Инвестиция, алтын, бизнес және мотивация мақалалары.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-500/10',
  },
]

const testimonials = [
  { name: 'Айгерім Б.', text: 'Qadam менің өмірімді өзгертті. Мақсаттарым айқын болды.', rating: 5 },
  { name: 'Дамир С.', text: 'Күнделік жазу дағдысы алдын-ала ойлауыма көмектесті.', rating: 5 },
  { name: 'Зарина М.', text: 'Қаржы модулі өте ыңғайлы. Шығысымды бақылап алдым.', rating: 5 },
]

export default function LandingPage() {
  const t = useT()

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <Badge variant="gold" className="mb-6 inline-flex">
            <Sparkles className="w-3 h-3" />
            Privacy First Platform
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-6">
            Әр үлкен жетістік{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              бір қадамнан
            </span>{' '}
            басталады.
          </h1>

          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.landing.heroSub}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 shadow-xl shadow-amber-500/30 px-8">
                {t.landing.getStarted}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8">
                {t.landing.learnMore}
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              {t.landing.firstTwoMonths}
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-500" />
              {t.landing.privacyFirst}
            </span>
          </div>

          {/* Floating cards preview */}
          <div className="mt-16 grid grid-cols-3 gap-3 max-w-lg mx-auto opacity-80">
            {[
              { label: '50K+', sub: 'Пайдаланушы' },
              { label: '98%', sub: 'Риза болды' },
              { label: '4.9★', sub: 'Бағалау' },
            ].map(({ label, sub }) => (
              <Card key={sub} className="p-4 text-center">
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{label}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{sub}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="default" className="mb-4">Мүмкіндіктер</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Бәрі бір платформада
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Өзіңізді дамыту үшін қажет барлық инструменттер жеке және қауіпсіз.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, titleKk, descKk, color, bg }) => (
              <Card key={titleKk} className="p-6 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow group">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{titleKk}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{descKk}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-700 p-8 md:p-12 text-white text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Privacy First</h2>
            <p className="text-zinc-300 max-w-xl mx-auto mb-8 leading-relaxed">
              Барлық деректеріңіз жеке. Ешкім — тіпті біз де — деректеріңізге қол жеткізе алмайды.
              Деректер тек сізге ғана қол жетімді.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Lock, text: 'Шифрланған сақтау' },
                { icon: Shield, text: 'Жеке деректер саясаты' },
                { icon: TrendingUp, text: 'Деректеріңізді сатпаймыз' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                  <Icon className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-sm text-zinc-300">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4">Пікірлер</Badge>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Пайдаланушылар не айтады?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, text, rating }) => (
              <Card key={name} className="p-6">
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed mb-4">"{text}"</p>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">{name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="gold" className="mb-4">
            <Sparkles className="w-3 h-3" />
            Баға
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Қарапайым баға
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-12">
            Алғашқы 2 ай тегін. Одан кейін айына 990 ₸ ғана.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="p-8 text-left">
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Тегін</div>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">0 ₸</div>
              {['50 күнделік жазба', '5 мақсат', 'Негізгі статистика'].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  <Check className="w-4 h-4 text-emerald-500" /> {f}
                </div>
              ))}
              <Link href="/register" className="block mt-6">
                <Button variant="outline" className="w-full">Бастау</Button>
              </Link>
            </Card>

            <Card className="p-8 text-left border-2 border-amber-500 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge variant="premium">Ең жақсы</Badge>
              </div>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">Премиум</div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">990 ₸</span>
                <span className="text-zinc-400 text-sm">/ай</span>
              </div>
              {[
                'Шексіз күнделік жазба',
                'Шексіз мақсаттар',
                'Шексіз дағдылар',
                'Озат аналитика',
                'PIN қорғанысы',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  <Check className="w-4 h-4 text-amber-500" /> {f}
                </div>
              ))}
              <Link href="/register" className="block mt-6">
                <Button className="w-full shadow-lg shadow-amber-500/30">
                  {t.landing.firstTwoMonths}
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Бүгін бастаңыз
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-lg">
            Мақсатыңызды қойыңыз. Қадам жасаңыз. Жетістікке жетіңіз.
          </p>
          <Link href="/register">
            <Button size="lg" className="shadow-2xl shadow-amber-500/30 px-10 gap-2">
              Тегін тіркелу
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
