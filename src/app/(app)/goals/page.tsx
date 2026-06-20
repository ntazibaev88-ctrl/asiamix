import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { GoalsList } from './goals-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Цели' }

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: goals } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Мои цели"
        description="Мечты и жизненные цели"
        actions={
          <Link href="/goals/new">
            <Button size="sm">
              <Plus size={14} /> Добавить цель
            </Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <GoalsList initialGoals={goals || []} />
      </div>
    </div>
  )
}
