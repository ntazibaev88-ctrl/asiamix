'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={cn(
          'relative w-full rounded-[var(--radius-lg)] bg-[var(--bg)] shadow-[var(--shadow-lg)] border border-[var(--border)]',
          {
            sm: 'max-w-sm',
            md: 'max-w-md',
            lg: 'max-w-2xl',
          }[size],
          className
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-[var(--border)]">
            <div>
              {title && (
                <h2 className="text-base font-semibold text-[var(--text)]">{title}</h2>
              )}
              {description && (
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="-mt-1 -mr-1">
              <X size={16} />
            </Button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] transition-colors z-10"
          >
            <X size={16} />
          </button>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
