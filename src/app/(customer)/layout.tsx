import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header role="customer" />
      <main className="pb-20 md:pb-0 min-h-[calc(100vh-4rem)]">
        {children}
      </main>
      <BottomNav />
    </>
  )
}
