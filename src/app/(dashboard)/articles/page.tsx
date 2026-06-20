'use client'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { LanguageContext } from '@/contexts/language'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Search, Bookmark, BookmarkCheck, ArrowRight, Newspaper } from 'lucide-react'
import type { Article, ArticleCategory } from '@/types'

const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  investment: 'text-amber-500 bg-amber-500/10',
  gold: 'text-yellow-500 bg-yellow-500/10',
  silver: 'text-slate-400 bg-slate-400/10',
  bonds: 'text-blue-500 bg-blue-500/10',
  literacy: 'text-emerald-500 bg-emerald-500/10',
  business: 'text-violet-500 bg-violet-500/10',
  motivation: 'text-rose-500 bg-rose-500/10',
}

export default function ArticlesPage() {
  const t = useT()
  const { lang } = useContext(LanguageContext)
  const supabase = createClient()
  const [articles, setArticles] = useState<Article[]>([])
  const [saved, setSaved] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState<ArticleCategory | 'all'>('all')
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [articlesRes, savedRes] = await Promise.all([
      supabase.from('articles').select('*').eq('published', true).order('created_at', { ascending: false }),
      supabase.from('saved_articles').select('article_id'),
    ])
    setArticles(articlesRes.data ?? [])
    setSaved(new Set((savedRes.data ?? []).map((s: { article_id: string }) => s.article_id)))
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const toggleSave = async (articleId: string) => {
    if (saved.has(articleId)) {
      await supabase.from('saved_articles').delete().eq('article_id', articleId)
      setSaved((prev) => { const s = new Set(prev); s.delete(articleId); return s })
    } else {
      await supabase.from('saved_articles').insert({ article_id: articleId })
      setSaved((prev) => new Set([...prev, articleId]))
      toast.success('Мақала сақталды')
    }
  }

  const getTitle = (article: Article) =>
    lang === 'kk' ? article.title_kk : lang === 'ru' ? article.title_ru : article.title_en
  const getContent = (article: Article) =>
    lang === 'kk' ? article.content_kk : lang === 'ru' ? article.content_ru : article.content_en

  const filtered = articles.filter((a) => {
    const matchSearch =
      getTitle(a).toLowerCase().includes(search.toLowerCase()) ||
      getContent(a).toLowerCase().includes(search.toLowerCase())
    const matchCat = catFilter === 'all' || a.category === catFilter
    return matchSearch && matchCat
  })

  const categories = Object.keys(t.articles.categories) as ArticleCategory[]

  return (
    <div>
      <TopBar title={t.articles.title} />

      <div className="mt-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.articles.search}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setCatFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              catFilter === 'all'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Барлығы
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                catFilter === cat
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {t.articles.categories[cat]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-500">Мақалалар жоқ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((article) => {
              const colorClass = CATEGORY_COLORS[article.category] ?? 'text-zinc-500 bg-zinc-100'
              const isSaved = saved.has(article.id)
              return (
                <Card
                  key={article.id}
                  className="p-5 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow group cursor-pointer flex flex-col"
                  onClick={() => setSelectedArticle(article)}
                >
                  {article.cover_url && (
                    <div className="h-36 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-2xl">
                      <img
                        src={article.cover_url}
                        alt={getTitle(article)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
                      {t.articles.categories[article.category]}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSave(article.id) }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 flex-1">
                    {getTitle(article)}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                    {getContent(article).substring(0, 120)}...
                  </p>
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 text-sm font-medium">
                    {t.articles.readMore}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Article reader modal */}
      {selectedArticle && (
        <Modal
          open={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
          title={getTitle(selectedArticle)}
          size="xl"
        >
          <div className="px-6 pb-6">
            {selectedArticle.cover_url && (
              <img
                src={selectedArticle.cover_url}
                alt={getTitle(selectedArticle)}
                className="w-full h-56 object-cover rounded-xl mb-4"
              />
            )}
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="gold">{t.articles.categories[selectedArticle.category]}</Badge>
            </div>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
              {getContent(selectedArticle).split('\n').map((para, i) => (
                <p key={i} className="mb-3 text-zinc-600 dark:text-zinc-300">{para}</p>
              ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => toggleSave(selectedArticle.id)}
                className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline"
              >
                {saved.has(selectedArticle.id) ? (
                  <><BookmarkCheck className="w-4 h-4" /> Сақталған</>
                ) : (
                  <><Bookmark className="w-4 h-4" /> {t.articles.saved}</>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
