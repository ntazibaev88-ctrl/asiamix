import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { redirect } from "next/navigation";
import type { UserProfile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // Profile missing — try upsert (trigger may have failed)
    const { error: upsertError } = await supabase.from("profiles").upsert(
      { id: user.id, email: user.email || "", plan: "free", role: "user" },
      { onConflict: "id", ignoreDuplicates: true }
    );
    const res = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (!res.data) {
      return (
        <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
          <p className="text-lg font-medium">Профиль жасалмады</p>
          <p className="text-xs text-red-400 font-mono break-all px-4">
            SELECT: {selectError?.message || "no error"} | UPSERT: {upsertError?.message || "no error"} | SELECT2: {res.error?.message || "no error"}
          </p>
          <p className="text-sm text-[var(--muted-foreground)]">Шығып, қайта кіріңіз.</p>
          <a href="/signout" className="inline-block px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-medium">Шығу</a>
        </div>
      );
    }
    return <ProfileForm profile={res.data as UserProfile} email={user.email || ""} />;
  }

  return <ProfileForm profile={profile as UserProfile} email={user.email || ""} />;
}

