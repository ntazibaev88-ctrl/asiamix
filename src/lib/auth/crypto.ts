import { createHmac, randomInt, timingSafeEqual } from "crypto";

const secret =
  process.env.AUTH_SECRET ||
  "dev-insecure-secret-please-set-AUTH_SECRET-env-0123456789";

/** 6-digit numeric OTP. */
export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/** HMAC-SHA256 of an OTP code, so the raw code never leaves the server. */
export function hashCode(code: string): string {
  return createHmac("sha256", secret).update(code).digest("hex");
}

/** Constant-time comparison to avoid timing attacks. */
export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Normalize a Kazakhstan phone number to +7XXXXXXXXXX. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && (digits[0] === "7" || digits[0] === "8"))
    return "+7" + digits.slice(1);
  if (digits.length === 10) return "+7" + digits;
  return null;
}
