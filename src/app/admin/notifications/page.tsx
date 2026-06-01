'use client'
import { useState } from 'react'
import { Bell, Send, Users, Store, Truck } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { toast } from 'sonner'
import { clsx } from 'clsx'

type TargetGroup = 'all' | 'customers' | 'stores' | 'couriers'

export default function AdminNotificationsPage() {
  const { lang, t } = useLanguage()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState<TargetGroup>('all')
  const [loading, setLoading] = useState(false)

  const sentNotifications = [
    { id: 'n1', title: 'Жаңа акция!', message: '50% жеңілдік пиццаға!', target: 'customers' as TargetGroup, sentAt: '2026-06-01 10:00', count: 1248 },
    { id: 'n2', title: 'Жаңа тапсырыс', message: 'Жаңа жеткізу сұраулары бар', target: 'couriers' as TargetGroup, sentAt: '2026-06-01 09:30', count: 34 },
  ]

  const targets: { key: TargetGroup; label: string; icon: typeof Bell }[] = [
    { key: 'all', label: t.common.all, icon: Bell },
    { key: 'customers', label: lang === 'kk' ? 'Тапсырыс берушілер' : lang === 'ru' ? 'Клиенты' : 'Customers', icon: Users },
    { key: 'stores', label: t.admin.stores, icon: Store },
    { key: 'couriers', label: t.admin.couriers, icon: Truck },
  ]

  const handleSend = async () => {
    if (!title || !message) { toast.error(lang === 'ru' ? 'Заполните все поля' : 'Барлық өрістерді толтырыңыз'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    toast.success(lang === 'kk' ? 'Хабарландыру жіберілді!' : lang === 'ru' ? 'Уведомление отправлено!' : 'Notification sent!')
    setTitle(''); setMessage('')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.admin.notifications}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send form */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Send size={16} className="text-[var(--color-primary)]" />
            {lang === 'kk' ? 'Хабарландыру жіберу' : lang === 'ru' ? 'Отправить уведомление' : 'Send notification'}
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">{t.admin.users}</p>
              <div className="grid grid-cols-2 gap-2">
                {targets.map(({ key, label, icon: Icon }) => (
                  <button key={key} onClick={() => setTarget(key)}
                    className={clsx(
                      'flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-medium border transition-all',
                      target === key ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)]'
                    )}
                  >
                    <Icon size={14} />{label}
                  </button>
                ))}
              </div>
            </div>
            <Input label={lang === 'kk' ? 'Тақырып' : lang === 'ru' ? 'Заголовок' : 'Title'} placeholder={lang === 'kk' ? 'Хабарландыру тақырыбы' : lang === 'ru' ? 'Заголовок уведомления' : 'Notification title'} value={title} onChange={e => setTitle(e.target.value)} />
            <div>
              <label className="text-sm font-medium text-[var(--color-text-secondary)] block mb-1.5">
                {lang === 'kk' ? 'Хабар' : lang === 'ru' ? 'Сообщение' : 'Message'}
              </label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder={lang === 'kk' ? 'Хабарландыру мәтіні...' : lang === 'ru' ? 'Текст уведомления...' : 'Notification text...'} className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none" />
            </div>
            <Button fullWidth loading={loading} onClick={handleSend}><Send size={16} />{lang === 'kk' ? 'Жіберу' : lang === 'ru' ? 'Отправить' : 'Send'}</Button>
          </div>
        </div>

        {/* Sent notifications */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-5">
          <h2 className="font-bold text-[var(--color-text)] mb-4">
            {lang === 'kk' ? 'Жіберілген хабарландырулар' : lang === 'ru' ? 'Отправленные уведомления' : 'Sent notifications'}
          </h2>
          <div className="space-y-3">
            {sentNotifications.map(n => (
              <div key={n.id} className="p-3 bg-[var(--color-surface-secondary)] rounded-xl">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-semibold text-sm text-[var(--color-text)]">{n.title}</span>
                  <Badge variant="blue" size="sm">{n.target}</Badge>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mb-2">{n.message}</p>
                <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                  <span>{n.sentAt}</span>
                  <span>{n.count} {lang === 'kk' ? 'алушы' : lang === 'ru' ? 'получателей' : 'recipients'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
