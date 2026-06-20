import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { UsersManager } from './users-manager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Пользователи' }

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Header title="Пользователи" description="Управление пользователями" />
      <div className="flex-1 overflow-auto p-6">
        <UsersManager initialUsers={users || []} />
      </div>
    </div>
  )
}
