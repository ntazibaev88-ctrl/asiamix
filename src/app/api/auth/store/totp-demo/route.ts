import { NextResponse, type NextRequest } from "next/server";
import { findByUsername } from "@/lib/auth/users";
import { currentTotp } from "@/lib/auth/totp";

// Demo helper: returns the current valid 2FA code for a store account so the
// demo is usable without an authenticator app. DISABLED in production.
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.NOMI_DEMO !== "1")
    return NextResponse.json({ error: "disabled" }, { status: 404 });

  const username = req.nextUrl.searchParams.get("username") || "";
  const user = findByUsername(username);
  if (!user?.totpSecret)
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  return NextResponse.json({ code: currentTotp(user.totpSecret) });
}
