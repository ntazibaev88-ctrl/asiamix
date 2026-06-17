"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "nomi.theme";

/**
 * Inline script that applies the persisted (or system) theme before paint to
 * avoid a flash of the wrong theme. Rendered in <head> via the root layout.
 */
export const themeNoFlashScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

// Tiny external store. The DOM `data-theme` attribute (set pre-paint by the
// no-flash script) is the source of truth, so we read it via
// useSyncExternalStore rather than syncing state inside an effect.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Theme {
  return (
    (document.documentElement.getAttribute("data-theme") as Theme) || "light"
  );
}

function getServerSnapshot(): Theme {
  return "light";
}

/** Kept for API stability / future provider-level concerns. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l());
  }, []);

  const toggle = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, toggle, setTheme };
}
