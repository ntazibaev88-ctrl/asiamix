import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { ArticlesList } from './articles-list'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Образование' }

export default async function EducationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: articles }, { data: bookmarks }] = await Promise.all([
    supabase
      .from('articles')
      .select('*, author:profiles(full_name, avatar_url)')
      .eq('is_published', true)
      .order('published_at', { ascending: false }),
    supabase
      .from('bookmarks')
      .select('article_id')
      .eq('user_id', user!.id),
  ])

  const bookmarkedIds = new Set((bookmarks || []).map((b) => b.article_id))
  const articlesWithBookmark = (articles || []).map((a) => ({
    ...a,
    is_bookmarked: bookmarkedIds.has(a.id),
  }))

  return (
    <div className="flex flex-col h-full">
      <Header title="Образование" description="Статьи о финансах и инвестициях" />
      <div className="flex-1 overflow-auto p-6">
        <ArticlesList initialArticles={articlesWithBookmark} userId={user!.id} />
      </div>
    </div>
  )
}
