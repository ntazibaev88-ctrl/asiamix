'use client'
import Link from 'next/link'
import { useT } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Check, Sparkles, X } from 'lucide-react'
import type { Metadata } from 'next'

const freePlan = [
  { text: '50 күнделік жазба', included: true },
  { text: '5 мақсат', included: true },
  { text: 'Негізгі статистика', included: true },
  { text: 'Мақалаларды оқу', included: true },
  { text: 'Шексіз жазбалар', included: false },
  { text: 'PIN қорғанысы', included: false },
  { text: 'Озат аналитика', included: false },
  { text: 'Шексіз дағдылар', included: false },
]

const premiumPlan = [
  { text: 'Шексіз күнделік жазба', included: true },
  { text: 'Шексіз мақсаттар', included: true },
  { text: 'Шексіз дағдылар', included: true },
  { text: 'Мақалаларды оқу', included: true },
  { text: 'Озат аналитика', included: true },
  { text: 'PIN қорғанысы', included: true },
  { text: 'Басымдықты функциялар', included: true },
  { text: 'Алғашқы 2 ай тегін', included: true },
]

export default function PricingPage() {
  const t = useT()

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="gold" className="mb-4 inline-flex">
            <Sparkles className="w-3 h-3" />
            {t.landing.pricing}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Қарапайым баға
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400">
            Алғашқы 2 ай тегін. Ешқандай несие карта қажет емес.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free */}
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                {t.landing.freePlan}
              </h2>
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-4">
                0 ₸
              </div>
              <p className="text-zinc-400 text-sm mt-1">Ешқашан төлем жоқ</p>
            </div>
            <ul className="space-y-3 mb-8">
              {freePlan.map(({ text, included }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  {included ? (
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                  )}
                  <span className={included ? 'text-zinc-700 dark:text-zinc-300' : 'text-zinc-400 dark:text-zinc-600'}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full">
                Тегін бастау
              </Button>
            </Link>
          </Card>

          {/* Premium */}
          <Card className="p-8 border-2 border-amber-500 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {t.landing.premiumPlan}
                </h2>
                <Badge variant="premium">
                  <Sparkles className="w-3 h-3" />
                  Ең жақсы
                </Badge>
              </div>
              <div className="flex items-baseline gap-2 mt-4">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">990 ₸</span>
                <span className="text-zinc-400">/ай</span>
              </div>
              <p className="text-amber-600 dark:text-amber-400 text-sm font-medium mt-1">
                Алғашқы 2 ай тегін!
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {premiumPlan.map(({ text, included }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">{text}</span>
                </li>
              ))}
            </ul>
            <Link href="/register">
              <Button size="lg" className="w-full shadow-lg shadow-amber-500/30">
                2 ай тегін бастау
              </Button>
            </Link>
          </Card>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 text-center mb-10">
            Жиі қойылатын сұрақтар
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'Несие карта керек пе?',
                a: 'Жоқ. Тегін кезеңде несие карта қажет емес. Премиумға кез келген уақытта өтуге болады.',
              },
              {
                q: 'Тегін кезеңнен кейін не болады?',
                a: '2 ай өткен соң сіз таңдайсыз: Тегін жоспарға қалу немесе Премиумды жалғастыру.',
              },
              {
                q: 'Деректерім қауіпсіз бе?',
                a: 'Иә. Барлық деректер шифрланған және тек сізге қол жетімді. Ешкімге сатпаймыз.',
              },
              {
                q: 'Жазылымды тоқтату оңай ба?',
                a: 'Иә. Кез келген уақытта баптаулардан жазылымды тоқтатуға болады.',
              },
            ].map(({ q, a }) => (
              <Card key={q} className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{q}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{a}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
