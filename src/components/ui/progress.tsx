import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'gold' | 'emerald' | 'blue' | 'rose'
}

export function Progress({
  value,
  max = 100,
  className,
  barClassName,
  showLabel,
  size = 'md',
  color = 'gold',
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100)
  return (
    <div className={cn('relative w-full', className)}>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {Math.round(pct)}%
        </span>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden',
          { 'h-1.5': size === 'sm', 'h-2.5': size === 'md', 'h-4': size === 'lg' }
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            {
              'bg-amber-500': color === 'gold',
              'bg-emerald-500': color === 'emerald',
              'bg-blue-500': color === 'blue',
              'bg-rose-500': color === 'rose',
            },
            barClassName
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
