## Context

The `characters` table has no `level` column. Level is the most frequently changing value on an active character — players level up every few sessions. Burying it in the edit form would create unnecessary friction; it belongs as a first-class inline control on the detail page.

## Goals / Non-Goals

**Goals:**
- `level` column on `characters`, integer, NOT NULL, DEFAULT 1
- Level displayed on the character detail page for all authorized viewers
- Owner-only inline − / + control to change level without navigating away
- Server-side clamp: level must be 1–20

**Non-Goals:**
- Level field on the character edit form
- Level on the character list page
- XP tracking or automatic level-up logic

## Decisions

### 1. Dedicated `updateCharacterLevelAction` rather than reusing the edit action

The edit action handles name/race/class/theme and requires all fields. Level updates are single-field increments/decrements that should not touch the other fields. A dedicated action keeps the interaction minimal and avoids re-submitting the full edit form state.

### 2. Client component for the inline control

The − / + buttons need immediate optimistic feedback and can't be a plain server form without a page reload. A small `"use client"` component calls the server action and reflects the result. No external state library needed — local `useState` for the displayed value is sufficient.

### 3. Clamp enforced in the server action, not the DB

A DB check constraint (`level >= 1 AND level <= 20`) is an option but makes migration and future-proofing harder. The server action validates and clamps before writing, which is sufficient given this is not a multi-writer system.

### 4. Optimistic UI: update local state immediately, revert on error

The control increments/decrements the displayed level immediately on click, then calls the server action. On error it reverts to the prior value and shows an inline error. This keeps the interaction feeling instant without a full page reload.

## Risks / Trade-offs

- [Concurrent level edits from two sessions] → Last write wins; acceptable for a single-player character sheet
- [Existing characters get level = 1] → Correct default — all existing characters start at level 1 until manually updated

## Migration Plan

1. Generate and apply migration: `ALTER TABLE characters ADD COLUMN level integer NOT NULL DEFAULT 1`
2. Deploy — existing characters silently get level 1, new characters default to 1
3. No rollback complexity — column has a safe default; dropping it is non-destructive
