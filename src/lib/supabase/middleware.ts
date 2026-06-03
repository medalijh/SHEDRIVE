import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  // Guard: if Supabase env vars not configured, allow all requests through
  // This allows the app to work in local dev without Supabase configured yet
  const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
    // No Supabase configured — allow all requests through (dev mode)
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session — IMPORTANT: Don't remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ── Route Protection ─────────────────────────────────────────
  const isProtectedPassenger = pathname.startsWith("/passenger");
  const isProtectedDriver    = pathname.startsWith("/driver");
  const isProtectedAdmin     = pathname.startsWith("/admin");
  const isAuthPage           = pathname === "/auth/login" || pathname === "/auth/register";

  if ((isProtectedPassenger || isProtectedDriver || isProtectedAdmin) && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin role check (simplified — use Supabase RLS for full protection)
  if (isProtectedAdmin && user) {
    // In production: query profiles table to verify role = 'admin'
    // For now: allow authenticated users into admin (protect with DB RLS)
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/passenger/dashboard", request.url));
  }

  return supabaseResponse;
}
