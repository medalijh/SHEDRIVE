import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

function cleanUrl(url: string | undefined | null): string {
  if (!url) return "";
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  if (cleaned.endsWith('/rest/v1')) cleaned = cleaned.replace('/rest/v1', '');
  if (cleaned && !cleaned.startsWith('http')) cleaned = 'https://' + cleaned;
  return cleaned;
}

export async function updateSession(request: NextRequest) {
  // Guard: if Supabase env vars not configured, allow all requests through
  // This allows the app to work in local dev without Supabase configured yet
  const supabaseUrl  = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id") || supabaseUrl.includes("placeholder")) {
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
  const isAuthPage           = pathname === "/auth/login" || pathname.startsWith("/auth/register") || pathname === "/auth/callback";

  // Allow unauthenticated users to browse dashboard pages (static demo mode)
  // Real data protection is handled by Supabase RLS on actual queries
  if ((isProtectedPassenger || isProtectedDriver || isProtectedAdmin) && !user) {
    // Let them through — pages will show empty/demo data gracefully
    return supabaseResponse;
  }

  // Role-based route protection
  if (user && (isProtectedPassenger || isProtectedDriver || isProtectedAdmin)) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile) {
        // Admin can access everything
        if (profile.role === "admin") {
          // Allow access to all routes
        } else if (isProtectedAdmin) {
          // Non-admin trying to access admin routes
          return NextResponse.redirect(new URL(`/${profile.role}/dashboard`, request.url));
        } else if (isProtectedDriver && profile.role !== "driver") {
          // Non-driver trying to access driver routes
          return NextResponse.redirect(new URL(`/${profile.role === "admin" ? "admin" : "passenger/dashboard"}`, request.url));
        } else if (isProtectedPassenger && profile.role === "driver") {
          // Driver trying to access passenger routes
          return NextResponse.redirect(new URL("/driver/dashboard", request.url));
        }
      }
    } catch {
      // If profile query fails, allow through (RLS will handle protection)
    }
  }

  // Redirect logged-in users away from auth pages
  if (isAuthPage && user) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const redirectTo = profile?.role === "driver" 
        ? "/driver/dashboard" 
        : profile?.role === "admin" 
        ? "/admin" 
        : "/passenger/dashboard";
      
      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch {
      return NextResponse.redirect(new URL("/passenger/dashboard", request.url));
    }
  }

  return supabaseResponse;
}
