## Context

The repo recently had two coexisting lockfiles (`package-lock.json` and `pnpm-lock.yaml`); pnpm has now been established as the sole package manager and `node_modules` installed from `pnpm-lock.yaml`. `npm outdated` shows every direct dependency has a newer version available, ranging from patch bumps to multi-minor jumps (`@base-ui/react` 1.5.0→1.9.0, `@supabase/ssr` 0.10.3→0.12.7, `lucide-react` 1.17.0→1.57.0). No CI workflow exists yet, so verification is manual: `npm run lint`, `npx tsc --noEmit`, `npm test`, plus hands-on checks in the browser (per CLAUDE.md's UI-change rule).

Changelog investigation (done during exploration, not re-derived here) found:
- `@base-ui/react`: the only breaking change between 1.5.0 and 1.9.0 is an OTP Field preview-API rename; this repo has no OTP Field usage, only common primitives (`select`, `dialog`, `popover`, `dropdown-menu`, `tabs`, `switch`, `checkbox`, `badge`, `button`, `alert-dialog`, `input`) in `src/components/ui/`.
- `@supabase/ssr`: changes in the 0.11–0.12 range are internal cookie-handling/dedup fixes and an opt-in `auth.storage` warning; `src/lib/supabase/server.ts` and `src/proxy.ts` both use the plain `getAll`/`setAll` pattern with no `auth.storage` override, so the warning path isn't triggered.
- `zod`: no confirmed breaking change found in the 4.4.3→4.6.7 range; risk is residual because `src/config.ts` is the sole env-validation boundary (per CLAUDE.md's "no `process.env` outside config.ts" rule) and a silent schema/behavior change there would fail at boot in a way that's easy to miss.

## Goals / Non-Goals

**Goals:**
- Bring all `package.json` dependencies to latest, with `pnpm-lock.yaml` as the single lockfile.
- Catch any regression from the version bumps before merging, via typecheck/lint/tests plus a short targeted manual pass.
- Keep the change reviewable: group bumps by risk tier rather than one undifferentiated diff.

**Non-Goals:**
- No application code refactors, API changes, or new features — if a bump requires non-trivial code changes to keep behavior equivalent, that's flagged as an open question, not silently absorbed into this change.
- No CI pipeline setup (out of scope; noted as a gap, not fixed here).
- No change to which package manager is used elsewhere in the org — pnpm is already the established choice for this repo as of this change.

## Decisions

- **Tiered bump order over one big bump**: Tier 1 (mechanical: icons, CLI tools, types, lint/build tooling) → Tier 2 (framework: next/react/react-dom, which move in lockstep) → Tier 3 (previously-flagged packages: `@base-ui/react`, `@supabase/ssr`, `zod`). Rationale: isolates the packages that actually warranted a changelog read from the ones that are pure maintenance, so if something breaks, the tier that broke it is already narrowed down.
- **Single `pnpm update` pass per tier, not per-package**: since no breaking changes were confirmed within any tier, bumping each tier's packages together and verifying once is cheaper than isolating every package, while still keeping the three tiers separable if something does regress.
- **Manual verification targets chosen from actual usage, not full regression testing**: a shadcn/base-ui component page (covers `@base-ui/react`), the email OTP login flow via `src/proxy.ts` (covers `@supabase/ssr`'s cookie refresh), and app boot (covers `zod`'s `src/config.ts` parsing). This follows CLAUDE.md's instruction to verify UI changes in-browser rather than relying solely on typecheck/lint.

## Risks / Trade-offs

- [No CI safety net] → Mitigation: run `npm run lint`, `npx tsc --noEmit`, and `npm test` locally after each tier, plus the manual checks above, before moving to the next tier.
- [Zod behavior change in `src/config.ts` could fail silently at boot] → Mitigation: explicitly start the dev server after the Tier 3 bump and confirm no "Missing or invalid environment variables" error, not just that the build compiles.
- [`@supabase/ssr` cookie-handling internals changed across 0.11–0.12] → Mitigation: manually exercise the OTP login flow end-to-end (sign in, confirm redirect to `/dashboard`, confirm session persists across a reload) rather than trusting the changelog summary alone.
- [pnpm skipped postinstall build scripts for `esbuild`, `msw`, `sharp`, `unrs-resolver` on initial install] → Mitigation: if `npm test` (vitest/esbuild) or any image-processing path misbehaves, run `pnpm approve-builds` and re-test before assuming a real regression.

## Open Questions

- Should a CI workflow be added as a follow-up so future dependency bumps aren't purely manually verified? (Out of scope here, but worth flagging to the user separately.)
