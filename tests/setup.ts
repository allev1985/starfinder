import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/config", () => ({
  config: {
    databaseUrl: "postgresql://test:test@localhost:5432/test",
    supabaseUrl: "https://test.supabase.co",
    supabaseAnonKey: "test-anon-key",
  },
}));

const chainable: Record<string, unknown> = {};
const methods = ["select", "insert", "update", "delete", "transaction", "from", "where", "innerJoin", "leftJoin", "as", "limit", "returning", "set", "values", "orderBy"];
for (const m of methods) {
  chainable[m] = vi.fn(() => chainable);
}

vi.mock("@/db", () => ({ db: chainable }));
