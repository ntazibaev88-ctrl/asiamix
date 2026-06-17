import { NextResponse, type NextRequest } from "next/server";
import { COOKIE, signAccess, verifyToken } from "@/lib/auth/tokens";
import { setSessionCookies, sameOrigin } from "@/lib/auth/security";
import { audit } from "@/lib/auth/audit";

export async function POST(req: NextRequest) {
  if (!sameOrigin(req))
    return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const rt = req.cookies.get(COOKIE.refresh)?.value;
  if (!rt) return NextResponse.json({ error: "no_session" }, { status: 401 });
  const session = await verifyToken(rt);
  if (!session || session.typ !== "refresh") {
    return NextResponse.json({ error: "no_session" }, { status: 401 });
  }

  const payload = {
    sub: session.sub,
    role: session.role,
    storeSlug: session.storeSlug,
    name: session.name,
  };
  const res = NextResponse.json({ ok: true, role: session.role });
  setSessionCookies(res, await signAccess(payload), rt);
  audit(req, "refresh", { sub: session.sub, role: session.role });
  return res;
}
