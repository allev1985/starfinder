# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Starfinder Gaming Sheet — a Next.js application for managing Starfinder RPG character/game data.

## Code Standards

All implementation work must follow the standards defined in [`openspec/standards.md`](openspec/standards.md). Key rules:

- **No `process.env` outside `src/config.ts`** — use Zod-validated config exports everywhere else
- **No excessive comments** — only write a comment when the why is non-obvious
- **shadcn/ui for all UI components** — never directly edit files in `src/components/ui/`
- **Lint + typecheck after every change** — `npm run lint` and `npx tsc --noEmit` always; `npm test` once a runner is configured

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # run ESLint
npx tsc --noEmit # type-check without emitting
```

No test runner is configured yet.

## Architecture

- **Framework**: Next.js 16 with the App Router (`src/app/`)
- **Styling**: Tailwind CSS v4 (configured via `postcss.config.mjs`, no `tailwind.config.*` file)
- **Language**: TypeScript with strict mode; path alias `@/*` maps to `src/*`
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` in `src/app/layout.tsx`

### App Router conventions

Pages live at `src/app/<route>/page.tsx`. Shared UI wrapping all routes goes in `src/app/layout.tsx`. Route-specific layouts are added by placing a `layout.tsx` inside the route segment directory.

### Important: Next.js version note

This project uses Next.js 16, which may have breaking changes from earlier versions. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for current API conventions rather than relying on prior knowledge.
