'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Language } from '@/lib/types'
import { getTranslations, type Translations } from '@/lib/i18n'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('kk')

  useEffect(() => {
    const saved = localStorage.getItem('tezi_lang') as Language | null
    if (saved && ['kk', 'ru', 'en'].includes(saved)) setLangState(saved)
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    localStorage.setItem('tezi_lang', l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: getTranslations(lang) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
