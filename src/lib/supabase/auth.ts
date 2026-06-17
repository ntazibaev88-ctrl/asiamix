import { createClient } from "./server";
import type { Profile, Role } from "@/lib/types";

/**
 * Server-side helpers for reading the authenticated user and their profile.
 * These are the real building blocks the demo cookie flow will be replaced
 * with. Safe to call from server components and route handlers.
 */

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, avatar_url, city_id, is_banned")
    .eq("id", user.id)
    .single();

  if (!data) return null;
  return {
    id: data.id,
    role: data.role as Role,
    fullName: data.full_name,
    phone: data.phone,
    avatarUrl: data.avatar_url ?? undefined,
    cityId: data.city_id ?? undefined,
    isBanned: data.is_banned ?? false,
  };
}
