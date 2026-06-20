'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/providers/theme-provider'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { User, Lock, Shield, Bell, Palette, Eye, EyeOff } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
  userEmail: string
}

export function SettingsClient({ profile, userEmail }: Props) {
  const { theme } = useTheme()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [twoFactor] = useState(profile?.two_factor_enabled || false)

  async function handleSaveProfile() {
    setSavingProfile(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', profile!.id)
    setSavingProfile(false)
    if (error) { toast.error('Ошибка при сохранении'); return }
    toast.success('Профиль обновлён')
  }

  async function handleChangePassword() {
    if (!newPw || newPw.length < 8) { toast.error('Пароль должен быть минимум 8 символов'); return }
    setSavingPw(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setSavingPw(false)
    if (error) { toast.error(error.message); return }
    setCurrentPw('')
    setNewPw('')
    toast.success('Пароль изменён')
  }

  const sections = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'security', label: 'Безопасность', icon: Lock },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
  ]

  const [activeSection, setActiveSection] = useState('profile')

  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="md:col-span-1">
          <nav className="space-y-0.5">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
                  activeSection === id
                    ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text)]'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          {activeSection === 'profile' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Профиль</CardTitle>
                  <CardDescription>Ваша личная информация</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--accent)] flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{getInitials(fullName || userEmail)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text)]">{fullName || 'Пользователь'}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{userEmail}</p>
                    </div>
                  </div>
                  <Input
                    label="Полное имя"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Иван Иванов"
                    icon={<User size={14} />}
                  />
                  <Input label="Email" value={userEmail} disabled icon={<Eye size={14} />} />
                  <Button onClick={handleSaveProfile} loading={savingProfile}>
                    Сохранить изменения
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'security' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Смена пароля</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Новый пароль"
                    type={showPw ? 'text' : 'password'}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    icon={<Lock size={14} />}
                    rightElement={
                      <button onClick={() => setShowPw((p) => !p)} className="text-[var(--text-tertiary)]">
                        {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    }
                    placeholder="Минимум 8 символов"
                  />
                  <Button onClick={handleChangePassword} loading={savingPw}>
                    Изменить пароль
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Двухфакторная аутентификация</CardTitle>
                  <CardDescription>Дополнительный уровень защиты вашего аккаунта</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield size={18} className="text-[var(--text-secondary)]" />
                      <span className="text-sm text-[var(--text)]">2FA</span>
                      <Badge variant={twoFactor ? 'success' : 'default'}>
                        {twoFactor ? 'Включено' : 'Выключено'}
                      </Badge>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => toast.info('Скоро доступно')}>
                      {twoFactor ? 'Выключить' : 'Включить'}
                    </Button>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-3">
                    Двухфакторная аутентификация добавляет дополнительный уровень безопасности при входе.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[var(--danger)]">Опасная зона</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-[var(--danger)] rounded-[var(--radius-sm)] bg-[var(--danger-subtle)]">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)]">Удалить аккаунт</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        Все данные будут удалены без возможности восстановления
                      </p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => toast.error('Обратитесь в поддержку для удаления аккаунта')}>
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>Персонализация интерфейса</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Тема оформления</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      Текущая: {theme === 'dark' ? 'Тёмная' : theme === 'light' ? 'Светлая' : 'Системная'}
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Уведомления</CardTitle>
                <CardDescription>Управление уведомлениями</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-tertiary)]">
                  Настройки уведомлений будут доступны в ближайшем обновлении.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
