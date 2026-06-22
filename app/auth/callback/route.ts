import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qmwbofntuccgblfsdtcd.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtd2JvZm50dWNjZ2JsZnNkdGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMTY5MDgsImV4cCI6MjA5NzU5MjkwOH0.hVKsJdOzvFW21gS7iT4UD6VZ_TFQve2fiDtroGlh2io";

const ADMIN_EMAILS = ["tazhibaev_99@bk.ru"];

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    // Collect all cookies with their full options
    const collectedCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            // Merge: latest value wins
            const idx = collectedCookies.findIndex((c) => c.name === name);
            if (idx >= 0) collectedCookies[idx] = { name, value, options: options as Record<string, unknown> };
            else collectedCookies.push({ name, value, options: options as Record<string, unknown> });
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      // Email-based admin check — no DB required
      const isAdmin = user && ADMIN_EMAILS.includes(user.email || "");
      const dest = isAdmin ? "/admin" : "/dashboard";

      const response = NextResponse.redirect(`${origin}${dest}`);

      // Apply all session cookies with full options
      collectedCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2]);
      });

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
