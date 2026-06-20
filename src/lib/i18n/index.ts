'use client'
import { useContext } from 'react'
import { LanguageContext } from '@/contexts/language'
import { kk } from './translations/kk'
import { ru } from './translations/ru'
import { en } from './translations/en'
import type { Lang } from '@/types'

export const translations = { kk, ru, en }

export function useT() {
  const { lang } = useContext(LanguageContext)
  return translations[lang]
}

export function t(lang: Lang) {
  return translations[lang]
}
