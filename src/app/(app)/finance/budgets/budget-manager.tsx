'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Modal } from '@/components/ui/modal'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, calcProgress } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Budget, Transaction } from '@/types'

const categories = [
  { value: 'Продукты', label: '🛒 Продукты' },
  { value: 'Транспорт', label: '🚗 Транспорт' },
  { value: 'Жильё', label: '🏠 Жильё' },
  { value: 'Здоровье', label: '💊 Здоровье' },
  { value: 'Развлечения', label: '🎬 Развлечения' },
  { value: 'Одежда', label: '👕 Одежда' },
  { value: 'Образование', label: '📚 Образование' },
  { value: 'Рестораны', label: '🍽️ Рестораны' },
  { value: 'Другое', label: '📌 Другое' },
]

interface Props {
  initialBudgets: Budget[]
  transactions: Transaction[]
  month: string
}

export function BudgetManager({ initialBudgets, transactions, month }: Props) {
  const [budgets, setBudgets] = useState(initialBudgets)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ category: 'Продукты', monthly_limit: '' })
  const [saving, setSaving] = useState(false)

  function spentForCategory(category: string) {
    return transactions
      .filter((t) => t.category === category)
      .reduce((s, t) => s + t.amount, 0)
  }

  async function handleAdd() {
    const limit = parseFloat(form.monthly_limit)
    if (isNaN(limit) || limit <= 0) { toast.error('Введите сумму'); return }
    if (budgets.find((b) => b.category === form.category)) {
      toast.error('Бюджет для этой категории уже есть')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('budgets').insert({
      user_id: user!.id,
      category: form.category,
      monthly_limit: limit,
      month,
    }).select().single()
    setSaving(false)
    if (error) { toast.error('Ошибка'); return }
    setBudgets((p) => [...p, data])
    setModal(false)
    setForm({ category: 'Продукты', monthly_limit: '' })
    toast.success('Бюджет установлен')
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('budgets').delete().eq('id', id)
    setBudgets((p) => p.filter((b) => b.id !== id))
    toast.success('Бюджет удалён')
  }

  const totalBudget = budgets.reduce((s, b) => s + b.monthly_limit, 0)
  const totalSpent = budgets.reduce((s, b) => s + spentForCategory(b.category), 0)

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Summary */}
      {budgets.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between mb-3">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Потрачено из бюджета</p>
                <p className="text-2xl font-bold text-[var(--text)]">{formatCurrency(totalSpent)}</p>
                <p className="text-sm text-[var(--text-tertiary)]">из {formatCurrency(totalBudget)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--text-secondary)]">Остаток</p>
                <p className={cn('text-2xl font-bold', totalBudget - totalSpent >= 0 ? 'text-[var(--success)]' : 'text-[var(--danger)]')}>
                  {formatCurrency(totalBudget - totalSpent)}
                </p>
              </div>
            </div>
            <Progress value={calcProgress(totalSpent, totalBudget)} size="lg" showLabel />
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">
          Категории бюджета
        </h2>
        <Button size="sm" onClick={() => setModal(true)}>
          <Plus size={14} /> Добавить
        </Button>
      </div>

      {budgets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-3">💰</p>
          <p className="text-[var(--text-secondary)]">Бюджет не задан</p>
          <p className="text-sm text-[var(--text-tertiary)] mt-1 mb-4">
            Установите лимиты для контроля расходов
          </p>
          <Button onClick={() => setModal(true)}>
            <Plus size={14} /> Добавить категорию
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {budgets.map((budget) => {
            const spent = spentForCategory(budget.category)
            const progress = calcProgress(spent, budget.monthly_limit)
            const isOver = spent > budget.monthly_limit
            const isWarning = progress >= 80

            return (
              <Card key={budget.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[var(--text)]">{budget.category}</h3>
                        {isOver && (
                          <Badge variant="danger" className="gap-1">
                            <AlertTriangle size={10} /> Превышен
                          </Badge>
                        )}
                        {!isOver && isWarning && (
                          <Badge variant="warning">Почти лимит</Badge>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                        {formatCurrency(spent)} из {formatCurrency(budget.monthly_limit)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <Progress
                    value={progress}
                    size="md"
                    color={isOver ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)'}
                    showLabel
                  />
                  <p className="text-xs text-[var(--text-tertiary)] mt-1.5">
                    Осталось: {formatCurrency(Math.max(budget.monthly_limit - spent, 0))}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Новый лимит бюджета" size="sm">
        <div className="space-y-4">
          <Select
            label="Категория"
            options={categories}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <Input
            label="Месячный лимит"
            type="number"
            placeholder="0"
            value={form.monthly_limit}
            onChange={(e) => setForm((f) => ({ ...f, monthly_limit: e.target.value }))}
          />
          <Button className="w-full" onClick={handleAdd} loading={saving}>
            Установить лимит
          </Button>
        </div>
      </Modal>
    </div>
  )
}
