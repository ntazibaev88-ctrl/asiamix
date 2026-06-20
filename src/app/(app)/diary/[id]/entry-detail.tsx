'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { RichEditor } from '@/components/diary/rich-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Edit2, Trash2, Lock, Unlock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DiaryEntry } from '@/types'

const moods = [
  { value: 'great', emoji: '😄', label: 'Отлично' },
  { value: 'good', emoji: '🙂', label: 'Хорошо' },
  { value: 'neutral', emoji: '😐', label: 'Нейтрально' },
  { value: 'bad', emoji: '😔', label: 'Плохо' },
  { value: 'terrible', emoji: '😢', label: 'Ужасно' },
]

export function DiaryEntryDetail({ entry: initialEntry }: { entry: DiaryEntry }) {
  const router = useRouter()
  const [entry, setEntry] = useState(initialEntry)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(entry.title)
  const [content, setContent] = useState(entry.content)
  const [mood, setMood] = useState(entry.mood)
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  const moodData = moods.find((m) => m.value === entry.mood)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('diary_entries')
      .update({ title, content, mood, updated_at: new Date().toISOString() })
      .eq('id', entry.id)
    setSaving(false)
    if (error) { toast.error('Ошибка при сохранении'); return }
    setEntry((e) => ({ ...e, title, content, mood: mood as DiaryEntry['mood'] }))
    setEditing(false)
    toast.success('Запись обновлена')
  }

  async function handleDelete() {
    const supabase = createClient()
    await supabase.from('diary_entries').delete().eq('id', entry.id)
    toast.success('Запись удалена')
    router.push('/diary')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title={editing ? 'Редактирование' : 'Запись дневника'}
        actions={
          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  <Edit2 size={14} /> Редактировать
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteModal(true)}>
                  <Trash2 size={14} className="text-[var(--danger)]" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={() => setEditing(false)}>
                  Отмена
                </Button>
                <Button size="sm" onClick={handleSave} loading={saving}>
                  Сохранить
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-sm text-[var(--text-tertiary)]">{formatDate(entry.created_at)}</p>
            {moodData && (
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{moodData.emoji}</span>
                <span className="text-sm text-[var(--text-secondary)]">{moodData.label}</span>
              </div>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Заголовок"
                className="text-xl font-semibold h-12 border-none shadow-none focus:ring-0 px-0 bg-transparent"
              />
              <div className="flex items-center gap-2">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value as DiaryEntry['mood'])}
                    className={cn(
                      'w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all',
                      mood === m.value
                        ? 'bg-[var(--accent-subtle)] scale-110 ring-2 ring-[var(--accent)]'
                        : 'hover:bg-[var(--bg-secondary)]'
                    )}
                  >
                    {m.emoji}
                  </button>
                ))}
              </div>
              <RichEditor value={content} onChange={setContent} className="min-h-[400px]" />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--text)] mb-4">{entry.title}</h1>
              <div
                className="rich-editor text-sm text-[var(--text)] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </>
          )}
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Удалить запись?"
        description="Это действие необратимо. Запись будет удалена навсегда."
        size="sm"
      >
        <div className="flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteModal(false)}>
            Отмена
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>
            <Trash2 size={14} /> Удалить
          </Button>
        </div>
      </Modal>
    </div>
  )
}
