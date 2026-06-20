'use client'

import { useRef, useCallback } from 'react'
import {
  Bold, Italic, Underline, List, ListOrdered, Quote, Heading1, Heading2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

const tools = [
  { cmd: 'bold', icon: Bold, title: 'Жирный (Ctrl+B)' },
  { cmd: 'italic', icon: Italic, title: 'Курсив (Ctrl+I)' },
  { cmd: 'underline', icon: Underline, title: 'Подчёркнутый (Ctrl+U)' },
  { cmd: 'separator' },
  { cmd: 'formatBlock', value: 'H1', icon: Heading1, title: 'Заголовок 1' },
  { cmd: 'formatBlock', value: 'H2', icon: Heading2, title: 'Заголовок 2' },
  { cmd: 'separator' },
  { cmd: 'insertUnorderedList', icon: List, title: 'Список' },
  { cmd: 'insertOrderedList', icon: ListOrdered, title: 'Нумерованный список' },
  { cmd: 'formatBlock', value: 'BLOCKQUOTE', icon: Quote, title: 'Цитата' },
] as const

export function RichEditor({ value, onChange, placeholder, className }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const exec = useCallback((cmd: string, val?: string) => {
    document.execCommand(cmd, false, val)
    editorRef.current?.focus()
  }, [])

  return (
    <div className={cn('rich-editor flex flex-col border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-2 border-b border-[var(--border)] bg-[var(--bg-secondary)] flex-wrap">
        {tools.map((tool, i) => {
          if (tool.cmd === 'separator') {
            return <div key={i} className="w-px h-5 bg-[var(--border)] mx-1" />
          }
          const Icon = tool.icon!
          return (
            <button
              key={i}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                exec(tool.cmd as string, (tool as { value?: string }).value)
              }}
              title={tool.title}
              className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
            >
              <Icon size={14} />
            </button>
          )
        })}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder || 'Начните писать...'}
        className="flex-1 p-4 text-sm text-[var(--text)] leading-relaxed"
        onInput={() => onChange(editorRef.current?.innerHTML || '')}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  )
}
