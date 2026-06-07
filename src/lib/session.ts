import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
}

export function isAdmin(user: User | null): boolean {
  return user?.app_metadata?.role === "admin";
}
