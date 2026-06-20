'use client'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Shield, Heart, Globe, Zap, Footprints } from 'lucide-react'

const values = [
  {
    icon: Shield,
    title: 'Жеке деректер қорғанысы',
    desc: 'Сіздің деректеріңіз тек сізге тиесілі. Privacy first — бұл біздің негізгі қағидамыз.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Heart,
    title: 'Пайдаланушыға деген сүйіспеншілік',
    desc: 'Біз пайдаланушыларымыздың өміріне оң ықпал ету үшін жұмыс жасаймыз.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Globe,
    title: 'Қазақ тіліне бағытталған',
    desc: 'Qadam — қазақ тілінде жасалған, қазақ халқы үшін арналған платформа.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'Жылдам және сенімді',
    desc: 'Заманауи технологиялар: Next.js, Supabase, TypeScript — тез және сенімді жұмыс.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center mx-auto mb-6">
            <Footprints className="w-10 h-10 text-white" />
          </div>
          <Badge className="mb-4">Qadam туралы</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Біз кімбіз?
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Qadam — қазақ тілінде сөйлейтін адамдарға арналған жеке өсу, мақсат қою
            және қаржыны басқару платформасы.
          </p>
        </div>

        {/* Mission */}
        <Card className="p-8 md:p-12 mb-12 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 border-amber-100 dark:border-zinc-700">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Біздің миссия</h2>
          <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-lg">
            "Әр үлкен жетістік бір қадамнан басталады" — бұл тек слоган емес, бізге деген
            сенімімізіміз. Біз адамдардың мақсаттарына жетуіне, дағдыларын дамытуына
            және қаржылық тәуелсіздікке жетуіне жол ашамыз.
          </p>
        </Card>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 text-center">
            Біздің құндылықтарымыз
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc, color, bg }) => (
              <Card key={title} className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Story */}
        <Card className="p-8 md:p-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Біздің тарихымыз</h2>
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              Qadam жобасы қарапайым идеядан туындады: неге қазақ тілінде жеке өсуге арналған
              сапалы платформа жоқ?
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
              Біз адамдарға арман қоюға, мақсат белгілеуге, дағды дамытуға және қаржыны
              бақылауға мүмкіндік берумен қатар, барлығын жеке және қауіпсіз ортада жасаймыз.
            </p>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Platforma толық жеке: сіздің күнделігіңіз, мақсаттарыңыз, қаржылық деректеріңіз —
              тек сізге ғана белгілі.
            </p>
          </div>
        </Card>

        {/* Tech stack */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Технологиялар</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Next.js 16', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL'].map((tech) => (
              <Badge key={tech} variant="default" className="px-4 py-1.5 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
