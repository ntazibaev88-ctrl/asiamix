'use client'
import { useCallback, useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'
import { Plus, Target, Trash2, Edit2, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Goal, GoalCategory } from '@/types'

const CATEGORIES: { value: GoalCategory; emoji: string }[] = [
  { value: 'house', emoji: '🏠' },
  { value: 'car', emoji: '🚗' },
  { value: 'business', emoji: '💼' },
  { value: 'education', emoji: '📚' },
  { value: 'travel', emoji: '✈️' },
  { value: 'family', emoji: '👨‍👩‍👧' },
  { value: 'health', emoji: '💪' },
  { value: 'other', emoji: '⭐' },
]

export default function GoalsPage() {
  const t = useT()
  const supabase = createClient()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Form
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formCategory, setFormCategory] = useState<GoalCategory>('other')
  const [formDate, setFormDate] = useState('')
  const [formProgress, setFormProgress] = useState(0)
  const [formNotes, setFormNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('goals').select('*, milestones(*)').order('created_at', { ascending: false })
    setGoals((data as Goal[]) ?? [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditGoal(null)
    setFormTitle(''); setFormDesc(''); setFormCategory('other')
    setFormDate(''); setFormProgress(0); setFormNotes('')
    setModalOpen(true)
  }

  const openEdit = (g: Goal) => {
    setEditGoal(g)
    setFormTitle(g.title); setFormDesc(g.description ?? '')
    setFormCategory(g.category); setFormDate(g.target_date ?? '')
    setFormProgress(g.progress); setFormNotes(g.notes ?? '')
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formTitle.trim()) { toast.error('Тақырыпты енгізіңіз'); return }
    setSaving(true)
    const payload = {
      title: formTitle, description: formDesc, category: formCategory,
      target_date: formDate || null, progress: formProgress, notes: formNotes,
    }
    const { error } = editGoal
      ? await supabase.from('goals').update(payload).eq('id', editGoal.id)
      : await supabase.from('goals').insert(payload)
    if (error) toast.error(error.message)
    else { toast.success(editGoal ? 'Мақсат жаңартылды' : 'Мақсат сақталды'); setModalOpen(false); load() }
    setSaving(false)
  }

  const toggleComplete = async (g: Goal) => {
    const { error } = await supabase.from('goals').update({ completed: !g.completed }).eq('id', g.id)
    if (!error) load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from('goals').delete().eq('id', deleteId)
    toast.success('Мақсат жойылды'); setDeleteId(null); load()
  }

  const categoryEmoji = (cat: GoalCategory) => CATEGORIES.find((c) => c.value === cat)?.emoji ?? '⭐'
  const categoryLabel = (cat: GoalCategory) => t.goals.categories[cat]

  const active = goals.filter((g) => !g.completed)
  const completed = goals.filter((g) => g.completed)

  return (
    <div>
      <TopBar title={t.goals.title} />

      <div className="mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{active.length}</div>
              <div className="text-xs text-zinc-400">{t.goals.inProgress}</div>
            </div>
            <div className="w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-500">{completed.length}</div>
              <div className="text-xs text-zinc-400">{t.goals.completed}</div>
            </div>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            {t.goals.newGoal}
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-20">
            <Target className="w-16 h-16 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium mb-2">{t.goals.noGoals}</p>
            <p className="text-sm text-zinc-400 mb-6">Алғашқы мақсатыңызды қойыңыз</p>
            <Button onClick={openCreate}>
              <Plus className="w-4 h-4" />
              {t.goals.newGoal}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Active */}
            {active.length > 0 && (
              <div className="space-y-3">
                {active.map((goal) => (
                  <Card key={goal.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{categoryEmoji(goal.category)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                            {goal.title}
                          </h3>
                          <Badge variant="default">{categoryLabel(goal.category)}</Badge>
                        </div>
                        {goal.target_date && (
                          <p className="text-xs text-zinc-400 mb-2">
                            🗓 {formatDate(goal.target_date, 'kk')}
                          </p>
                        )}
                        <div className="flex items-center gap-3">
                          <Progress value={goal.progress} className="flex-1" size="sm" />
                          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 shrink-0">
                            {goal.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => toggleComplete(goal)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                          title="Орындалды деп белгілеу"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEdit(goal)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(goal.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedId(expandedId === goal.id ? null : goal.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                          {expandedId === goal.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {expandedId === goal.id && (goal.description || goal.notes) && (
                      <div className="mt-4 pl-14 space-y-2">
                        {goal.description && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">{goal.description}</p>
                        )}
                        {goal.notes && (
                          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">
                            <p className="text-xs text-zinc-500 mb-1">Жазбалар</p>
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{goal.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-3 mt-6">
                  {t.goals.completed} ({completed.length})
                </h3>
                <div className="space-y-3">
                  {completed.map((goal) => (
                    <Card key={goal.id} className="p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{categoryEmoji(goal.category)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-zinc-700 dark:text-zinc-300 truncate line-through">
                            {goal.title}
                          </h3>
                        </div>
                        <Badge variant="success">✓ {t.goals.completed}</Badge>
                        <button
                          onClick={() => toggleComplete(goal)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGoal ? t.goals.editGoal : t.goals.newGoal} size="lg">
        <div className="px-6 pb-6 space-y-4">
          <Input label="Тақырып" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Мақсатыңыздың атауы" required />

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">Санат</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(({ value, emoji }) => (
                <button
                  key={value}
                  onClick={() => setFormCategory(value)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-xs transition-all ${
                    formCategory === value
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-zinc-600 dark:text-zinc-400">{t.goals.categories[value]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">
              {t.goals.progress}: {formProgress}%
            </label>
            <input
              type="range" min={0} max={100} value={formProgress}
              onChange={(e) => setFormProgress(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <Input label={t.goals.targetDate} type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">Сипаттама</label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-1.5">{t.goals.notes}</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button onClick={handleSave} loading={saving}>{t.common.save}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Мақсатты жою" size="sm">
        <div className="px-6 pb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">Бұл мақсатты жойғыңыз келе ме?</p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{t.common.cancel}</Button>
            <Button variant="danger" onClick={handleDelete}>{t.common.delete}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
