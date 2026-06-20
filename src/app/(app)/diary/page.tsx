import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { DiaryList } from './diary-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Дневник' }

export default async function DiaryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('diary_entries')
    .select('id, title, content, mood, is_locked, created_at, updated_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Дневник"
        description="Ваши мысли и воспоминания"
        actions={
          <Link href="/diary/new">
            <Button size="sm">
              <Plus size={14} /> Новая запись
            </Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <DiaryList initialEntries={entries || []} />
      </div>
    </div>
  )
}
