"use client";

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL environment variable is not set");
}
if (!supabaseAnonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set"
  );
}

export function createClient() {
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
