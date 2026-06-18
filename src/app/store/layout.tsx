"use client";

import {
  BarChart3,
  LayoutDashboard,
  Megaphone,
  Package,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const nav: NavItem[] = [
  { href: "/store", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/store/orders", labelKey: "nav.orders", icon: Package },
  { href: "/store/products", labelKey: "nav.products", icon: UtensilsCrossed },
  { href: "/store/promos", labelKey: "nav.promos", icon: Megaphone },
  { href: "/store/finance", labelKey: "nav.finance", icon: Wallet },
  { href: "/store/analytics", labelKey: "nav.analytics", icon: BarChart3 },
];

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell portalKey="role.store" accent="#18a957" nav={nav}>
      {children}
    </DashboardShell>
  );
}
