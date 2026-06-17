import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { findByUsername, verifyPassword } from "@/lib/auth/users";
import { signAccess, signRefresh } from "@/lib/auth/tokens";
import {
  setSessionCookies,
  sameOrigin,
  rateLimit,
  clientIp,
} from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";

const schema = z.object({
  username: z.string().min(1).max(64),
  password: z.string().min(1).max(128),
});

// Admin panel is closed to registration — only the pre-created super_admin can
// authenticate here.
export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    audit(req, "csrf_block", { route: "admin/login" });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rateLimit(`adminlogin:${clientIp(req)}`, 6, 60_000)) {
    audit(req, "rate_limited", { route: "admin/login" });
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const user = findByUsername(parsed.data.username);
  const ok =
    user && user.role === "super_admin"
      ? await verifyPassword(user, parsed.data.password)
      : false;
  if (!user || !ok) {
    audit(req, "login_fail", { username: parsed.data.username, role: "super_admin" });
    return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
  }

  const payload = { sub: user.id, role: user.role, name: user.name };
  const res = NextResponse.json({ ok: true, role: user.role, redirect: "/admin" });
  setSessionCookies(res, await signAccess(payload), await signRefresh(payload));
  audit(req, "login_success", { username: user.username, role: user.role });
  return res;
}
