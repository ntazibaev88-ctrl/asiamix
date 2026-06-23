import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile-form";
import { redirect } from "next/navigation";
import type { UserProfile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      plan: "free",
      role: "user",
    });
    const res = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = res.data;
  }

  return <ProfileForm profile={profile as UserProfile} email={user.email || ""} />;
}
