'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { RichEditor } from '@/components/diary/rich-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Modal } from '@/components/ui/modal'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Lock, Smile } from 'lucide-react'
import { cn } from '@/lib/utils'

const moods = [
  { value: 'great', emoji: '😄', label: 'Отлично' },
  { value: 'good', emoji: '🙂', label: 'Хорошо' },
  { value: 'neutral', emoji: '😐', label: 'Нейтрально' },
  { value: 'bad', emoji: '😔', label: 'Плохо' },
  { value: 'terrible', emoji: '😢', label: 'Ужасно' },
]

export default function NewDiaryPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinModal, setPinModal] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!content.trim()) {
      toast.error('Напишите что-нибудь в записи')
      return
    }
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('diary_entries').insert({
      user_id: user!.id,
      title: title || 'Запись без заголовка',
      content,
      mood,
      is_locked: isLocked,
      pin_hash: isLocked && pin ? pin : null,
    })

    setSaving(false)
    if (error) {
      toast.error('Ошибка при сохранении')
      return
    }
    toast.success('Запись сохранена')
    router.push('/diary')
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Новая запись"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPinModal(true)}
              className={isLocked ? 'text-[var(--accent)]' : ''}
            >
              <Lock size={14} />
              {isLocked ? 'Защищено' : 'Заблокировать'}
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.back()}>
              Отмена
            </Button>
            <Button size="sm" onClick={handleSave} loading={saving}>
              Сохранить
            </Button>
          </div>
        }
      />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <Input
            placeholder="Заголовок записи..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold h-12 border-none shadow-none focus:ring-0 px-0 bg-transparent placeholder:text-[var(--text-tertiary)]"
          />

          {/* Mood picker */}
          <div className="flex items-center gap-2">
            <Smile size={15} className="text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-secondary)]">Настроение:</span>
            <div className="flex gap-1">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(mood === m.value ? null : m.value)}
                  title={m.label}
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
          </div>

          <RichEditor
            value={content}
            onChange={setContent}
            placeholder="Что у вас на уме сегодня?..."
            className="min-h-[400px]"
          />
        </div>
      </div>

      <Modal
        open={pinModal}
        onClose={() => setPinModal(false)}
        title="Защита PIN-кодом"
        description="Установите PIN-код для защиты записи"
        size="sm"
      >
        <div className="space-y-4">
          <Input
            type="password"
            label="PIN-код"
            placeholder="Введите PIN (минимум 4 символа)"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            icon={<Lock size={15} />}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setIsLocked(false)
                setPin('')
                setPinModal(false)
              }}
            >
              Снять защиту
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                if (pin.length < 4) {
                  toast.error('PIN должен быть минимум 4 символа')
                  return
                }
                setIsLocked(true)
                setPinModal(false)
                toast.success('PIN-код установлен')
              }}
            >
              Установить
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
