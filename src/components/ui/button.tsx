import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-sm)] transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] whitespace-nowrap',
          {
            primary: 'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-sm active:scale-[0.98]',
            secondary: 'bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text)] active:scale-[0.98]',
            ghost: 'hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text)]',
            danger: 'bg-[var(--danger)] hover:opacity-90 text-white active:scale-[0.98]',
            outline: 'border border-[var(--border)] hover:bg-[var(--bg-secondary)] text-[var(--text)]',
          }[variant],
          {
            sm: 'px-3 py-1.5 text-sm h-8',
            md: 'px-4 py-2 text-sm h-9',
            lg: 'px-5 py-2.5 text-base h-11',
            icon: 'w-9 h-9 p-0',
          }[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }
