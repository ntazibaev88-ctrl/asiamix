'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Search, Shield, ShieldOff } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types'

export function UsersManager({ initialUsers }: { initialUsers: Profile[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')

  const filtered = users.filter((u) =>
    !search ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function toggleAdmin(user: Profile) {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id)
    if (error) { toast.error('Ошибка'); return }
    setUsers((p) => p.map((u) => u.id === user.id ? { ...u, role: newRole } : u))
    toast.success(newRole === 'admin' ? 'Назначен администратором' : 'Снят с должности администратора')
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <Input
          placeholder="Поиск пользователей..."
          icon={<Search size={14} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <p className="text-sm text-[var(--text-secondary)] mb-3">{filtered.length} пользователей</p>
      <Card>
        <CardContent className="p-0 divide-y divide-[var(--border)]">
          {filtered.map((user) => (
            <div key={user.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-semibold">
                  {getInitials(user.full_name || user.email)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text)]">{user.full_name || '—'}</p>
                <p className="text-xs text-[var(--text-secondary)]">{user.email}</p>
              </div>
              <Badge variant={user.role === 'admin' ? 'warning' : 'default'}>
                {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
              </Badge>
              <p className="text-xs text-[var(--text-tertiary)] hidden sm:block">
                {new Date(user.created_at).toLocaleDateString('ru-RU')}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleAdmin(user)}
                title={user.role === 'admin' ? 'Снять права' : 'Назначить администратором'}
              >
                {user.role === 'admin' ? <ShieldOff size={14} /> : <Shield size={14} />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
