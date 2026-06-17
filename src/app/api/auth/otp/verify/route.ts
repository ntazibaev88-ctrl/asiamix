import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { hashCode, safeEqual } from "@/lib/auth/crypto";
import {
  COOKIE,
  signAccess,
  signRefresh,
  verifyOtpToken,
} from "@/lib/auth/tokens";
import {
  setSessionCookies,
  clearOtpCookie,
  sameOrigin,
  rateLimit,
  clientIp,
} from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";

const schema = z.object({ code: z.string().regex(/^\d{6}$/) });

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    audit(req, "csrf_block", { route: "otp/verify" });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rateLimit(`otpver:${clientIp(req)}`, 8, 60_000)) {
    audit(req, "rate_limited", { route: "otp/verify" });
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const cookie = req.cookies.get(COOKIE.otp)?.value;
  const data = cookie ? await verifyOtpToken(cookie) : null;
  if (!data) {
    audit(req, "otp_verify_fail", { reason: "expired" });
    return NextResponse.json({ error: "otp_expired" }, { status: 401 });
  }

  if (!safeEqual(hashCode(parsed.data.code), data.codeHash)) {
    audit(req, "otp_verify_fail", { identifier: data.identifier });
    return NextResponse.json({ error: "wrong_code" }, { status: 401 });
  }

  const role = data.channel === "courier" ? "courier" : "customer";
  const payload = { sub: data.identifier, role, name: data.identifier } as const;
  const res = NextResponse.json({
    ok: true,
    role,
    redirect: role === "courier" ? "/courier" : "/",
  });
  setSessionCookies(res, await signAccess(payload), await signRefresh(payload));
  clearOtpCookie(res);
  audit(req, "otp_verify_success", { identifier: data.identifier, role });
  return res;
}
