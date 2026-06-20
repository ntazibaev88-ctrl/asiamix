import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { DiaryEntryDetail } from './entry-detail'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('diary_entries').select('title').eq('id', id).single()
  return { title: data?.title || 'Запись дневника' }
}

export default async function DiaryEntryPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entry } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!entry) notFound()

  return <DiaryEntryDetail entry={entry} />
}
