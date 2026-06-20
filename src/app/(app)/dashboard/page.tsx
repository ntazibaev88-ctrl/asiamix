import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatRelativeTime, calcProgress } from '@/lib/utils'
import {
  BookOpen,
  Target,
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Главная' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: diaryEntries },
    { data: goals },
    { data: transactions },
    { data: savingsGoals },
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('diary_entries').select('id, title, created_at, mood').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(3),
    supabase.from('goals').select('*').eq('user_id', user!.id).eq('is_completed', false).limit(3),
    supabase.from('transactions').select('*').eq('user_id', user!.id).gte('date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase.from('savings_goals').select('*').eq('user_id', user!.id).limit(3),
  ])

  const income = (transactions || []).filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = (transactions || []).filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 17 ? 'Добрый день' : 'Добрый вечер'
  const name = profile?.full_name?.split(' ')[0] || 'друг'

  const moodEmoji: Record<string, string> = {
    great: '😄', good: '🙂', neutral: '😐', bad: '😔', terrible: '😢',
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={`${greeting}, ${name}!`}
        description="Ваш персональный дашборд"
        actions={
          <Link href="/diary/new">
            <Button size="sm">
              <Plus size={14} /> Запись в дневник
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen size={18} />}
            label="Записи"
            value={diaryEntries?.length?.toString() || '0'}
            sub="за последнее время"
            color="var(--accent)"
          />
          <StatCard
            icon={<Target size={18} />}
            label="Активных целей"
            value={goals?.length?.toString() || '0'}
            sub="в работе"
            color="var(--success)"
          />
          <StatCard
            icon={<TrendingUp size={18} />}
            label="Доходы"
            value={formatCurrency(income)}
            sub="за этот месяц"
            color="var(--success)"
          />
          <StatCard
            icon={<TrendingDown size={18} />}
            label="Расходы"
            value={formatCurrency(expense)}
            sub="за этот месяц"
            color="var(--danger)"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Finance Balance */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Баланс месяца</CardTitle>
                <Link href="/finance" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                  Детали <ArrowRight size={12} />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                {formatCurrency(balance)}
              </p>
              <div className="mt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Доходы</span>
                  <span className="text-[var(--success)] font-medium">+{formatCurrency(income)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Расходы</span>
                  <span className="text-[var(--danger)] font-medium">-{formatCurrency(expense)}</span>
                </div>
              </div>
              {income > 0 && (
                <div className="mt-4">
                  <Progress value={expense} max={income} color="var(--danger)" size="sm" />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                    {Math.round((expense / income) * 100)}% дохода потрачено
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Goals */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Мои цели</CardTitle>
                <Link href="/goals" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                  Все <ArrowRight size={12} />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {(goals || []).length === 0 ? (
                <EmptyState text="Нет активных целей" href="/goals/new" cta="Добавить цель" />
              ) : (
                goals!.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-sm font-medium text-[var(--text)] leading-tight">{goal.title}</p>
                      <Badge variant="default" className="ml-2 shrink-0">{goal.category}</Badge>
                    </div>
                    {goal.target_amount && (
                      <>
                        <Progress
                          value={calcProgress(goal.current_amount, goal.target_amount)}
                          size="sm"
                          showLabel
                        />
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">
                          {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                        </p>
                      </>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Diary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Дневник</CardTitle>
                <Link href="/diary" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                  Все <ArrowRight size={12} />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(diaryEntries || []).length === 0 ? (
                <EmptyState text="Записей нет" href="/diary/new" cta="Написать запись" />
              ) : (
                diaryEntries!.map((entry) => (
                  <Link key={entry.id} href={`/diary/${entry.id}`} className="block group">
                    <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-sm)] hover:bg-[var(--bg-secondary)] transition-colors">
                      <span className="text-xl shrink-0">{moodEmoji[entry.mood] || '📝'}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text)] truncate group-hover:text-[var(--accent)] transition-colors">
                          {entry.title || 'Без заголовка'}
                        </p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                          {formatRelativeTime(entry.created_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        {(savingsGoals || []).length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Цели накопления</CardTitle>
                <Link href="/finance/budgets" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1">
                  Управление <ArrowRight size={12} />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {savingsGoals!.map((sg) => (
                  <div key={sg.id} className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: sg.color }} />
                      <p className="text-sm font-medium text-[var(--text)]">{sg.title}</p>
                    </div>
                    <p className="text-xl font-bold text-[var(--text)]">
                      {formatCurrency(sg.current_amount)}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mb-2">
                      из {formatCurrency(sg.target_amount)}
                    </p>
                    <Progress
                      value={calcProgress(sg.current_amount, sg.target_amount)}
                      size="sm"
                      color={sg.color}
                      showLabel
                    />
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

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div
          className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center mb-3"
          style={{ background: `${color}20`, color }}
        >
          {icon}
        </div>
        <p className="text-xl font-bold text-[var(--text)] leading-none">{value}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{label}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  )
}

function EmptyState({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="text-center py-4">
      <p className="text-sm text-[var(--text-tertiary)] mb-3">{text}</p>
      <Link href={href}>
        <Button variant="secondary" size="sm">
          <Plus size={13} /> {cta}
        </Button>
      </Link>
    </div>
  )
}
