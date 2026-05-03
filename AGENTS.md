# AGENTS.md

## Project Memory Rule

Agents working in this repository must always read and update the documents in `memory-bank/` when making project changes.

Before starting work:
- Read `memory-bank/architecture.md`
- Read `memory-bank/progress.md`
- Read `memory-bank/implementation-plan.md`

After making meaningful changes:
- Update `memory-bank/architecture.md` if structure, data flow, dependencies, routes, or integrations changed.
- Update `memory-bank/progress.md` with completed work, current state, and known issues.
- Update `memory-bank/implementation-plan.md` if priorities, next steps, or planned phases changed.

These files are the persistent project context and should be treated as part of the source of truth for future agents.

## Current Project Summary

This is a realtime guestbook application built with Next.js, React, TypeScript, and Supabase.

Core areas:
- `/`: guestbook entry creation with image upload or canvas drawing
- `/board`: realtime sticky-note style board with detail modal and comments
- `supabase/schema.sql`: database tables, realtime publication setup, storage bucket, and storage policies
- `lib/supabase.ts`: typed Supabase client
- `lib/types.ts`: shared database types

## Working Guidelines

- Prefer existing project patterns before introducing new abstractions.
- Keep changes scoped to the requested behavior.
- Do not commit secrets or `.env.local`.
- Run relevant verification commands after changes when feasible.
- Preserve user changes in the working tree.
