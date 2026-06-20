'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/components/providers/theme-provider'
import { Button } from './button'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const options = [
    { value: 'light', label: 'Светлая', icon: Sun },
    { value: 'dark', label: 'Тёмная', icon: Moon },
    { value: 'system', label: 'Системная', icon: Monitor },
  ] as const

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((p) => !p)}
        title="Сменить тему"
      >
        <Icon size={16} />
      </Button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-lg)] py-1 z-50">
          {options.map(({ value, label, icon: OptionIcon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false) }}
              className={cn(
                'flex items-center gap-2.5 w-full px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] transition-colors',
                theme === value ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              )}
            >
              <OptionIcon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
