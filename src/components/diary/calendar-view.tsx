'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns'
import { ru } from 'date-fns/locale'
import type { DiaryEntry } from '@/types'

type CalendarEntry = Pick<DiaryEntry, 'id' | 'created_at' | 'mood'>

interface CalendarViewProps {
  entries: CalendarEntry[]
  onDayClick?: (date: Date, entries: CalendarEntry[]) => void
}

const moodColors: Record<string, string> = {
  great: 'var(--success)',
  good: '#60a5fa',
  neutral: 'var(--text-tertiary)',
  bad: 'var(--warning)',
  terrible: 'var(--danger)',
}

export function CalendarView({ entries, onDayClick }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date())
  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDay = monthStart.getDay()
  const blanks = Array(startDay === 0 ? 6 : startDay - 1).fill(null)

  function entriesForDay(date: Date) {
    return entries.filter((e) => isSameDay(new Date(e.created_at), date))
  }

  return (
    <div className="select-none">
      {/* Nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <h3 className="text-sm font-semibold text-[var(--text)] capitalize">
          {format(current, 'LLLL yyyy', { locale: ru })}
        </h3>
        <button
          onClick={() => setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
          className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 mb-1">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
          <div key={d} className="text-center text-xs text-[var(--text-tertiary)] py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {blanks.map((_, i) => <div key={`b${i}`} />)}
        {days.map((day) => {
          const dayEntries = entriesForDay(day)
          const hasEntries = dayEntries.length > 0
          const today = isToday(day)
          return (
            <button
              key={day.toISOString()}
              onClick={() => hasEntries && onDayClick?.(day, dayEntries)}
              className={cn(
                'relative flex flex-col items-center py-1.5 rounded-lg transition-colors text-sm',
                today
                  ? 'bg-[var(--accent)] text-white font-semibold'
                  : hasEntries
                  ? 'hover:bg-[var(--bg-secondary)] text-[var(--text)] font-medium cursor-pointer'
                  : 'text-[var(--text-secondary)] cursor-default'
              )}
            >
              <span>{format(day, 'd')}</span>
              {hasEntries && !today && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEntries.slice(0, 3).map((e, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full"
                      style={{ background: moodColors[e.mood || ''] || 'var(--accent)' }}
                    />
                  ))}
                </div>
              )}
              {hasEntries && today && (
                <div className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
