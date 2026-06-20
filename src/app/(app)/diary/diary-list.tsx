'use client'

import { useState } from 'react'
import { CalendarView } from '@/components/diary/calendar-view'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { formatDate, truncate } from '@/lib/utils'
import { Search, Calendar, List, Lock, Smile } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { DiaryEntry } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

type Entry = Pick<DiaryEntry, 'id' | 'title' | 'content' | 'mood' | 'is_locked' | 'created_at' | 'updated_at'>

const moodMap: Record<string, { emoji: string; label: string; badge: 'success' | 'accent' | 'default' | 'warning' | 'danger' }> = {
  great: { emoji: '😄', label: 'Отлично', badge: 'success' },
  good: { emoji: '🙂', label: 'Хорошо', badge: 'accent' },
  neutral: { emoji: '😐', label: 'Нейтрально', badge: 'default' },
  bad: { emoji: '😔', label: 'Плохо', badge: 'warning' },
  terrible: { emoji: '😢', label: 'Ужасно', badge: 'danger' },
}

export function DiaryList({ initialEntries }: { initialEntries: Entry[] }) {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [search, setSearch] = useState('')
  const [pinModal, setPinModal] = useState<{ entry: Entry } | null>(null)
  const [pin, setPin] = useState('')
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set())

  const filtered = initialEntries.filter((e) =>
    !search ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  async function handleUnlock() {
    if (!pinModal) return
    const supabase = createClient()
    const { data } = await supabase
      .from('diary_entries')
      .select('pin_hash')
      .eq('id', pinModal.entry.id)
      .single()

    if (data?.pin_hash === pin) {
      setUnlockedIds((prev) => new Set([...prev, pinModal.entry.id]))
      setPinModal(null)
      setPin('')
      toast.success('Запись разблокирована')
    } else {
      toast.error('Неверный PIN-код')
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Поиск записей..."
            icon={<Search size={15} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 border border-[var(--border)] rounded-[var(--radius-sm)] p-0.5">
          <button
            onClick={() => setView('list')}
            className={cn(
              'p-1.5 rounded transition-colors',
              view === 'list' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            )}
          >
            <List size={15} />
          </button>
          <button
            onClick={() => setView('calendar')}
            className={cn(
              'p-1.5 rounded transition-colors',
              view === 'calendar' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
            )}
          >
            <Calendar size={15} />
          </button>
        </div>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="p-5">
              <CalendarView entries={initialEntries} />
            </CardContent>
          </Card>
          <div className="lg:col-span-2 space-y-3">
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              Все записи ({filtered.length})
            </p>
            {filtered.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                unlocked={unlockedIds.has(entry.id)}
                onLockClick={() => setPinModal({ entry })}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-[var(--text-secondary)]">
                {search ? 'Записей не найдено' : 'Пока нет записей'}
              </p>
              {!search && (
                <p className="text-sm text-[var(--text-tertiary)] mt-1">
                  Начните вести дневник уже сегодня
                </p>
              )}
            </div>
          )}
          {filtered.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              unlocked={unlockedIds.has(entry.id)}
              onLockClick={() => setPinModal({ entry })}
            />
          ))}
        </div>
      )}

      {/* PIN Modal */}
      <Modal
        open={!!pinModal}
        onClose={() => { setPinModal(null); setPin('') }}
        title="Введите PIN-код"
        description="Эта запись защищена паролем"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            icon={<Lock size={15} />}
            className="text-center text-xl tracking-widest"
          />
          <Button className="w-full" onClick={handleUnlock}>
            Открыть
          </Button>
        </div>
      </Modal>
    </div>
  )
}

function EntryCard({
  entry,
  unlocked,
  onLockClick,
}: {
  entry: Entry
  unlocked: boolean
  onLockClick: () => void
}) {
  const isLocked = entry.is_locked && !unlocked
  const mood = moodMap[entry.mood || '']

  return (
    <Card hover={!isLocked}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {mood && <span className="text-2xl shrink-0 mt-0.5">{mood.emoji}</span>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isLocked ? (
                <button
                  onClick={onLockClick}
                  className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <Lock size={14} />
                  <span>Защищённая запись</span>
                </button>
              ) : (
                <Link
                  href={`/diary/${entry.id}`}
                  className="text-sm font-semibold text-[var(--text)] hover:text-[var(--accent)] transition-colors truncate"
                >
                  {entry.title || 'Без заголовка'}
                </Link>
              )}
              {mood && (
                <Badge variant={mood.badge} className="shrink-0">{mood.label}</Badge>
              )}
            </div>
            {!isLocked && (
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                {truncate(entry.content.replace(/<[^>]+>/g, ''), 150)}
              </p>
            )}
            <p className="text-xs text-[var(--text-tertiary)] mt-2">{formatDate(entry.created_at)}</p>
          </div>
          {entry.is_locked && !unlocked && (
            <button
              onClick={onLockClick}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-tertiary)] transition-colors shrink-0"
            >
              <Lock size={14} />
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
