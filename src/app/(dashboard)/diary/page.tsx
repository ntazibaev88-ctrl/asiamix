'use client'
import { useEffect, useState, useCallback } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Plus, Search, Lock, Calendar, List, Trash2, Edit2, Tag } from 'lucide-react'
import { formatDate, getMoodEmoji, getMoodLabel } from '@/lib/utils'
import type { DiaryEntry } from '@/types'

const MOODS = [1, 2, 3, 4, 5] as const

export default function DiaryPage() {
  const t = useT()
  const supabase = createClient()
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [modalOpen, setModalOpen] = useState(false)
  const [editEntry, setEditEntry] = useState<DiaryEntry | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<number>(3)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const loadEntries = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .order('date', { ascending: false })
    setEntries(data ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadEntries() }, [loadEntries])

  const openCreate = () => {
    setEditEntry(null)
    setTitle('')
    setContent('')
    setMood(3)
    setTags([])
    setTagInput('')
    setModalOpen(true)
  }

  const openEdit = (entry: DiaryEntry) => {
    setEditEntry(entry)
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood)
    setTags(entry.tags ?? [])
    setTagInput('')
    setModalOpen(true)
  }

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Жазба мазмұнын енгізіңіз')
      return
    }
    setSaving(true)
    const payload = {
      title: title || new Date().toLocaleDateString('kk-KZ'),
      content,
      mood,
      tags,
      date: new Date().toISOString().split('T')[0],
    }
    const { error } = editEntry
      ? await supabase.from('diary_entries').update(payload).eq('id', editEntry.id)
      : await supabase.from('diary_entries').insert(payload)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(editEntry ? 'Жазба жаңартылды' : 'Жазба сақталды')
      setModalOpen(false)
      loadEntries()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('diary_entries').delete().eq('id', deleteId)
    if (error) toast.error(error.message)
    else {
      toast.success('Жазба жойылды')
      setDeleteId(null)
      loadEntries()
    }
  }

  const filtered = entries.filter(
    (e) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.content?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <TopBar title={t.diary.title} />

      <div className="mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.diary.searchEntries}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-2 text-sm transition-colors ${view === 'list' ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-2 text-sm transition-colors ${view === 'calendar' ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <Button onClick={openCreate} size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              {t.diary.newEntry}
            </Button>
          </div>
        </div>

        {/* Privacy note */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6 px-1">
          <Lock className="w-3 h-3" />
          {t.diary.privateNote}
        </div>

        {/* Entries */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">{t.diary.noEntries}</p>
            <p className="text-sm text-zinc-400 mb-6">{t.diary.startWriting}</p>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" />
              {t.diary.newEntry}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((entry) => (
              <Card
                key={entry.id}
                className="p-5 hover:shadow-lg dark:hover:shadow-black/20 transition-shadow group cursor-pointer"
                onClick={() => openEdit(entry)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(entry) }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteId(entry.id) }}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5 truncate">
                  {entry.title || 'Атсыз жазба'}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-3 leading-relaxed">
                  {entry.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{formatDate(entry.date, 'kk')}</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {(entry.tags ?? []).slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="default" className="text-[10px]">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editEntry ? t.diary.editEntry : t.diary.newEntry}
        size="lg"
      >
        <div className="px-6 pb-6 space-y-4">
          <Input
            label="Тақырып"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.diary.titlePlaceholder}
          />

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
              Мазмұн
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.diary.contentPlaceholder}
              rows={6}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>

          {/* Mood */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
              {t.diary.mood}
            </label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                    mood === m
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-transparent hover:border-zinc-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="text-xl">{getMoodEmoji(m)}</span>
                  <span className="text-[10px] text-zinc-500">{getMoodLabel(m, 'kk')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
              {t.diary.tags}
            </label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder={t.diary.addTag}
                className="flex-1 h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <Button variant="secondary" size="sm" onClick={addTag}>
                <Tag className="w-3.5 h-3.5" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors"
                  >
                    #{tag} ×
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleSave} loading={saving}>
              {t.common.save}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Жазбаны жою"
        size="sm"
      >
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
            Бұл жазбаны шынымен жойғыңыз келе ме? Бұл әрекетті кері қайтару мүмкін емес.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              {t.common.cancel}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              {t.common.delete}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
