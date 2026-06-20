'use client'
import { useCallback, useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import {
  Footprints, Users, FileText, Newspaper, Plus, Edit2, Trash2,
  Eye, EyeOff, TrendingUp, ShieldCheck
} from 'lucide-react'
import type { Article, ArticleCategory } from '@/types'

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'investment', label: 'Инвестиция' },
  { value: 'gold', label: 'Алтын нарығы' },
  { value: 'silver', label: 'Күміс нарығы' },
  { value: 'bonds', label: 'Облигациялар' },
  { value: 'literacy', label: 'Қаржылық сауаттылық' },
  { value: 'business', label: 'Бизнес' },
  { value: 'motivation', label: 'Мотивация' },
]

export default function AdminPage() {
  const t = useT()
  const supabase = createClient()
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState({ users: 0, articles: 0, premium: 0 })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editArticle, setEditArticle] = useState<Article | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form
  const [formTitleKk, setFormTitleKk] = useState('')
  const [formTitleRu, setFormTitleRu] = useState('')
  const [formTitleEn, setFormTitleEn] = useState('')
  const [formContentKk, setFormContentKk] = useState('')
  const [formContentRu, setFormContentRu] = useState('')
  const [formContentEn, setFormContentEn] = useState('')
  const [formCategory, setFormCategory] = useState<ArticleCategory>('motivation')
  const [formCover, setFormCover] = useState('')
  const [formPublished, setFormPublished] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formLang, setFormLang] = useState<'kk' | 'ru' | 'en'>('kk')

  const load = useCallback(async () => {
    setLoading(true)
    const [articlesRes, usersRes, premiumRes] = await Promise.all([
      supabase.from('articles').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('plan', 'premium'),
    ])
    setArticles(articlesRes.data ?? [])
    setStats({
      users: usersRes.count ?? 0,
      articles: articlesRes.data?.length ?? 0,
      premium: premiumRes.count ?? 0,
    })
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditArticle(null)
    setFormTitleKk(''); setFormTitleRu(''); setFormTitleEn('')
    setFormContentKk(''); setFormContentRu(''); setFormContentEn('')
    setFormCategory('motivation'); setFormCover(''); setFormPublished(true)
    setModalOpen(true)
  }

  const openEdit = (a: Article) => {
    setEditArticle(a)
    setFormTitleKk(a.title_kk); setFormTitleRu(a.title_ru); setFormTitleEn(a.title_en)
    setFormContentKk(a.content_kk); setFormContentRu(a.content_ru); setFormContentEn(a.content_en)
    setFormCategory(a.category); setFormCover(a.cover_url ?? ''); setFormPublished(a.published)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formTitleKk.trim() || !formContentKk.trim()) {
      toast.error('Тақырып пен мазмұнды (қазақша) толтырыңыз')
      return
    }
    setSaving(true)
    const payload = {
      title_kk: formTitleKk, title_ru: formTitleRu || formTitleKk, title_en: formTitleEn || formTitleKk,
      content_kk: formContentKk, content_ru: formContentRu || formContentKk, content_en: formContentEn || formContentKk,
      category: formCategory, cover_url: formCover || null, published: formPublished,
    }
    const { error } = editArticle
      ? await supabase.from('articles').update(payload).eq('id', editArticle.id)
      : await supabase.from('articles').insert(payload)
    if (error) toast.error(error.message)
    else { toast.success(editArticle ? 'Мақала жаңартылды' : 'Мақала жарияланды'); setModalOpen(false); load() }
    setSaving(false)
  }

  const togglePublish = async (a: Article) => {
    await supabase.from('articles').update({ published: !a.published }).eq('id', a.id)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('articles').delete().eq('id', deleteId)
    toast.success('Мақала жойылды'); setDeleteId(null); load()
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
            <Footprints className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Qadam Admin</h1>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Әкімші панелі
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: 'Жалпы пайдаланушы', value: stats.users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { icon: TrendingUp, label: 'Премиум пайдаланушы', value: stats.premium, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { icon: Newspaper, label: 'Мақалалар', value: stats.articles, color: 'text-violet-500', bg: 'bg-violet-500/10' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <Card key={label} className="p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
              <div className="text-xs text-zinc-400">{label}</div>
            </Card>
          ))}
        </div>

        {/* Articles management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Мақалаларды басқару
              </CardTitle>
              <Button onClick={openCreate} size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Мақала қосу
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-zinc-400">Мақала жоқ</p>
              </div>
            ) : (
              <div className="space-y-2">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{article.title_kk}</p>
                        {!article.published && (
                          <Badge variant="default">Жарияланбаған</Badge>
                        )}
                      </div>
                      <Badge variant="warning" className="text-[10px]">
                        {CATEGORIES.find((c) => c.value === article.category)?.label}
                      </Badge>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => togglePublish(article)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          article.published
                            ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title={article.published ? 'Жарияланбаған ету' : 'Жариялау'}
                      >
                        {article.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(article)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(article.id)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Article Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editArticle ? 'Мақаланы өзгерту' : 'Жаңа мақала'} size="xl">
        <div className="px-6 pb-6 space-y-4">
          {/* Lang tabs */}
          <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden w-fit">
            {(['kk', 'ru', 'en'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setFormLang(l)}
                className={`px-4 py-2 text-sm font-medium uppercase transition-colors ${formLang === l ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {formLang === 'kk' && (
            <>
              <Input label="Тақырып (қазақша)" value={formTitleKk} onChange={(e) => setFormTitleKk(e.target.value)} placeholder="Мақала тақырыбы" />
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Мазмұн (қазақша)</label>
                <textarea value={formContentKk} onChange={(e) => setFormContentKk(e.target.value)} rows={6}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
              </div>
            </>
          )}
          {formLang === 'ru' && (
            <>
              <Input label="Заголовок (рус.)" value={formTitleRu} onChange={(e) => setFormTitleRu(e.target.value)} placeholder="Заголовок статьи" />
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Содержание (рус.)</label>
                <textarea value={formContentRu} onChange={(e) => setFormContentRu(e.target.value)} rows={6}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
              </div>
            </>
          )}
          {formLang === 'en' && (
            <>
              <Input label="Title (English)" value={formTitleEn} onChange={(e) => setFormTitleEn(e.target.value)} placeholder="Article title" />
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Content (English)</label>
                <textarea value={formContentEn} onChange={(e) => setFormContentEn(e.target.value)} rows={6}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none" />
              </div>
            </>
          )}

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Санат</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button key={value} onClick={() => setFormCategory(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${formCategory === value ? 'bg-amber-500 text-white border-amber-500' : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Input label="Сурет URL (міндетті емес)" value={formCover} onChange={(e) => setFormCover(e.target.value)} placeholder="https://..." />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFormPublished(!formPublished)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formPublished ? 'bg-amber-500' : 'bg-zinc-200 dark:bg-zinc-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formPublished ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm text-zinc-700 dark:text-zinc-300">
              {formPublished ? 'Жарияланған' : 'Жарияланбаған'}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} loading={saving}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Мақаланы жою" size="sm">
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-500 mb-6">Бұл мақаланы жойғыңыз келе ме?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{t.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
