import bcrypt from "bcryptjs";
import type { Role } from "@/lib/types";

// Pre-seeded staff accounts. Passwords are stored only as bcrypt hashes.
// Admin is never open to registration — only this pre-created account exists.
// Stores additionally use TOTP-based 2FA. In production these live in the DB.

export interface StaffUser {
  id: string;
  username: string;
  role: Role;
  storeSlug?: string;
  name: string;
  passwordHash: string;
  totpSecret?: string;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// Override in production via ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH).
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "nomi-admin-2026";
const DEMO_STORE_PASSWORD = process.env.STORE_PASSWORD || "store-1234";

// Demo TOTP secret (base32). Add to Google Authenticator to get live codes.
const DEMO_TOTP = "JBSWY3DPEHPK3PXP";

export const users: StaffUser[] = [
  {
    id: "u-admin",
    username: ADMIN_USERNAME,
    role: "super_admin",
    name: "Супер админ",
    passwordHash:
      process.env.ADMIN_PASSWORD_HASH || bcrypt.hashSync(ADMIN_PASSWORD, 10),
  },
  {
    id: "u-altyn-orda",
    username: "altynorda",
    role: "store_admin",
    storeSlug: "altyn-orda",
    name: "Алтын Орда",
    passwordHash: bcrypt.hashSync(DEMO_STORE_PASSWORD, 10),
    totpSecret: DEMO_TOTP,
  },
  {
    id: "u-capital",
    username: "capital",
    role: "store_admin",
    storeSlug: "capital",
    name: "Capital",
    passwordHash: bcrypt.hashSync(DEMO_STORE_PASSWORD, 10),
    totpSecret: DEMO_TOTP,
  },
];

export function findByUsername(username: string): StaffUser | undefined {
  const u = username.trim().toLowerCase();
  return users.find((x) => x.username.toLowerCase() === u);
}

export async function verifyPassword(
  user: StaffUser,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
