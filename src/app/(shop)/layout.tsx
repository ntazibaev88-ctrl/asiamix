import { ShopHeader } from "@/components/shop/ShopHeader";
import { BottomNav } from "@/components/shop/BottomNav";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <ShopHeader />
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
