import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, lang = 'kk'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(
    lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  )
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('kk-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getMoodEmoji(mood: number): string {
  const emojis: Record<number, string> = {
    1: '😞',
    2: '😕',
    3: '😐',
    4: '🙂',
    5: '😊',
  }
  return emojis[mood] ?? '😐'
}

export function getMoodLabel(mood: number, lang: string): string {
  const labels: Record<number, Record<string, string>> = {
    1: { kk: 'Өте нашар', ru: 'Очень плохо', en: 'Very bad' },
    2: { kk: 'Нашар', ru: 'Плохо', en: 'Bad' },
    3: { kk: 'Орташа', ru: 'Средне', en: 'Okay' },
    4: { kk: 'Жақсы', ru: 'Хорошо', en: 'Good' },
    5: { kk: 'Тамаша', ru: 'Отлично', en: 'Great' },
  }
  return labels[mood]?.[lang] ?? 'Орташа'
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function isToday(date: string): boolean {
  return new Date(date).toDateString() === new Date().toDateString()
}

export function daysBetween(a: Date, b: Date): number {
  return Math.floor(Math.abs(b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}
