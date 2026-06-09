import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Placeholder values for local dev without Supabase configured yet
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export function createClient() {
  return createBrowserClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Singleton for client components
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}

// Helper: check if Supabase is actually configured
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder") &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id")
  );
}
