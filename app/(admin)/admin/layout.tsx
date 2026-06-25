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

  if (user.email !== "ntazibaev88@gmail.com") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AdminSidebar profileName={profile?.full_name || profile?.email || ""} />
      <div className="lg:pl-64">
        <main className="pt-14 lg:pt-0 p-4 sm:p-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
