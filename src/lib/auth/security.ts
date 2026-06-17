import { NextResponse, type NextRequest } from "next/server";
import { COOKIE } from "./tokens";

// --- CSRF: verify the request originates from our own site -------------------
export function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const src = origin || referer;
  if (!src) return false; // state-changing requests must carry origin/referer
  try {
    return new URL(src).host === host;
  } catch {
    return false;
  }
}

// --- Basic in-memory rate limiting (per instance) ----------------------------
const hits = new Map<string, { n: number; reset: number }>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = hits.get(key);
  if (!cur || now > cur.reset) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  if (cur.n >= max) return false;
  cur.n += 1;
  return true;
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// --- Secure session cookies --------------------------------------------------
const secure = process.env.NODE_ENV === "production";
const DAY = 60 * 60 * 24;

export function setSessionCookies(
  res: NextResponse,
  access: string,
  refresh: string,
) {
  res.cookies.set(COOKIE.access, access, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: DAY,
  });
  res.cookies.set(COOKIE.refresh, refresh, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: DAY * 30,
  });
}

export function clearSessionCookies(res: NextResponse) {
  for (const name of [COOKIE.access, COOKIE.refresh]) {
    res.cookies.set(name, "", { httpOnly: true, secure, path: "/", maxAge: 0 });
  }
}

export function setOtpCookie(res: NextResponse, token: string) {
  res.cookies.set(COOKIE.otp, token, {
    httpOnly: true,
    secure,
    sameSite: "strict",
    path: "/",
    maxAge: 300,
  });
}

export function clearOtpCookie(res: NextResponse) {
  res.cookies.set(COOKIE.otp, "", { httpOnly: true, secure, path: "/", maxAge: 0 });
}
