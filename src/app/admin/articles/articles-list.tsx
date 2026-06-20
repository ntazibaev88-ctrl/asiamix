'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Eye, EyeOff, Trash2, Edit2, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Article } from '@/types'

type AdminArticle = Article & { author?: { full_name: string | null } | null }

export function AdminArticlesList({ initialArticles }: { initialArticles: AdminArticle[] }) {
  const [articles, setArticles] = useState(initialArticles)

  async function togglePublish(article: AdminArticle) {
    const supabase = createClient()
    const { error } = await supabase
      .from('articles')
      .update({
        is_published: !article.is_published,
        published_at: !article.is_published ? new Date().toISOString() : null,
      })
      .eq('id', article.id)
    if (error) { toast.error('Ошибка'); return }
    setArticles((p) => p.map((a) => a.id === article.id ? { ...a, is_published: !a.is_published } : a))
    toast.success(article.is_published ? 'Статья скрыта' : 'Статья опубликована')
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', id)
    setArticles((p) => p.filter((a) => a.id !== id))
    toast.success('Статья удалена')
  }

  const categoryLabels: Record<string, string> = {
    Investing: 'Инвестиции', Bonds: 'Облигации', Gold: 'Золото', Silver: 'Серебро',
    Savings: 'Накопления', Business: 'Бизнес', Crypto: 'Крипто', 'Real Estate': 'Недвижимость',
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-0 divide-y divide-[var(--border)]">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)] mb-3">Нет статей</p>
              <Link href="/admin/articles/new">
                <Button size="sm"><Plus size={13} /> Написать первую статью</Button>
              </Link>
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[var(--bg-secondary)] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant={article.is_published ? 'success' : 'default'}>
                      {article.is_published ? 'Опубликована' : 'Черновик'}
                    </Badge>
                    <Badge variant="accent">{categoryLabels[article.category] || article.category}</Badge>
                  </div>
                  <h3 className="font-medium text-[var(--text)] truncate">{article.title}</h3>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {article.author?.full_name} · {article.read_time} мин. · {formatDate(article.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => togglePublish(article)} title={article.is_published ? 'Скрыть' : 'Опубликовать'}>
                    {article.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>
                  <Link href={`/admin/articles/new?edit=${article.id}`}>
                    <Button variant="ghost" size="icon"><Edit2 size={15} /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(article.id)}>
                    <Trash2 size={15} className="text-[var(--danger)]" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
