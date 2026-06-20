import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-secondary)]">
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[7px] bg-[var(--accent)] flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
          <span className="font-semibold text-[var(--text)]">Jinaq</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="py-4 text-center text-xs text-[var(--text-tertiary)]">
        © {new Date().getFullYear()} Jinaq. Все права защищены.
      </footer>
    </div>
  )
}
