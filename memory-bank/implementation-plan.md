# Implementation Plan

## Goal

Turn the current realtime guestbook prototype into a more reliable, polished, and maintainable application.

## Phase 1: Stabilize Existing Behavior

- Fix Korean text encoding issues in README and UI source files.
- Confirm `.env.example` matches the required Supabase variables.
- Verify `supabase/schema.sql` can be run repeatedly without avoidable failures.
- Add empty, loading, and error states for the board.
- Improve form validation messages and disabled button states.
- Prevent duplicate submissions while upload/insert is in progress.
- Revoke object URLs created for upload previews when they are no longer needed.

## Phase 2: Improve Data Safety

- Review Supabase row-level security strategy.
- Decide whether anonymous posting is allowed.
- If anonymous posting remains allowed, add basic abuse controls:
  - File size limit
  - Accepted MIME type checks
  - Message length limits
  - Optional rate limiting at an edge/API layer
- Tighten storage policies where possible.
- Consider storing the storage object path in addition to public URL for future cleanup.

## Phase 3: Improve User Experience

- Polish the form layout and board design.
- Add clear upload/drawing mode controls.
- Add canvas clear control without clearing all text fields unless explicitly requested.
- Add touch drawing coordinate scaling that accounts for responsive canvas size.
- Add board search or simple filtering if entries grow.
- Add modal close button and keyboard escape behavior.
- Add readable timestamps.

## Phase 4: Add Tests And Quality Gates

- Add lint and type-check verification to the normal workflow.
- Add component-level tests for form validation where practical.
- Add integration tests or Playwright checks for:
  - Entry form rendering
  - Upload/drawing mode switching
  - Board rendering
  - Modal open/close
- Document manual Supabase verification steps.

## Phase 5: Deployment Readiness

- Choose hosting target.
- Configure production environment variables.
- Confirm Supabase project settings:
  - Realtime publication includes `guestbook` and `comments`
  - `guestbook-images` bucket exists and is public if public URLs are used
  - Storage policies match the desired access model
- Run production build before deployment.
- Update README with setup, deployment, and troubleshooting instructions.

## Recommended Next Step

Fix the Korean text encoding issue first. It affects the README, user-facing UI labels, placeholders, and runtime error messages, so it should be corrected before deeper UI polish or testing.
