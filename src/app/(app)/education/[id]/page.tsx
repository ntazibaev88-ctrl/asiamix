import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { BookmarkToggle } from './bookmark-toggle'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('articles').select('title').eq('id', id).single()
  return { title: data?.title || 'Статья' }
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: article }, { data: bookmark }] = await Promise.all([
    supabase
      .from('articles')
      .select('*, author:profiles(full_name)')
      .eq('id', id)
      .eq('is_published', true)
      .single(),
    supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user!.id)
      .eq('article_id', id)
      .single(),
  ])

  if (!article) notFound()

  const categoryLabels: Record<string, string> = {
    Investing: 'Инвестиции',
    Bonds: 'Облигации',
    Gold: 'Золото',
    Silver: 'Серебро',
    Savings: 'Накопления',
    Business: 'Бизнес',
    Crypto: 'Крипто',
    'Real Estate': 'Недвижимость',
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Статья"
        actions={
          <BookmarkToggle
            articleId={id}
            userId={user!.id}
            isBookmarked={!!bookmark}
          />
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/education"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Назад к статьям
          </Link>

          <Badge variant="accent" className="mb-4">
            {categoryLabels[article.category] || article.category}
          </Badge>

          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)] leading-tight mb-4">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)] mb-8 pb-8 border-b border-[var(--border)]">
            {article.author?.full_name && <span>{article.author.full_name}</span>}
            <span className="flex items-center gap-1">
              <Clock size={13} /> {article.read_time} мин. чтения
            </span>
            {article.published_at && <span>{formatDate(article.published_at)}</span>}
          </div>

          <div
            className="rich-editor text-[var(--text)] leading-relaxed text-base space-y-4"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </div>
  )
}
