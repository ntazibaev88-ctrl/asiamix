import Link from 'next/link'
import { Footprints } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-amber-50/30 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 flex flex-col">
      <div className="p-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
            <Footprints className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">Qadam</span>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
