'use client'
import { useState } from 'react'
import { Search, FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'

type LogLevel = 'info' | 'warning' | 'error' | 'success'

interface AuditLog {
  id: string; timestamp: string; user: string; action: string; level: LogLevel; details: string
}

const LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2026-06-01 14:32:15', user: 'admin@tezi.kz', action: 'USER_BANNED', level: 'warning', details: 'User zarina@example.com banned for suspicious activity' },
  { id: 'l2', timestamp: '2026-06-01 14:15:00', user: 'sakura@example.com', action: 'ORDER_ACCEPTED', level: 'success', details: 'Order #ord1 accepted by Sakura Sushi' },
  { id: 'l3', timestamp: '2026-06-01 13:58:42', user: 'system', action: 'NEW_STORE_REGISTERED', level: 'info', details: 'New store "Green Mart" awaiting approval' },
  { id: 'l4', timestamp: '2026-06-01 13:20:11', user: 'damir@example.com', action: 'DELIVERY_COMPLETED', level: 'success', details: 'Delivery for order #ord1 completed' },
  { id: 'l5', timestamp: '2026-06-01 12:05:33', user: 'system', action: 'PAYMENT_FAILED', level: 'error', details: 'Card payment failed for order #ord3' },
  { id: 'l6', timestamp: '2026-06-01 11:30:22', user: 'admin@tezi.kz', action: 'STORE_APPROVED', level: 'success', details: 'Store "Brew & Beans" has been approved' },
]

const levelColor: Record<LogLevel, 'green' | 'yellow' | 'red' | 'blue'> = {
  info: 'blue', warning: 'yellow', error: 'red', success: 'green'
}

export default function AdminLogsPage() {
  const { lang, t } = useLanguage()
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'all'>('all')

  const filtered = LOGS.filter(l => {
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = levelFilter === 'all' || l.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-black text-[var(--color-text)] mb-6">{t.admin.logs}</h1>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input placeholder={t.common.search} value={search} onChange={e => setSearch(e.target.value)} leftIcon={<Search size={16} />} className="flex-1" />
        <div className="flex gap-2">
          {(['all', 'info', 'success', 'warning', 'error'] as const).map(l => (
            <button key={l} onClick={() => setLevelFilter(l)}
              className={clsx(
                'flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                levelFilter === l ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)]'
              )}
            >
              {l === 'all' ? t.common.all : l}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        <div className="divide-y divide-[var(--color-border)]">
          {filtered.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4">
              <div className="flex-shrink-0 mt-0.5">
                <Badge variant={levelColor[log.level]} size="sm">{log.level}</Badge>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-semibold text-sm text-[var(--color-text)]">{log.action}</span>
                  <span className="text-xs text-[var(--color-text-muted)]">by {log.user}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)]">{log.details}</p>
              </div>
              <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0 hidden sm:block">{log.timestamp}</span>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[var(--color-text-muted)]">
            <FileText size={40} className="mx-auto mb-3 opacity-30" />
            <p>{lang === 'kk' ? 'Жазбалар жоқ' : lang === 'ru' ? 'Нет записей' : 'No logs found'}</p>
          </div>
        )}
      </div>
    </div>
  )
}
