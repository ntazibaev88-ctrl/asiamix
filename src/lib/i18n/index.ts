import kk from './kk'
import ru from './ru'
import en from './en'
import type { Language } from '../types'

export const translations = { kk, ru, en } as const

export type Translations = typeof kk

export function getTranslations(lang: Language): Translations {
  return translations[lang] as unknown as Translations
}

export { kk, ru, en }
