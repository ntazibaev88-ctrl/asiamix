import { clsx } from 'clsx'

export function Spinner({ size = 'md', className }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className={clsx('animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]', sizes[size], className)} />
  )
}
