import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types";

// Next.js 16 renamed Middleware to "Proxy" (same functionality). This runs an
// optimistic role check before protected portals render. It is intentionally
// lightweight — full authorization must also be enforced server-side (RLS in
// Supabase + checks in route handlers / server components).

const AREA_ROLES: { prefix: string; allow: Role[] }[] = [
  { prefix: "/courier", allow: ["courier", "super_admin"] },
  { prefix: "/store", allow: ["store_admin", "super_admin"] },
  { prefix: "/admin", allow: ["super_admin"] },
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const area = AREA_ROLES.find((a) => pathname.startsWith(a.prefix));
  if (!area) return NextResponse.next();

  // Demo session cookie set by the login page. Swap for the Supabase auth
  // session + a role lookup once real auth is connected.
  const role = request.cookies.get("nomi_role")?.value as Role | undefined;

  if (!role || !area.allow.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/courier/:path*", "/store/:path*", "/admin/:path*"],
};
