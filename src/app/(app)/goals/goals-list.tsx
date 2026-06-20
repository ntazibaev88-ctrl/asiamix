'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate, calcProgress } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Home, Car, Briefcase, Plane, GraduationCap, Heart,
  CheckCircle2, Circle, Trash2, Edit2, Plus, Target,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Goal, GoalCategory } from '@/types'

const categoryIcons: Record<GoalCategory, React.ReactNode> = {
  House: <Home size={16} />,
  Car: <Car size={16} />,
  Business: <Briefcase size={16} />,
  Travel: <Plane size={16} />,
  Education: <GraduationCap size={16} />,
  Family: <Heart size={16} />,
  Health: <Target size={16} />,
  Other: <Target size={16} />,
}

const categoryColors: Record<GoalCategory, string> = {
  House: '#3b82f6',
  Car: '#8b5cf6',
  Business: '#f59e0b',
  Travel: '#10b981',
  Education: '#6366f1',
  Family: '#ec4899',
  Health: '#ef4444',
  Other: '#6b7280',
}

export function GoalsList({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals)
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [updateModal, setUpdateModal] = useState<Goal | null>(null)
  const [amount, setAmount] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = goals.filter((g) => {
    if (filter === 'active') return !g.is_completed
    if (filter === 'completed') return g.is_completed
    return true
  })

  async function handleToggleComplete(goal: Goal) {
    const supabase = createClient()
    const { error } = await supabase
      .from('goals')
      .update({ is_completed: !goal.is_completed })
      .eq('id', goal.id)
    if (error) { toast.error('Ошибка'); return }
    setGoals((g) => g.map((gg) => gg.id === goal.id ? { ...gg, is_completed: !gg.is_completed } : gg))
    toast.success(goal.is_completed ? 'Цель возобновлена' : 'Цель выполнена! 🎉')
  }

  async function handleUpdateProgress() {
    if (!updateModal) return
    const val = parseFloat(amount)
    if (isNaN(val) || val < 0) { toast.error('Введите корректную сумму'); return }
    const supabase = createClient()
    const newAmount = (updateModal.current_amount || 0) + val
    const { error } = await supabase
      .from('goals')
      .update({ current_amount: newAmount })
      .eq('id', updateModal.id)
    if (error) { toast.error('Ошибка'); return }
    setGoals((g) => g.map((gg) => gg.id === updateModal.id ? { ...gg, current_amount: newAmount } : gg))
    setUpdateModal(null)
    setAmount('')
    toast.success('Прогресс обновлён')
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('goals').delete().eq('id', id)
    setGoals((g) => g.filter((gg) => gg.id !== id))
    setDeleting(null)
    toast.success('Цель удалена')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              filter === f
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            )}
          >
            {{ all: 'Все', active: 'Активные', completed: 'Выполненные' }[f]}
          </button>
        ))}
        <span className="ml-auto text-sm text-[var(--text-tertiary)]">
          {filtered.length} целей
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-3">🎯</p>
          <p className="text-[var(--text-secondary)] mb-1">Нет целей</p>
          <p className="text-sm text-[var(--text-tertiary)] mb-4">
            {filter === 'all' ? 'Добавьте свою первую цель' : `Нет ${filter === 'completed' ? 'выполненных' : 'активных'} целей`}
          </p>
          {filter !== 'completed' && (
            <Link href="/goals/new">
              <Button size="sm">
                <Plus size={14} /> Добавить цель
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((goal) => {
            const color = categoryColors[goal.category as GoalCategory] || '#6b7280'
            const progress = goal.target_amount ? calcProgress(goal.current_amount, goal.target_amount) : null

            return (
              <Card key={goal.id} className={cn('transition-all', goal.is_completed && 'opacity-70')}>
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center"
                      style={{ background: `${color}20`, color }}
                    >
                      {categoryIcons[goal.category as GoalCategory] || <Target size={16} />}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleComplete(goal)}
                        className={cn(
                          'p-1 rounded transition-colors',
                          goal.is_completed
                            ? 'text-[var(--success)]'
                            : 'text-[var(--text-tertiary)] hover:text-[var(--success)]'
                        )}
                        title={goal.is_completed ? 'Возобновить' : 'Завершить'}
                      >
                        {goal.is_completed ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        disabled={deleting === goal.id}
                        className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <Badge
                    className="mb-2 text-[10px]"
                    style={{ background: `${color}20`, color }}
                  >
                    {goal.category}
                  </Badge>

                  <h3 className={cn(
                    'font-semibold text-[var(--text)] mb-1 leading-snug',
                    goal.is_completed && 'line-through text-[var(--text-secondary)]'
                  )}>
                    {goal.title}
                  </h3>

                  {goal.description && (
                    <p className="text-xs text-[var(--text-secondary)] mb-3 line-clamp-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Progress */}
                  {goal.target_amount && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-[var(--text-secondary)]">
                          {formatCurrency(goal.current_amount)}
                        </span>
                        <span className="text-[var(--text-tertiary)]">
                          {formatCurrency(goal.target_amount)}
                        </span>
                      </div>
                      <Progress
                        value={progress!}
                        size="md"
                        color={goal.is_completed ? 'var(--success)' : color}
                        showLabel
                      />
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                    {goal.target_date && (
                      <p className="text-xs text-[var(--text-tertiary)]">
                        до {formatDate(goal.target_date)}
                      </p>
                    )}
                    {!goal.is_completed && goal.target_amount && (
                      <button
                        onClick={() => { setUpdateModal(goal); setAmount('') }}
                        className="text-xs text-[var(--accent)] hover:underline ml-auto"
                      >
                        + Пополнить
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Update Progress Modal */}
      <Modal
        open={!!updateModal}
        onClose={() => setUpdateModal(null)}
        title="Обновить прогресс"
        description={updateModal?.title}
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Добавить сумму"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {updateModal?.target_amount && (
            <p className="text-sm text-[var(--text-secondary)]">
              Текущий прогресс: {formatCurrency(updateModal.current_amount)} / {formatCurrency(updateModal.target_amount)}
            </p>
          )}
          <Button className="w-full" onClick={handleUpdateProgress}>
            Сохранить прогресс
          </Button>
        </div>
      </Modal>
    </div>
  )
}
