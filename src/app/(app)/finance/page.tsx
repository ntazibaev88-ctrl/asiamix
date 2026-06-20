import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { FinanceDashboard } from './finance-dashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Финансы' }

export default async function FinancePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0).toISOString()

  const [
    { data: transactions },
    { data: lastMonthTxns },
    { data: savingsGoals },
    { data: budgets },
  ] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', user!.id).gte('date', monthStart).order('date', { ascending: false }),
    supabase.from('transactions').select('*').eq('user_id', user!.id).gte('date', lastMonthStart).lte('date', lastMonthEnd),
    supabase.from('savings_goals').select('*').eq('user_id', user!.id),
    supabase.from('budgets').select('*').eq('user_id', user!.id).eq('month', `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`),
  ])

  return (
    <div className="flex flex-col h-full">
      <Header title="Финансы" description="Доходы, расходы и накопления" />
      <div className="flex-1 overflow-auto p-6">
        <FinanceDashboard
          transactions={transactions || []}
          lastMonthTxns={lastMonthTxns || []}
          savingsGoals={savingsGoals || []}
          budgets={budgets || []}
        />
      </div>
    </div>
  )
}
