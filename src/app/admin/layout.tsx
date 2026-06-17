"use client";

import {
  Bike,
  LayoutDashboard,
  Package,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const nav: NavItem[] = [
  { href: "/admin", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", labelKey: "nav.orders", icon: Package },
  { href: "/admin/users", labelKey: "nav.users", icon: Users },
  { href: "/admin/couriers", labelKey: "nav.couriers", icon: Bike },
  { href: "/admin/stores", labelKey: "nav.stores", icon: Store },
  { href: "/admin/finance", labelKey: "nav.finance", icon: Wallet },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell portalKey="role.admin" accent="#ff4d2e" nav={nav}>
      {children}
    </DashboardShell>
  );
}
