import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { Role } from "@/lib/types";

// JWT access/refresh tokens (HS256). Secret from env; a dev fallback keeps the
// build working locally. On the server set a strong AUTH_SECRET.
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ||
    "dev-insecure-secret-please-set-AUTH_SECRET-env-0123456789",
);

export interface Session extends JWTPayload {
  sub: string;
  role: Role;
  storeSlug?: string;
  name?: string;
  typ?: "access" | "refresh";
}

const ACCESS_TTL = "1d";
const REFRESH_TTL = "30d";

export async function signAccess(s: Omit<Session, "typ">): Promise<string> {
  return new SignJWT({ ...s, typ: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TTL)
    .sign(secret);
}

export async function signRefresh(s: Omit<Session, "typ">): Promise<string> {
  return new SignJWT({ ...s, typ: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TTL)
    .sign(secret);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as Session;
  } catch {
    return null;
  }
}

// Short-lived signed token that carries a hashed OTP between request & verify
// (stateless OTP — no DB needed). httpOnly cookie, 5 min.
export async function signOtp(data: {
  channel: "client" | "courier";
  identifier: string;
  codeHash: string;
}): Promise<string> {
  return new SignJWT(data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function verifyOtpToken(token: string): Promise<{
  channel: "client" | "courier";
  identifier: string;
  codeHash: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as {
      channel: "client" | "courier";
      identifier: string;
      codeHash: string;
    };
  } catch {
    return null;
  }
}

export const COOKIE = {
  access: "nomi_at",
  refresh: "nomi_rt",
  otp: "nomi_otp",
} as const;
