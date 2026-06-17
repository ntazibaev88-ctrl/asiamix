import { generateSync, verifySync } from "otplib";

// TOTP 2FA for store accounts (compatible with Google Authenticator / Authy).
export function verifyTotp(token: string, secret: string): boolean {
  try {
    return verifySync({ token: token.replace(/\s/g, ""), secret }).valid;
  } catch {
    return false;
  }
}

/** Current valid code — used only by the non-production demo helper. */
export function currentTotp(secret: string): string {
  return generateSync({ secret });
}

export function otpauthUrl(label: string, secret: string): string {
  return `otpauth://totp/NOMI:${encodeURIComponent(label)}?secret=${secret}&issuer=NOMI`;
}
