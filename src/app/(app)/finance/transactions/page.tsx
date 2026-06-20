import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { TransactionsList } from './transactions-list'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Транзакции' }

export default async function TransactionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .order('date', { ascending: false })
    .limit(100)

  return (
    <div className="flex flex-col h-full">
      <Header title="Все транзакции" description="История доходов и расходов" />
      <div className="flex-1 overflow-auto p-6">
        <TransactionsList initialTransactions={transactions || []} />
      </div>
    </div>
  )
}
