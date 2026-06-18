"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBasket,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useCart, cartCount } from "@/lib/cart";
import { cn } from "@/lib/cn";

const tabs: { href: string; labelKey: string; icon: LucideIcon }[] = [
  { href: "/", labelKey: "shop.tab.home", icon: Home },
  { href: "/stores", labelKey: "shop.tab.stores", icon: Store },
  { href: "/cart", labelKey: "shop.tab.cart", icon: ShoppingBasket },
  { href: "/profile", labelKey: "shop.tab.profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const count = cartCount(useCart());

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-2xl items-stretch justify-between px-1">
        {tabs.map(({ href, labelKey, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition-colors",
                active ? "text-brand" : "text-faint hover:text-muted",
              )}
            >
              <span className="relative">
                <Icon size={22} fill={active && labelKey === "shop.tab.favorites" ? "currentColor" : "none"} />
                {labelKey === "shop.tab.cart" && count > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-bold text-brand-fg">
                    {count}
                  </span>
                )}
              </span>
              {t(labelKey)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
