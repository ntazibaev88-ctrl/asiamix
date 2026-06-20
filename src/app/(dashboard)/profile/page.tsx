'use client'
import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/topbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Camera, User, Mail, Shield, Sparkles, Calendar } from 'lucide-react'
import { getInitials, formatDate } from '@/lib/utils'

interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  plan: 'free' | 'premium'
  created_at: string
}

export default function ProfilePage() {
  const t = useT()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile({ ...data, email: user.email ?? '' })
      setFullName(data?.full_name ?? '')
      setLoading(false)
    }
    load()
  }, [supabase])

  const handleSave = async () => {
    if (!fullName.trim()) { toast.error('Атыңызды енгізіңіз'); return }
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', profile?.id ?? '')
    if (error) toast.error(error.message)
    else toast.success('Профиль жаңартылды')
    setSaving(false)
  }

  if (loading) {
    return (
      <div>
        <TopBar title={t.nav.profile} />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar title={t.nav.profile} />

      <div className="mt-6 max-w-2xl space-y-6">
        {/* Avatar card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profile?.full_name ?? 'U')
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-lg hover:bg-amber-600 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {profile?.full_name || 'Атыңызды қосыңыз'}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">{profile?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {profile?.plan === 'premium' ? (
                    <Badge variant="premium">
                      <Sparkles className="w-3 h-3" />
                      Премиум
                    </Badge>
                  ) : (
                    <Badge variant="default">Тегін жоспар</Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-zinc-400">
                    <Calendar className="w-3 h-3" />
                    {profile?.created_at && formatDate(profile.created_at, 'kk')} тіркелді
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              Жеке ақпарат
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label={t.auth.fullName}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Аты-жөніңіз"
              icon={<User className="w-4 h-4" />}
            />
            <Input
              label={t.auth.email}
              value={profile?.email ?? ''}
              disabled
              icon={<Mail className="w-4 h-4" />}
              hint="Email мекенжайын өзгерту мүмкін емес"
            />
            <Button onClick={handleSave} loading={saving}>
              {t.common.save}
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Қауіпсіздік
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Құпия сөзді өзгерту</p>
                <p className="text-xs text-zinc-400">Email арқылы сілтеме жіберіледі</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const { error } = await supabase.auth.resetPasswordForEmail(profile?.email ?? '')
                  if (!error) toast.success('Сілтеме жіберілді')
                }}
              >
                Өзгерту
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Тіркелгіні жою</p>
                <p className="text-xs text-zinc-400">Барлық деректеріңіз жойылады</p>
              </div>
              <Button variant="danger" size="sm">
                Жою
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Premium upgrade */}
        {profile?.plan !== 'premium' && (
          <Card className="border-amber-200 dark:border-amber-900/30 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Премиумға жаңарту</h3>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Шексіз мүмкіндіктер. Алғашқы 2 ай тегін.
                  </p>
                </div>
                <Button size="sm" className="shadow-lg shadow-amber-500/20 shrink-0">
                  Жаңарту
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
