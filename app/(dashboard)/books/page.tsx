import { createClient } from "@/lib/supabase/server";
import { BooksClient } from "@/components/books/books-client";
import type { Book } from "@/types";

export default async function BooksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: books }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user!.id).single(),
    supabase.from("books").select("*").order("created_at", { ascending: false }),
  ]);

  const isVip = profile?.plan === "vip";

  return <BooksClient books={(books || []) as Book[]} isVip={isVip} />;
}
