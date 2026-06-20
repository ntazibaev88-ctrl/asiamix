import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { BudgetManager } from './budget-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Бюджет' }

export default async function BudgetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [{ data: budgets }, { data: transactions }] = await Promise.all([
    supabase.from('budgets').select('*').eq('user_id', user!.id).eq('month', month),
    supabase.from('transactions').select('*').eq('user_id', user!.id).eq('type', 'expense').gte('date', monthStart),
  ])

  return (
    <div className="flex flex-col h-full">
      <Header title="Бюджет" description={`Управление бюджетом на ${month}`} />
      <div className="flex-1 overflow-auto p-6">
        <BudgetManager initialBudgets={budgets || []} transactions={transactions || []} month={month} />
      </div>
    </div>
  )
}
