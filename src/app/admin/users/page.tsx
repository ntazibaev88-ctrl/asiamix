'use client'
import { useState } from 'react'
import { Search, UserX, UserCheck, Shield } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { Role } from '@/lib/types'
import { toast } from 'sonner'
import { clsx } from 'clsx'

interface MockUser {
  id: string; name: string; email: string; role: Role; phone: string; status: 'active' | 'banned'; createdAt: string
}

const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Айгерим Назарова', email: 'aigerim@example.com', role: 'customer', phone: '+7 777 111 22 33', status: 'active', createdAt: '2024-01-15' },
  { id: 'u2', name: 'Дамир Курманов', email: 'damir@example.com', role: 'courier', phone: '+7 777 222 33 44', status: 'active', createdAt: '2024-02-20' },
  { id: 'u3', name: 'Сакура Суши', email: 'sakura@example.com', role: 'store', phone: '+7 777 333 44 55', status: 'active', createdAt: '2024-01-10' },
  { id: 'u4', name: 'Зарина Алиева', email: 'zarina@example.com', role: 'customer', phone: '+7 777 444 55 66', status: 'banned', createdAt: '2024-03-01' },
  { id: 'u5', name: 'Admin User', email: 'admin@tezi.kz', role: 'admin', phone: '+7 777 000 00 00', status: 'active', createdAt: '2024-01-01' },
]

const ROLE_COLORS: Record<Role, 'green' | 'blue' | 'yellow' | 'red'> = {
  customer: 'blue', store: 'green', courier: 'yellow', admin: 'red'
}

export default function AdminUsersPage() {
  const { lang, t } = useLanguage()
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all')

  const filtered = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role === roleFilter
    return matchesSearch && matchesRole
  })

  const toggleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'banned' : 'active' } : u))
    toast.success(lang === 'ru' ? 'Статус обновлён' : 'Мәртебе жаңартылды')
  }

  const roles: (Role | 'all')[] = ['all', 'customer', 'store', 'courier', 'admin']
  const roleLabels: Record<Role | 'all', string> = {
    all: t.common.all,
    customer: lang === 'kk' ? 'Тапсырыс берушілер' : lang === 'ru' ? 'Клиенты' : 'Customers',
    store: t.admin.stores,
    courier: t.admin.couriers,
    admin: lang === 'kk' ? 'Әкімшілер' : lang === 'ru' ? 'Администраторы' : 'Admins',
  }

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.admin.users}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <div className="flex gap-2 overflow-x-auto">
          {roles.map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={clsx(
                'flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium border transition-all',
                roleFilter === r ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
              )}
            >
              {roleLabels[r]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(user => (
            <div key={user.id} className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-[var(--color-primary-light)] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[var(--color-primary)]">{user.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-[var(--color-text)]">{user.name}</span>
                  <Badge variant={ROLE_COLORS[user.role]} size="sm">{user.role}</Badge>
                  {user.status === 'banned' && <Badge variant="red" size="sm">banned</Badge>}
                </div>
                <p className="text-xs text-[var(--color-text-muted)] truncate">{user.email} · {user.phone}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleBan(user.id)}
                  className={clsx(
                    'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors',
                    user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'
                  )}
                >
                  {user.status === 'active' ? <><UserX size={14} />{t.admin.ban}</> : <><UserCheck size={14} />{t.admin.unban}</>}
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <Shield size={40} className="mx-auto mb-3 opacity-30" />
            <p>{lang === 'kk' ? 'Пайдаланушылар табылмады' : lang === 'ru' ? 'Пользователи не найдены' : 'No users found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
