'use client'

import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Bell, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg)] shrink-0">
      <div>
        <h1 className="text-xl font-semibold text-[var(--text)]">{title}</h1>
        {description && (
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <Button variant="ghost" size="icon" title="Поиск">
          <Search size={16} />
        </Button>
        <Button variant="ghost" size="icon" title="Уведомления">
          <Bell size={16} />
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
