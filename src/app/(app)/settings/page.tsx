import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { SettingsClient } from './settings-client'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Настройки' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div className="flex flex-col h-full">
      <Header title="Настройки" description="Управление аккаунтом и безопасностью" />
      <div className="flex-1 overflow-auto p-6">
        <SettingsClient profile={profile} userEmail={user!.email || ''} />
      </div>
    </div>
  )
}
