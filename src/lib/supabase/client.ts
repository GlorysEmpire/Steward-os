import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

// Use this in Client Components ("use client" files) only.
// For Server Components / route handlers, use lib/supabase/server.ts instead.
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
