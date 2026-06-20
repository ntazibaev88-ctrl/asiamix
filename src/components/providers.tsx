'use client'
import { LanguageProvider } from '@/contexts/language'
import { ThemeProvider } from '@/contexts/theme'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className:
              'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-xl shadow-xl',
          }}
        />
      </LanguageProvider>
    </ThemeProvider>
  )
}
