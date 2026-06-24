import { NextResponse, type NextRequest } from "next/server";

const VALID_LANGS = ["kk", "ru", "en"] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || "kk";
  const redirect = searchParams.get("redirect") || "/dashboard";

  const safeLang = VALID_LANGS.includes(lang as "kk" | "ru" | "en") ? lang : "kk";

  const response = NextResponse.redirect(new URL(redirect, request.url));
  response.cookies.set("lang", safeLang, {
    path: "/",
    maxAge: 31_536_000, // 1 year
    sameSite: "lax",
  });
  return response;
}
