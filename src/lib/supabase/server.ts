import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";


function cleanUrl(url) {
  if (!url) return "";
  let cleaned = url.trim();
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  if (cleaned.endsWith('/rest/v1')) cleaned = cleaned.replace('/rest/v1', '');
  if (cleaned && !cleaned.startsWith('http')) cleaned = 'https://' + cleaned;
  return cleaned;
}
const SUPABASE_URL = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co");
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored in Server Components
        }
      },
    },
  });
}

// Admin client — service role key (server-side only!)
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient<any>(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
