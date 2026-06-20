'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import type { Lang } from '@/types'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

export const LanguageContext = createContext<LanguageContextValue>({
  lang: 'kk',
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('kk')

  useEffect(() => {
    const stored = localStorage.getItem('qadam_lang') as Lang | null
    if (stored && ['kk', 'ru', 'en'].includes(stored)) {
      setLangState(stored)
    }
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('qadam_lang', l)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}
