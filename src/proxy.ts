import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE, verifyToken } from "@/lib/auth/tokens";
import type { Role } from "@/lib/types";

// Next.js 16 Proxy (formerly Middleware). Verifies the signed JWT access token
// and enforces role-based access to each portal. Runs on every protected path.

const AREAS: { prefix: string; allow: Role[]; login: string }[] = [
  { prefix: "/courier", allow: ["courier", "super_admin"], login: "/login/courier" },
  { prefix: "/store", allow: ["store_admin", "super_admin"], login: "/login/store" },
  { prefix: "/admin", allow: ["super_admin"], login: "/login/admin" },
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const area = AREAS.find((a) => pathname.startsWith(a.prefix));
  if (!area) return NextResponse.next();

  const token = request.cookies.get(COOKIE.access)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session || session.typ !== "access" || !area.allow.includes(session.role)) {
    const url = request.nextUrl.clone();
    url.pathname = area.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courier/:path*", "/store/:path*", "/admin/:path*"],
};
