import { NextResponse, type NextRequest } from "next/server";
import { clearSessionCookies } from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  clearSessionCookies(res);
  audit(req, "logout");
  return res;
}
