import type { NextRequest } from "next/server";
import { COOKIE, verifyToken, type Session } from "./tokens";

/** Reads & verifies the current session from the request's access cookie. */
export async function getSession(req: NextRequest): Promise<Session | null> {
  const token = req.cookies.get(COOKIE.access)?.value;
  if (!token) return null;
  const s = await verifyToken(token);
  if (!s || s.typ !== "access") return null;
  return s;
}

/** Returns the session only if it has one of the allowed roles. */
export async function requireRole(
  req: NextRequest,
  ...roles: Session["role"][]
): Promise<Session | null> {
  const s = await getSession(req);
  if (!s || !roles.includes(s.role)) return null;
  return s;
}
