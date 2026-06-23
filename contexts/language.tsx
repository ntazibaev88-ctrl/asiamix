"use client";

import { createContext, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { LANG_COOKIE, translations, DEFAULT_LANG } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key) => translations[DEFAULT_LANG][key] ?? key,
});

export function LanguageProvider({
  children,
  initialLang,
}: {
  children: React.ReactNode;
  initialLang: Lang;
}) {
  const router = useRouter();

  const setLang = useCallback(
    (lang: Lang) => {
      document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000`;
      router.refresh();
    },
    [router]
  );

  const translate = useCallback(
    (key: TranslationKey): string =>
      translations[initialLang][key] ?? translations[DEFAULT_LANG][key] ?? key,
    [initialLang]
  );

  return (
    <LanguageContext.Provider value={{ lang: initialLang, setLang, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
