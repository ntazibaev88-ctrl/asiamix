import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MoviesClient } from "@/components/movies/movies-client";
import type { Movie } from "@/types";

export default async function MoviesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: movies }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).single(),
    supabase.from("movies").select("*").order("created_at", { ascending: false }),
  ]);

  const isVip = profile?.plan === "vip";
  return <MoviesClient movies={(movies || []) as Movie[]} isVip={isVip} />;
}
