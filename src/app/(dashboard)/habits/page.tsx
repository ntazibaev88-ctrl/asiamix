'use client'
import { useCallback, useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Plus, Flame, Check, Trash2, Edit2, TrendingUp } from 'lucide-react'
import type { Habit, HabitFrequency } from '@/types'

const COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
]

const ICONS = ['🎯', '📚', '💪', '🧘', '🏃', '💧', '🥗', '😴', '✍️', '🧹', '💰', '🎨']

export default function HabitsPage() {
  const t = useT()
  const supabase = createClient()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editHabit, setEditHabit] = useState<Habit | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [completingId, setCompletingId] = useState<string | null>(null)

  // Form
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formFreq, setFormFreq] = useState<HabitFrequency>('daily')
  const [formColor, setFormColor] = useState(COLORS[0])
  const [formIcon, setFormIcon] = useState(ICONS[0])
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('habits')
      .select('*, habit_completions(date, completed)')
      .order('created_at', { ascending: false })
    setHabits((data as Habit[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const isDoneToday = (habit: Habit) =>
    (habit.completions ?? []).some((c) => c.date === today && c.completed)

  const markDone = async (habit: Habit) => {
    if (isDoneToday(habit)) return
    setCompletingId(habit.id)
    const { error } = await supabase.from('habit_completions').upsert({
      habit_id: habit.id,
      date: today,
      completed: true,
    })
    if (!error) {
      await supabase.from('habits').update({ streak: (habit.streak ?? 0) + 1 }).eq('id', habit.id)
      toast.success(`${habit.icon} ${habit.title} — орындалды!`)
      load()
    }
    setCompletingId(null)
  }

  const openCreate = () => {
    setEditHabit(null)
    setFormTitle(''); setFormDesc(''); setFormFreq('daily')
    setFormColor(COLORS[0]); setFormIcon(ICONS[0])
    setModalOpen(true)
  }

  const openEdit = (h: Habit) => {
    setEditHabit(h)
    setFormTitle(h.title); setFormDesc(h.description ?? '')
    setFormFreq(h.frequency); setFormColor(h.color); setFormIcon(h.icon)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formTitle.trim()) { toast.error('Тақырыпты енгізіңіз'); return }
    setSaving(true)
    const payload = { title: formTitle, description: formDesc, frequency: formFreq, color: formColor, icon: formIcon }
    const { error } = editHabit
      ? await supabase.from('habits').update(payload).eq('id', editHabit.id)
      : await supabase.from('habits').insert({ ...payload, streak: 0, best_streak: 0 })
    if (error) toast.error(error.message)
    else { toast.success(editHabit ? 'Дағды жаңартылды' : 'Дағды қосылды'); setModalOpen(false); load() }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('habits').delete().eq('id', deleteId)
    toast.success('Дағды жойылды'); setDeleteId(null); load()
  }

  const freqLabel = (f: HabitFrequency) =>
    f === 'daily' ? t.habits.daily : f === 'weekly' ? t.habits.weekly : t.habits.monthly

  const totalStreak = habits.reduce((s, h) => s + (h.streak ?? 0), 0)
  const doneToday = habits.filter(isDoneToday).length

  return (
    <div>
      <TopBar title={t.habits.title} />

      <div className="mt-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Жалпы дағды', value: habits.length, icon: '🎯' },
            { label: 'Бүгін орындалды', value: `${doneToday}/${habits.length}`, icon: '✅' },
            { label: 'Жалпы күн қатарынан', value: totalStreak, icon: '🔥' },
          ].map(({ label, value, icon }) => (
            <Card key={label} className="p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
              <div className="text-xs text-zinc-400">{label}</div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {habits.length} {t.habits.title.toLowerCase()}
          </h2>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            {t.habits.newHabit}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔄</div>
            <p className="text-zinc-500 font-medium mb-2">{t.habits.noHabits}</p>
            <p className="text-sm text-zinc-400 mb-6">Алғашқы дағдыңызды қосыңыз</p>
            <Button onClick={openCreate}><Plus className="w-4 h-4" /> {t.habits.newHabit}</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {habits.map((habit) => {
              const done = isDoneToday(habit)
              return (
                <Card
                  key={habit.id}
                  className={`p-4 transition-all ${done ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Icon with color */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                      style={{ backgroundColor: habit.color + '20', border: `2px solid ${habit.color}30` }}
                    >
                      {habit.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className={`font-semibold text-zinc-900 dark:text-zinc-100 truncate ${done ? 'line-through text-zinc-400' : ''}`}>
                          {habit.title}
                        </h3>
                        <Badge variant="default">{freqLabel(habit.frequency)}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs text-orange-500">
                          <Flame className="w-3 h-3" />
                          <span>{habit.streak ?? 0} {t.habits.streak.toLowerCase()}</span>
                        </div>
                        {(habit.best_streak ?? 0) > 0 && (
                          <div className="flex items-center gap-1 text-xs text-zinc-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>Үздік: {habit.best_streak}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => markDone(habit)}
                        disabled={done || completingId === habit.id}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          done
                            ? 'bg-emerald-500/10 text-emerald-500 cursor-default'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-500'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEdit(habit)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteId(habit.id)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editHabit ? t.habits.newHabit : t.habits.newHabit} size="md">
        <div className="px-6 pb-6 space-y-4">
          <Input label="Тақырып" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Дағдыңыздың атауы" />

          {/* Frequency */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Жиілік</label>
            <div className="flex rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {(['daily', 'weekly', 'monthly'] as HabitFrequency[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormFreq(f)}
                  className={`flex-1 py-2 text-sm transition-colors ${formFreq === f ? 'bg-amber-500 text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                >
                  {freqLabel(f)}
                </button>
              ))}
            </div>
          </div>

          {/* Icon picker */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Белгіше</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setFormIcon(icon)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${formIcon === icon ? 'ring-2 ring-amber-500 scale-110' : 'hover:scale-110'}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Түс</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setFormColor(color)}
                  className={`w-8 h-8 rounded-full transition-all ${formColor === color ? 'scale-125 ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-900' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <Input label="Сипаттама (міндетті емес)" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="..." />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} loading={saving}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Дағдыны жою" size="sm">
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-500 mb-6">Бұл дағдыны жойғыңыз келе ме?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{t.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
