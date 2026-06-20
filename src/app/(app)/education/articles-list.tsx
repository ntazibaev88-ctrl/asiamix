'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate, truncate } from '@/lib/utils'
import { Bookmark, BookmarkCheck, Search, Clock } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Article, ArticleCategory } from '@/types'

const categories: (ArticleCategory | 'all')[] = [
  'all', 'Investing', 'Bonds', 'Gold', 'Silver', 'Savings', 'Business', 'Crypto', 'Real Estate',
]

const categoryLabels: Record<string, string> = {
  all: 'Все',
  Investing: 'Инвестиции',
  Bonds: 'Облигации',
  Gold: 'Золото',
  Silver: 'Серебро',
  Savings: 'Накопления',
  Business: 'Бизнес',
  Crypto: 'Крипто',
  'Real Estate': 'Недвижимость',
}

interface Props {
  initialArticles: (Article & { is_bookmarked: boolean })[]
  userId: string
}

export function ArticlesList({ initialArticles, userId }: Props) {
  const [articles, setArticles] = useState(initialArticles)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')

  const filtered = articles.filter((a) => {
    const matchesCat = category === 'all' || a.category === category
    const matchesSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(search.toLowerCase())
    return matchesCat && matchesSearch
  })

  async function toggleBookmark(article: Article & { is_bookmarked: boolean }) {
    const supabase = createClient()
    if (article.is_bookmarked) {
      await supabase.from('bookmarks').delete()
        .eq('user_id', userId)
        .eq('article_id', article.id)
      setArticles((p) => p.map((a) => a.id === article.id ? { ...a, is_bookmarked: false } : a))
      toast.success('Закладка удалена')
    } else {
      await supabase.from('bookmarks').insert({ user_id: userId, article_id: article.id })
      setArticles((p) => p.map((a) => a.id === article.id ? { ...a, is_bookmarked: true } : a))
      toast.success('Добавлено в закладки')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search */}
      <div className="flex items-center gap-3 mb-5">
        <Input
          placeholder="Поиск статей..."
          icon={<Search size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
              category === cat
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
            )}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Articles grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-3xl mb-3">📚</p>
          <p className="text-[var(--text-secondary)]">Статьи не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((article) => (
            <Card key={article.id} hover>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant="accent" className="text-xs">
                    {categoryLabels[article.category] || article.category}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(article)}
                    className={cn(
                      'p-1 rounded transition-colors shrink-0',
                      article.is_bookmarked
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-tertiary)] hover:text-[var(--accent)]'
                    )}
                  >
                    {article.is_bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>

                <Link href={`/education/${article.id}`}>
                  <h3 className="font-semibold text-[var(--text)] leading-snug mb-2 hover:text-[var(--accent)] transition-colors">
                    {article.title}
                  </h3>
                </Link>

                {article.excerpt && (
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                  {article.author?.full_name && (
                    <span>{article.author.full_name}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {article.read_time} мин.
                  </span>
                  {article.published_at && (
                    <span>{formatDate(article.published_at)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
