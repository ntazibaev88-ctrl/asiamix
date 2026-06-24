"use client";

import { useState, useCallback, useEffect } from "react";
import { LANG_COOKIE, translations, DEFAULT_LANG } from "@/lib/i18n";
import type { Lang, TranslationKey } from "@/lib/i18n";

function getLangFromCookie(): Lang {
  if (typeof document === "undefined") return DEFAULT_LANG;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]+)`));
  const val = match?.[1];
  return (["kk", "ru", "en"] as const).includes(val as Lang)
    ? (val as Lang)
    : DEFAULT_LANG;
}

export function useLanguage() {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    setLangState(getLangFromCookie());
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    const currentPath = window.location.pathname;
    window.location.href = `/api/set-lang?lang=${newLang}&redirect=${encodeURIComponent(currentPath)}`;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string =>
      translations[lang][key] ?? translations[DEFAULT_LANG][key] ?? key,
    [lang]
  );

  return { lang, setLang, t };
}

// Keep LanguageProvider for backward compat but it's now a no-op wrapper
export function LanguageProvider({
  children,
  initialLang: _initialLang,
}: {
  children: React.ReactNode;
  initialLang?: string;
}) {
  return <>{children}</>;
}
