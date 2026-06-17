import type { Role } from "./types";

// Demo staff accounts (login/password). Replace with Supabase auth + a roles
// table later. Each account maps to a role and, for store admins, a store.

export interface Account {
  username: string;
  password: string;
  role: Role;
  storeSlug?: string;
  label: string;
}

export const accounts: Account[] = [
  { username: "admin", password: "admin", role: "super_admin", label: "Супер админ" },
  { username: "altynorda", password: "1234", role: "store_admin", storeSlug: "altyn-orda", label: "Алтын Орда — админ" },
  { username: "capital", password: "1234", role: "store_admin", storeSlug: "capital", label: "Capital — админ" },
  { username: "courier", password: "1234", role: "courier", label: "Курьер" },
];

export function findAccount(username: string, password: string) {
  return accounts.find(
    (a) => a.username === username.trim() && a.password === password,
  );
}

export function homeForRole(role: Role): string {
  if (role === "super_admin") return "/admin";
  if (role === "store_admin") return "/store";
  if (role === "courier") return "/courier";
  return "/";
}
