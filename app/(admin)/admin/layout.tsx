import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  const ADMIN_EMAILS = ["ntazibaev88@gmail.com"];
  const isAdmin = profile?.role === "admin" || ADMIN_EMAILS.includes(user.email || "");
  if (!isAdmin) redirect("/dashboard");

  const profileName = profile?.full_name || profile?.email || user.email || "";

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminSidebar profileName={profileName} />
      <div className="pt-14 lg:pt-0 lg:pl-64">
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
