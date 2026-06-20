import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  trackClassName?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function Progress({
  value,
  max = 100,
  className,
  trackClassName,
  color = 'var(--accent)',
  size = 'md',
  showLabel,
}: ProgressProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'flex-1 rounded-full bg-[var(--bg-tertiary)] overflow-hidden',
          { sm: 'h-1', md: 'h-1.5', lg: 'h-2.5' }[size],
          trackClassName
        )}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--text-secondary)] tabular-nums w-8 text-right">
          {Math.round(percent)}%
        </span>
      )}
    </div>
  )
}
