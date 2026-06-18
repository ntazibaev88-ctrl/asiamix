"use client";

import {
  Layers,
  LayoutDashboard,
  Package,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const nav: NavItem[] = [
  { href: "/courier", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/courier/pool", labelKey: "nav.pool", icon: Layers },
  { href: "/courier/orders", labelKey: "nav.orders", icon: Package },
  { href: "/courier/earnings", labelKey: "nav.earnings", icon: TrendingUp },
  { href: "/courier/balance", labelKey: "nav.balance", icon: Wallet },
];

export default function CourierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell portalKey="role.courier" accent="#3a7afe" nav={nav}>
      {children}
    </DashboardShell>
  );
}
