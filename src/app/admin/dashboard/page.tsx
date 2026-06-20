import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, BookOpen, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: articleCount },
    { count: diaryCount },
    { count: goalCount },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('diary_entries').select('*', { count: 'exact', head: true }),
    supabase.from('goals').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('id, email, full_name, role, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Пользователей', value: userCount || 0, icon: Users, color: 'var(--accent)' },
    { label: 'Статей', value: articleCount || 0, icon: FileText, color: 'var(--warning)' },
    { label: 'Записей в дневнике', value: diaryCount || 0, icon: BookOpen, color: 'var(--success)' },
    { label: 'Целей', value: goalCount || 0, icon: TrendingUp, color: 'var(--danger)' },
  ]

  return (
    <div className="flex flex-col h-full">
      <Header title="Панель администратора" description="Аналитика и управление" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <div
                  className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center mb-3"
                  style={{ background: `${color}20`, color }}
                >
                  <Icon size={18} />
                </div>
                <p className="text-2xl font-bold text-[var(--text)]">{value.toLocaleString()}</p>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Последние пользователи</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Пользователь</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Роль</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Дата</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {(recentUsers || []).map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-5 py-3 font-medium text-[var(--text)]">
                      {user.full_name || '—'}
                    </td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-[var(--warning-subtle)] text-[var(--warning)]'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
