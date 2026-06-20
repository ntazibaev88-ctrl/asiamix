'use client'
import { useCallback, useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Plus, TrendingUp, TrendingDown, PiggyBank, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Transaction, TransactionType } from '@/types'

const INCOME_CATS = ['Жалақы', 'Бизнес', 'Инвестиция', 'Сыйлық', 'Басқа']
const EXPENSE_CATS = ['Азық-түлік', 'Тамақ', 'Киім', 'Транспорт', 'Комуналдық', 'Кино/Ойын', 'Денсаулық', 'Білім', 'Сыйлық', 'Басқа']
const SAVINGS_CATS = ['Депозит', 'Инвестиция', 'Алтын', 'Облигация', 'Басқа']

export default function FinancePage() {
  const t = useT()
  const supabase = createClient()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | TransactionType>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form
  const [formType, setFormType] = useState<TransactionType>('income')
  const [formAmount, setFormAmount] = useState('')
  const [formCategory, setFormCategory] = useState('')
  const [formNote, setFormNote] = useState('')
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0])
  const [saving, setSaving] = useState(false)

  const currentMonth = new Date().toISOString().substring(0, 7)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })
      .limit(200)
    setTransactions(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const thisMonth = transactions.filter((t) => t.date.startsWith(currentMonth))

  const totalIncome = thisMonth.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = thisMonth.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const totalSavings = thisMonth.filter((t) => t.type === 'savings').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const filtered = tab === 'all' ? transactions : transactions.filter((t) => t.type === tab)

  const openCreate = (type: TransactionType = 'income') => {
    setFormType(type); setFormAmount(''); setFormCategory('')
    setFormNote(''); setFormDate(new Date().toISOString().split('T')[0])
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formAmount || isNaN(Number(formAmount))) { toast.error('Соманы дұрыс енгізіңіз'); return }
    if (!formCategory) { toast.error('Санатты таңдаңыз'); return }
    setSaving(true)
    const { error } = await supabase.from('transactions').insert({
      type: formType, amount: Number(formAmount),
      category: formCategory, note: formNote, date: formDate,
    })
    if (error) toast.error(error.message)
    else { toast.success('Транзакция сақталды'); setModalOpen(false); load() }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('transactions').delete().eq('id', deleteId)
    toast.success('Транзакция жойылды'); setDeleteId(null); load()
  }

  const cats = formType === 'income' ? INCOME_CATS : formType === 'expense' ? EXPENSE_CATS : SAVINGS_CATS

  const typeConfig = {
    income: { icon: TrendingUp, label: t.finance.income, color: 'text-emerald-500', bg: 'bg-emerald-500/10', badge: 'success' as const },
    expense: { icon: TrendingDown, label: t.finance.expense, color: 'text-red-500', bg: 'bg-red-500/10', badge: 'danger' as const },
    savings: { icon: PiggyBank, label: t.finance.savings, color: 'text-blue-500', bg: 'bg-blue-500/10', badge: 'info' as const },
  }

  return (
    <div>
      <TopBar title={t.finance.title} />

      <div className="mt-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-zinc-500">{t.finance.totalIncome}</span>
            </div>
            <div className="text-xl font-bold text-emerald-600">{formatCurrency(totalIncome)}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-xs text-zinc-500">{t.finance.totalExpenses}</span>
            </div>
            <div className="text-xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-zinc-500">{t.finance.totalSavings}</span>
            </div>
            <div className="text-xl font-bold text-blue-500">{formatCurrency(totalSavings)}</div>
          </Card>
          <Card className={`p-4 ${balance >= 0 ? 'border-emerald-200 dark:border-emerald-900/30' : 'border-red-200 dark:border-red-900/30'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-zinc-500">{t.finance.balance}</span>
            </div>
            <div className={`text-xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {balance >= 0 ? '+' : ''}{formatCurrency(balance)}
            </div>
          </Card>
        </div>

        {/* Quick add buttons */}
        <div className="flex gap-3">
          {(['income', 'expense', 'savings'] as TransactionType[]).map((type) => {
            const { icon: Icon, label, color } = typeConfig[type]
            return (
              <Button key={type} variant="outline" size="sm" onClick={() => { setFormType(type); openCreate(type) }} className="gap-1.5">
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </Button>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 p-1 w-fit">
          {(['all', 'income', 'expense', 'savings'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setTab(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                tab === type ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-500'
              }`}
            >
              {type === 'all' ? 'Барлығы' : typeConfig[type].label}
            </button>
          ))}
        </div>

        {/* Transactions list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">💰</div>
            <p className="text-zinc-500">{t.finance.noTransactions}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((tx) => {
              const { icon: Icon, color, bg, badge } = typeConfig[tx.type]
              return (
                <Card key={tx.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{tx.category}</span>
                        <Badge variant={badge}>{typeConfig[tx.type].label}</Badge>
                      </div>
                      {tx.note && <p className="text-xs text-zinc-400 truncate">{tx.note}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-sm font-bold ${tx.type === 'expense' ? 'text-red-500' : tx.type === 'income' ? 'text-emerald-600' : 'text-blue-500'}`}>
                        {tx.type === 'expense' ? '−' : '+'}{formatCurrency(tx.amount)}
                      </div>
                      <div className="text-xs text-zinc-400">{tx.date}</div>
                    </div>
                    <button
                      onClick={() => setDeleteId(tx.id)}
                      className="p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Add transaction modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={t.finance.addTransaction} size="md">
        <div className="px-6 pb-6 space-y-4">
          {/* Type selector */}
          <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {(['income', 'expense', 'savings'] as TransactionType[]).map((type) => (
              <button
                key={type}
                onClick={() => { setFormType(type); setFormCategory('') }}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${formType === type ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              >
                {typeConfig[type].label}
              </button>
            ))}
          </div>

          <Input
            label={t.finance.amount}
            type="number"
            value={formAmount}
            onChange={(e) => setFormAmount(e.target.value)}
            placeholder="0"
            hint="₸"
          />

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">{t.finance.category}</label>
            <div className="flex flex-wrap gap-2">
              {cats.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFormCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    formCategory === cat
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-amber-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Input label={t.finance.note} value={formNote} onChange={(e) => setFormNote(e.target.value)} placeholder="Ескертпе..." />
          <Input label={t.finance.date} type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} loading={saving}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Транзакцияны жою" size="sm">
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-500 mb-6">Бұл транзакцияны жойғыңыз келе ме?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{t.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
