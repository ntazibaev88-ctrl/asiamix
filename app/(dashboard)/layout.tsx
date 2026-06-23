import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AIChat } from "@/components/ai-chat";
import { LanguageProvider } from "@/contexts/language";
import type { UserProfile } from "@/types";
import type { Lang } from "@/lib/i18n";
import { DEFAULT_LANG, LANG_COOKIE } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read language cookie first before Supabase client creation
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANG_COOKIE)?.value;
  const lang: Lang = (["kk", "ru", "en"] as const).includes(langCookie as Lang)
    ? (langCookie as Lang)
    : DEFAULT_LANG;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <LanguageProvider initialLang={lang}>
      <div className="min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="lg:pl-64 transition-all duration-300">
          <DashboardHeader profile={profile as UserProfile} />
          <main className="p-4 sm:p-6 pb-24 lg:pb-8">{children}</main>
        </div>
        <MobileSidebar />
        <AIChat />
      </div>
    </LanguageProvider>
  );
}
