'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { formatCurrency, formatShortDate, calcProgress } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Plus, ArrowRight, ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Transaction, SavingsGoal, Budget } from '@/types'

const expenseCategories = [
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

const incomeCategories = [
  { value: 'Зарплата', label: '💰 Зарплата' },
  { value: 'Фриланс', label: '💻 Фриланс' },
  { value: 'Инвестиции', label: '📈 Инвестиции' },
  { value: 'Бизнес', label: '🏢 Бизнес' },
  { value: 'Другое', label: '📌 Другое' },
]

interface Props {
  transactions: Transaction[]
  lastMonthTxns: Transaction[]
  savingsGoals: SavingsGoal[]
  budgets: Budget[]
}

export function FinanceDashboard({ transactions: init, lastMonthTxns, savingsGoals: initSg, budgets }: Props) {
  const [transactions, setTransactions] = useState(init)
  const [savingsGoals, setSavingsGoals] = useState(initSg)
  const [addModal, setAddModal] = useState(false)
  const [sgModal, setSgModal] = useState(false)
  const [txType, setTxType] = useState<'income' | 'expense'>('expense')
  const [form, setForm] = useState({ amount: '', category: 'Другое', description: '', date: new Date().toISOString().slice(0, 10) })
  const [sgForm, setSgForm] = useState({ title: '', target_amount: '', color: '#3b82f6' })
  const [saving, setSaving] = useState(false)

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const lastIncome = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const lastExpense = lastMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  function pctChange(current: number, last: number) {
    if (last === 0) return null
    return Math.round(((current - last) / last) * 100)
  }

  // Expense by category
  const byCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const categoryData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  async function handleAddTransaction() {
    const val = parseFloat(form.amount)
    if (isNaN(val) || val <= 0) { toast.error('Введите корректную сумму'); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('transactions').insert({
      user_id: user!.id,
      type: txType,
      amount: val,
      category: form.category,
      description: form.description,
      date: form.date,
    }).select().single()
    setSaving(false)
    if (error) { toast.error('Ошибка'); return }
    setTransactions((p) => [data, ...p])
    setAddModal(false)
    setForm({ amount: '', category: 'Другое', description: '', date: new Date().toISOString().slice(0, 10) })
    toast.success(txType === 'income' ? 'Доход добавлен' : 'Расход добавлен')
  }

  async function handleAddSavingsGoal() {
    const val = parseFloat(sgForm.target_amount)
    if (!sgForm.title || isNaN(val) || val <= 0) { toast.error('Заполните все поля'); return }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('savings_goals').insert({
      user_id: user!.id,
      title: sgForm.title,
      target_amount: val,
      current_amount: 0,
      color: sgForm.color,
    }).select().single()
    setSaving(false)
    if (error) { toast.error('Ошибка'); return }
    setSavingsGoals((p) => [...p, data])
    setSgModal(false)
    setSgForm({ title: '', target_amount: '', color: '#3b82f6' })
    toast.success('Цель накопления добавлена')
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Баланс месяца"
          value={income - expense}
          icon={<Wallet size={18} />}
          color={income - expense >= 0 ? 'var(--success)' : 'var(--danger)'}
          currency
        />
        <StatCard
          label="Доходы"
          value={income}
          icon={<TrendingUp size={18} />}
          color="var(--success)"
          currency
          change={pctChange(income, lastIncome)}
          positive
        />
        <StatCard
          label="Расходы"
          value={expense}
          icon={<TrendingDown size={18} />}
          color="var(--danger)"
          currency
          change={pctChange(expense, lastExpense)}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => { setTxType('income'); setAddModal(true) }}
          className="bg-[var(--success)] hover:opacity-90"
        >
          <Plus size={14} /> Доход
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => { setTxType('expense'); setAddModal(true) }}
        >
          <Plus size={14} /> Расход
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setSgModal(true)}>
          <PiggyBank size={14} /> Цель накопления
        </Button>
        <Link href="/finance/transactions" className="ml-auto">
          <Button size="sm" variant="ghost">
            Все транзакции <ArrowRight size={14} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Последние транзакции</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {transactions.slice(0, 8).length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">Нет транзакций</p>
            ) : (
              transactions.slice(0, 8).map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm',
                    t.type === 'income' ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--danger-subtle)] text-[var(--danger)]'
                  )}>
                    {t.type === 'income' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text)] truncate">{t.description || t.category}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{t.category} · {formatShortDate(t.date)}</p>
                  </div>
                  <span className={cn(
                    'text-sm font-semibold shrink-0',
                    t.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                  )}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Expense breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Расходы по категориям</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {categoryData.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] text-center py-4">Нет расходов</p>
            ) : (
              categoryData.map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[var(--text)]">{cat}</span>
                    <span className="text-[var(--text-secondary)] font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <Progress
                    value={calcProgress(amount, expense)}
                    size="sm"
                    color="var(--accent)"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings goals */}
      {savingsGoals.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Цели накопления</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSgModal(true)}>
                <Plus size={14} /> Добавить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savingsGoals.map((sg) => (
                <div key={sg.id} className="p-4 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: sg.color }} />
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{sg.title}</p>
                  </div>
                  <p className="text-2xl font-bold text-[var(--text)] mb-0.5">
                    {formatCurrency(sg.current_amount)}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mb-3">
                    из {formatCurrency(sg.target_amount)}
                  </p>
                  <Progress
                    value={calcProgress(sg.current_amount, sg.target_amount)}
                    size="md"
                    color={sg.color}
                    showLabel
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Transaction Modal */}
      <Modal
        open={addModal}
        onClose={() => setAddModal(false)}
        title={txType === 'income' ? 'Добавить доход' : 'Добавить расход'}
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => { setTxType('income'); setForm((f) => ({ ...f, category: 'Другое' })) }}
              className={cn('flex-1 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors', txType === 'income' ? 'bg-[var(--success)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]')}
            >
              Доход
            </button>
            <button
              onClick={() => { setTxType('expense'); setForm((f) => ({ ...f, category: 'Другое' })) }}
              className={cn('flex-1 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-colors', txType === 'expense' ? 'bg-[var(--danger)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]')}
            >
              Расход
            </button>
          </div>
          <Input
            label="Сумма"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          />
          <Select
            label="Категория"
            options={txType === 'income' ? incomeCategories : expenseCategories}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <Input
            label="Описание (необязательно)"
            placeholder="За что?"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Дата"
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
          <Button className="w-full" onClick={handleAddTransaction} loading={saving}>
            Добавить
          </Button>
        </div>
      </Modal>

      {/* Savings Goal Modal */}
      <Modal
        open={sgModal}
        onClose={() => setSgModal(false)}
        title="Новая цель накопления"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            label="Название"
            placeholder="Отпуск в Европе"
            value={sgForm.title}
            onChange={(e) => setSgForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Целевая сумма"
            type="number"
            placeholder="0"
            value={sgForm.target_amount}
            onChange={(e) => setSgForm((f) => ({ ...f, target_amount: e.target.value }))}
          />
          <div>
            <label className="text-sm font-medium text-[var(--text)] block mb-1.5">Цвет</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSgForm((f) => ({ ...f, color: c }))}
                  className={cn('w-7 h-7 rounded-full transition-all', sgForm.color === c && 'ring-2 ring-offset-2 ring-[var(--accent)]')}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleAddSavingsGoal} loading={saving}>
            Создать
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function StatCard({
  label, value, icon, color, currency, change, positive,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
  currency?: boolean
  change?: number | null
  positive?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center" style={{ background: `${color}20`, color }}>
            {icon}
          </div>
          {change !== null && change !== undefined && (
            <Badge variant={positive ? (change >= 0 ? 'success' : 'danger') : (change <= 0 ? 'success' : 'danger')}>
              {change >= 0 ? '+' : ''}{change}%
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold mt-3" style={{ color }}>
          {currency ? formatCurrency(value) : value}
        </p>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{label}</p>
        {change !== null && change !== undefined && (
          <p className="text-xs text-[var(--text-tertiary)] mt-1">vs прошлый месяц</p>
        )}
      </CardContent>
    </Card>
  )
}
