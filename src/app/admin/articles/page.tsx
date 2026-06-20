import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { AdminArticlesList } from './articles-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Статьи' }

export default async function AdminArticlesPage() {
  const supabase = await createClient()
  const { data: articles } = await supabase
    .from('articles')
    .select('*, author:profiles(full_name)')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Статьи"
        description="Управление обучающими материалами"
        actions={
          <Link href="/admin/articles/new">
            <Button size="sm"><Plus size={14} /> Новая статья</Button>
          </Link>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <AdminArticlesList initialArticles={articles || []} />
      </div>
    </div>
  )
}
