import type { NextRequest } from "next/server";

// Audit log for authentication events. Emitted as structured JSON to stdout,
// which hosting platforms (Vercel) collect as a tamper-evident log stream. In
// production this can also be persisted to an `audit_log` table.

export type AuthEvent =
  | "otp_request"
  | "otp_verify_success"
  | "otp_verify_fail"
  | "login_success"
  | "login_fail"
  | "twofa_required"
  | "twofa_fail"
  | "logout"
  | "refresh"
  | "csrf_block"
  | "rate_limited";

export function audit(
  req: NextRequest,
  event: AuthEvent,
  detail: Record<string, unknown> = {},
) {
  const entry = {
    t: new Date().toISOString(),
    event,
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown",
    ua: req.headers.get("user-agent") || "unknown",
    ...detail,
  };
  console.log(`[AUDIT] ${JSON.stringify(entry)}`);
}
