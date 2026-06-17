import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { generateOtp, hashCode, normalizePhone } from "@/lib/auth/crypto";
import { signOtp } from "@/lib/auth/tokens";
import {
  setOtpCookie,
  sameOrigin,
  rateLimit,
  clientIp,
} from "@/lib/auth/security";
import { sendSms } from "@/lib/auth/sms";
import { audit } from "@/lib/auth/audit";

const schema = z.object({
  phone: z.string().min(5).max(20),
  channel: z.enum(["client", "courier"]),
});

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) {
    audit(req, "csrf_block", { route: "otp/request" });
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  if (!rateLimit(`otpreq:${clientIp(req)}`, 5, 60_000)) {
    audit(req, "rate_limited", { route: "otp/request" });
    return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const phone = normalizePhone(parsed.data.phone);
  if (!phone)
    return NextResponse.json({ error: "bad_phone" }, { status: 400 });

  const code = generateOtp();
  const token = await signOtp({
    channel: parsed.data.channel,
    identifier: phone,
    codeHash: hashCode(code),
  });
  const sms = await sendSms(phone, code);
  audit(req, "otp_request", {
    phone,
    channel: parsed.data.channel,
    delivered: sms.delivered,
  });

  const res = NextResponse.json({ ok: true, demoCode: sms.demoCode });
  setOtpCookie(res, token);
  return res;
}
