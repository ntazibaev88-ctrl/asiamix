import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { findByUsername, verifyPassword } from "@/lib/auth/users";
import { verifyTotp } from "@/lib/auth/totp";
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
  totp: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    audit(req, "csrf_block", { route: "store/login" });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rateLimit(`storelogin:${clientIp(req)}`, 10, 60_000)) {
    audit(req, "rate_limited", { route: "store/login" });
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const user = findByUsername(parsed.data.username);
  const ok =
    user && user.role === "store_admin"
      ? await verifyPassword(user, parsed.data.password)
      : false;
  if (!user || !ok) {
    audit(req, "login_fail", { username: parsed.data.username, role: "store_admin" });
    return NextResponse.json({ error: "bad_credentials" }, { status: 401 });
  }

  // 2FA
  if (user.totpSecret) {
    if (!parsed.data.totp) {
      audit(req, "twofa_required", { username: user.username });
      return NextResponse.json({ require2fa: true });
    }
    if (!verifyTotp(parsed.data.totp, user.totpSecret)) {
      audit(req, "twofa_fail", { username: user.username });
      return NextResponse.json({ error: "bad_2fa" }, { status: 401 });
    }
  }

  const payload = {
    sub: user.id,
    role: user.role,
    storeSlug: user.storeSlug,
    name: user.name,
  };
  const res = NextResponse.json({
    ok: true,
    role: user.role,
    storeSlug: user.storeSlug,
    redirect: "/store",
  });
  setSessionCookies(res, await signAccess(payload), await signRefresh(payload));
  audit(req, "login_success", { username: user.username, role: user.role });
  return res;
}
