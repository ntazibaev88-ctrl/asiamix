"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted transition-colors hover:text-fg hover:bg-surface-2 cursor-pointer"
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
