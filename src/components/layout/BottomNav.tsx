'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Store, ShoppingCart, ClipboardList, User } from 'lucide-react'
import { clsx } from 'clsx'
import { useLanguage } from '@/contexts/LanguageContext'
import { useCart } from '@/contexts/CartContext'

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { itemCount } = useCart()

  const links = [
    { href: '/', icon: Home, label: t.nav.home },
    { href: '/stores', icon: Store, label: t.nav.stores },
    { href: '/cart', icon: ShoppingCart, label: t.nav.cart, badge: itemCount },
    { href: '/orders', icon: ClipboardList, label: t.nav.orders },
    { href: '/profile', icon: User, label: t.nav.profile },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--color-surface)]/95 backdrop-blur-lg border-t border-[var(--color-border)] safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all',
                isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {badge != null && badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </div>
              <span className={clsx('text-[10px] font-medium', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
