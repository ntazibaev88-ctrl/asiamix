'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { RichEditor } from '@/components/diary/rich-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

const categories = [
  { value: 'Investing', label: 'Инвестиции' },
  { value: 'Bonds', label: 'Облигации' },
  { value: 'Gold', label: 'Золото' },
  { value: 'Silver', label: 'Серебро' },
  { value: 'Savings', label: 'Накопления' },
  { value: 'Business', label: 'Бизнес' },
  { value: 'Crypto', label: 'Крипто' },
  { value: 'Real Estate', label: 'Недвижимость' },
]

export default function NewArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Investing')
  const [readTime, setReadTime] = useState('5')
  const [publish, setPublish] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave(asPublished = false) {
    if (!title.trim() || !content.trim()) {
      toast.error('Заполните заголовок и содержание')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('articles').insert({
      author_id: user!.id,
      title,
      slug: slugify(title) + '-' + Date.now(),
      excerpt,
      content,
      category,
      read_time: parseInt(readTime) || 5,
      is_published: asPublished,
      published_at: asPublished ? new Date().toISOString() : null,
    })

    setSaving(false)
    if (error) { toast.error('Ошибка при сохранении'); return }
    toast.success(asPublished ? 'Статья опубликована' : 'Черновик сохранён')
    router.push('/admin/articles')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Новая статья"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => handleSave(false)} loading={saving}>
              Сохранить черновик
            </Button>
            <Button size="sm" onClick={() => handleSave(true)} loading={saving}>
              Опубликовать
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Категория"
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <Input
              label="Время чтения (мин.)"
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
            />
          </div>
          <Input
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите заголовок статьи..."
            className="text-lg font-semibold"
          />
          <Textarea
            label="Краткое описание (excerpt)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Краткое описание для превью..."
            rows={2}
          />
          <div>
            <label className="text-sm font-medium text-[var(--text)] block mb-1.5">Содержание</label>
            <RichEditor
              value={content}
              onChange={setContent}
              placeholder="Начните писать статью..."
              className="min-h-[500px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
