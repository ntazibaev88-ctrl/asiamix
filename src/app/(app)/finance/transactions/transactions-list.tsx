'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, TrendingDown, Search, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Transaction } from '@/types'

export function TransactionsList({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')

  const filtered = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.type === filter
    const matchesSearch = !search ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', id)
    setTransactions((p) => p.filter((t) => t.id !== id))
    toast.success('Транзакция удалена')
  }

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--success-subtle)] border border-[var(--border)]">
          <p className="text-xs text-[var(--success)] font-medium mb-1">Доходы</p>
          <p className="text-xl font-bold text-[var(--success)]">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="p-4 rounded-[var(--radius)] bg-[var(--danger-subtle)] border border-[var(--border)]">
          <p className="text-xs text-[var(--danger)] font-medium mb-1">Расходы</p>
          <p className="text-xl font-bold text-[var(--danger)]">{formatCurrency(totalExpense)}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <Input
          placeholder="Поиск..."
          icon={<Search size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-1">
          {(['all', 'income', 'expense'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                filter === f
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
              )}
            >
              {{ all: 'Все', income: 'Доходы', expense: 'Расходы' }[f]}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0 divide-y divide-[var(--border)]">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-[var(--text-tertiary)] text-sm">Нет транзакций</p>
          ) : (
            filtered.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-secondary)] transition-colors group">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                  t.type === 'income' ? 'bg-[var(--success-subtle)] text-[var(--success)]' : 'bg-[var(--danger-subtle)] text-[var(--danger)]'
                )}>
                  {t.type === 'income' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {t.description || t.category}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={t.type === 'income' ? 'success' : 'danger'} className="text-[10px]">
                      {t.category}
                    </Badge>
                    <span className="text-xs text-[var(--text-tertiary)]">{formatDate(t.date)}</span>
                  </div>
                </div>
                <span className={cn(
                  'text-sm font-semibold shrink-0',
                  t.type === 'income' ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                )}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-all rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
