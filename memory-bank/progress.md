# Progress

## Completed

- Created a Next.js 14 project structure using the App Router.
- Added Supabase client setup in `lib/supabase.ts`.
- Added TypeScript database types in `lib/types.ts`.
- Added Supabase SQL schema in `supabase/schema.sql`.
- Implemented the guestbook creation page at `/`.
- Implemented image upload mode.
- Implemented canvas drawing mode.
- Implemented Supabase Storage upload to the `guestbook-images` bucket.
- Implemented guestbook row insertion into `public.guestbook`.
- Implemented realtime board page at `/board`.
- Implemented initial guestbook fetch ordered by latest first.
- Implemented realtime subscription for new guestbook entries.
- Implemented detail modal for a selected guestbook entry.
- Implemented comment fetch for a selected entry.
- Implemented realtime subscription for new comments on the selected entry.
- Added basic responsive global CSS.
- Added `.env.example` for required Supabase environment variables.
- Added `.gitignore` entries for local environment, build output, dependencies, and TypeScript build info.
- Added `package-lock.json` from dependency installation.

## Current Project State

The application has a working core flow:

1. User opens `/`.
2. User uploads an image or creates a drawing.
3. User enters author and message.
4. App uploads image data to Supabase Storage.
5. App inserts a guestbook record.
6. User opens `/board`.
7. Board displays entries and receives new entries through Supabase Realtime.
8. User opens an entry modal.
9. User adds comments.
10. Comments update through Supabase Realtime.

## Known Issues

- Korean display strings in current source files and README appear corrupted due to encoding problems.
- The UI is functional but visually minimal.
- Form validation is minimal.
- There is no loading or empty state on the board.
- There is no delete/edit behavior.
- There is no authentication or author ownership.
- Supabase policies are permissive for public guestbook image upload.
- No test suite exists yet.

## Useful Commands

```bash
npm install
npm run dev
npm run build
```

## Important Files

- `app/page.tsx`: root guestbook creation route
- `app/board/page.tsx`: board route
- `components/GuestbookForm.tsx`: entry creation, upload, drawing, submit flow
- `components/Board.tsx`: realtime board, modal, comments
- `lib/supabase.ts`: Supabase client
- `lib/types.ts`: database and row types
- `supabase/schema.sql`: database, realtime, storage bucket, and storage policies
- `app/globals.css`: global styling
