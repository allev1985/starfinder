import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { config } from "@/config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
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
          // Called from a Server Component — cookie mutation is a no-op.
          // Middleware handles the refresh instead.
        }
      },
    },
  });
}
