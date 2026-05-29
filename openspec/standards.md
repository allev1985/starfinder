# Code Standards

These standards apply to all implementation work. Follow them when writing specs, tasks, and code.

## 1. Centralised Environment Config

All `process.env` access is forbidden outside of `src/config.ts`. No other file may read `process.env` directly.

`src/config.ts` uses Zod to validate all environment variables at startup and exports typed constants. If a required variable is missing, the app fails immediately with a clear error.

Two config files exist to handle the server/client boundary:

- **`src/config.ts`** — `server-only`, validates all env vars including `DATABASE_URL`. Import this in Server Components, Route Handlers, and server utilities.
- **`src/config.public.ts`** — no `server-only`, validates `NEXT_PUBLIC_*` vars only. Import this in `"use client"` modules and middleware.

```ts
// src/config.ts — server-side (import in server modules)
import "server-only";
import { z } from "zod";
const parsed = z.object({ DATABASE_URL: z.string().min(1), ... }).safeParse(process.env);
if (!parsed.success) throw new Error(`Missing env vars: ...`);
export const config = { databaseUrl: parsed.data.DATABASE_URL, ... };

// src/config.public.ts — client-safe (import in "use client" or middleware)
import { z } from "zod";
const parsed = z.object({ NEXT_PUBLIC_SUPABASE_URL: z.string().url(), ... }).safeParse(process.env);
export const publicConfig = { supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL, ... };
```

## 2. No Excessive Comments

Write no comments by default. Only add a comment when the **why** is non-obvious — a hidden constraint, a subtle invariant, a workaround for a specific bug. If removing the comment wouldn't confuse a future reader, don't write it. Never write comments that describe what the code does; well-named identifiers do that.

## 3. shadcn/ui Components

All UI components must use shadcn/ui. Install components via the shadcn CLI:

```bash
npx shadcn@latest add <component>
```

**Direct edits to `src/components/ui/` are forbidden.** These are managed by shadcn and will be overwritten on reinstall. Compose or wrap them in your own components under `src/components/` — never modify the source files in `src/components/ui/`.

shadcn must be initialised before any UI component work begins.

## 4. Lint and Tests After Every Change

Run the following after completing any change:

```bash
npm run lint        # always
npx tsc --noEmit    # always
```

Once a test runner is configured, also run:

```bash
npm test            # when available
```

Tasks lists must include a verification group at the end that runs these checks.
