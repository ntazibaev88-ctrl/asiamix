import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TopBar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Target, Repeat2, TrendingUp, Flame, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { formatDate, getMoodEmoji } from '@/lib/utils'

const quotes = [
  'Әр үлкен жетістік бір қадамнан басталады.',
  'Бүгін жасаған іс, ертеңгі болашақты қалыптастырады.',
  'Мақсат — арманды іске асыруға мүмкіндік береді.',
  'Ең ұзақ сапар бір қадамнан басталады.',
  'Өзіңізге сеніңіз. Сіз ойлағаннан да мықтысыз.',
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]
  const todayQuote = quotes[new Date().getDay() % quotes.length]
  const greeting = new Date().getHours() < 12
    ? 'Қайырлы таң' : new Date().getHours() < 18
    ? 'Қайырлы күн' : 'Қайырлы кеш'

  // Fetch data in parallel
  const [profileRes, diaryRes, goalsRes, habitsRes, transRes] = await Promise.all([
    supabase.from('profiles').select('full_name, plan, avatar_url').eq('id', user.id).single(),
    supabase.from('diary_entries').select('id, title, date, mood').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
    supabase.from('goals').select('id, title, progress, category, completed').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('habits').select('id, title, streak, color').eq('user_id', user.id).order('streak', { ascending: false }).limit(5),
    supabase.from('transactions').select('amount, type').eq('user_id', user.id).gte('date', today.substring(0, 7) + '-01'),
  ])

  const profile = profileRes.data
  const diaryEntries = diaryRes.data ?? []
  const goals = goalsRes.data ?? []
  const habits = habitsRes.data ?? []
  const transactions = transRes.data ?? []

  const totalDiary = diaryEntries.length
  const completedGoals = goals.filter((g) => g.completed).length
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak ?? 0), 0)

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const categoryEmojis: Record<string, string> = {
    house: '🏠', car: '🚗', business: '💼', education: '📚',
    travel: '✈️', family: '👨‍👩‍👧', health: '💪', other: '⭐',
  }

  return (
    <div>
      <TopBar
        title={`${greeting}, ${profile?.full_name?.split(' ')[0] ?? 'Қош келдіңіз'}`}
        userName={profile?.full_name ?? user.email ?? ''}
        userAvatar={profile?.avatar_url ?? undefined}
      />

      <div className="mt-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Күнделік жазба', value: totalDiary, color: 'text-violet-500', bg: 'bg-violet-500/10', href: '/diary' },
            { icon: Target, label: 'Орындалған мақсат', value: completedGoals, color: 'text-emerald-500', bg: 'bg-emerald-500/10', href: '/goals' },
            { icon: Flame, label: 'Үздік қатар', value: `${maxStreak} күн`, color: 'text-orange-500', bg: 'bg-orange-500/10', href: '/habits' },
            {
              icon: TrendingUp,
              label: 'Осы ай балансы',
              value: `${balance.toLocaleString()} ₸`,
              color: balance >= 0 ? 'text-emerald-500' : 'text-red-500',
              bg: balance >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
              href: '/finance',
            },
          ].map(({ icon: Icon, label, value, color, bg, href }) => (
            <Link key={label} href={href}>
              <Card className="p-4 hover:shadow-md dark:hover:shadow-black/20 transition-shadow cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">{value}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily quote */}
          <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 border-amber-100 dark:border-zinc-700">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">Күндік дәйексөз</span>
            </div>
            <blockquote className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-zinc-100 leading-relaxed italic">
              "{todayQuote}"
            </blockquote>
          </Card>

          {/* Premium upsell for free users */}
          {profile?.plan !== 'premium' && (
            <Card className="p-6 border-amber-200 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10">
              <Badge variant="gold" className="mb-3">
                <Sparkles className="w-3 h-3" />
                Премиум
              </Badge>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 leading-relaxed">
                Шексіз мақсаттар, дағдылар, аналитика және PIN қорғанысы.
              </p>
              <Link href="/pricing">
                <button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2.5 text-sm font-medium transition-colors shadow-lg shadow-amber-500/20">
                  Жаңарту
                </button>
              </Link>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent diary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-violet-500" />
                  Соңғы жазбалар
                </CardTitle>
                <Link href="/diary" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Барлығы →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {diaryEntries.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">Күнделік жазба жоқ</p>
                  <Link href="/diary" className="text-xs text-amber-600 dark:text-amber-400 hover:underline mt-1 inline-block">
                    Жазба қосу →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {diaryEntries.map((entry) => (
                    <Link key={entry.id} href="/diary" className="flex items-center gap-3 group">
                      <div className="text-xl">{getMoodEmoji(entry.mood ?? 3)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {entry.title || 'Атсыз жазба'}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {formatDate(entry.date, 'kk')}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-500" />
                  Мақсаттар
                </CardTitle>
                <Link href="/goals" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Барлығы →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-sm text-zinc-400">Мақсат жоқ</p>
                  <Link href="/goals" className="text-xs text-amber-600 dark:text-amber-400 hover:underline mt-1 inline-block">
                    Мақсат қосу →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">{categoryEmojis[goal.category] ?? '⭐'}</span>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 flex-1 truncate">
                          {goal.title}
                        </p>
                        {goal.completed && <Badge variant="success">✓</Badge>}
                        {!goal.completed && (
                          <span className="text-xs text-zinc-400">{goal.progress}%</span>
                        )}
                      </div>
                      {!goal.completed && (
                        <Progress value={goal.progress} size="sm" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Habits */}
        {habits.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Repeat2 className="w-4 h-4 text-blue-500" />
                  Дағдылар
                </CardTitle>
                <Link href="/habits" className="text-xs text-amber-600 dark:text-amber-400 hover:underline">
                  Барлығы →
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 text-center"
                  >
                    <div className="text-2xl">🔥</div>
                    <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-full">
                      {habit.title}
                    </div>
                    <div className="text-xs text-zinc-400">
                      {habit.streak ?? 0} күн
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
