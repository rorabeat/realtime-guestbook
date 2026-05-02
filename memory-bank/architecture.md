# Architecture

## Project Overview

This project is a realtime guestbook built with Next.js 14, React 18, TypeScript, and Supabase.

The application lets users create a guestbook entry with:
- Author name
- Message content
- Uploaded image or canvas drawing

Entries are shown on a realtime board. Each entry can be opened in a modal, where users can add realtime comments.

## Runtime Stack

- Framework: Next.js App Router
- UI: React client components
- Language: TypeScript
- Backend service: Supabase
- Database: Supabase Postgres
- Realtime: Supabase Realtime Postgres changes
- File storage: Supabase Storage public bucket

## Application Routes

### `/`

Entry creation page.

Implemented by:
- `app/page.tsx`
- `components/GuestbookForm.tsx`

Responsibilities:
- Collect author and message
- Accept image upload
- Provide canvas drawing mode
- Upload the selected/generated image to Supabase Storage
- Insert a new row into `public.guestbook`

### `/board`

Realtime board page.

Implemented by:
- `app/board/page.tsx`
- `components/Board.tsx`

Responsibilities:
- Load guestbook entries ordered by latest first
- Subscribe to realtime guestbook inserts
- Render entries as sticky-note style cards
- Open entry detail modal
- Load and subscribe to comments for the selected entry
- Insert new comments into `public.comments`

## Supabase Client

`lib/supabase.ts` creates a typed Supabase browser client using:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The app throws at startup if either required environment variable is missing.

## Data Model

Types are defined in `lib/types.ts`.

### `guestbook`

Columns:
- `id`: generated identity primary key
- `created_at`: timestamp with timezone, default `now()`
- `author`: text
- `content`: text
- `image_url`: text
- `image_type`: either `upload` or `drawing`

### `comments`

Columns:
- `id`: generated identity primary key
- `created_at`: timestamp with timezone, default `now()`
- `guestbook_id`: foreign key to `guestbook.id`, cascade delete
- `author`: text
- `content`: text

## Storage

Supabase Storage bucket:
- `guestbook-images`

The current schema creates the bucket as public and adds policies for public read and public upload.

Uploaded files are stored under:
- `uploads/{timestamp}-{randomUUID}.{extension}`

Canvas drawings are converted to PNG blobs before upload.

## Realtime Flow

### Guestbook entries

`components/Board.tsx`:
1. Loads existing rows from `guestbook`
2. Subscribes to `INSERT` events on `public.guestbook`
3. Prepends new entries if they are not already present

### Comments

`components/Board.tsx`:
1. Loads comments for the selected guestbook entry
2. Subscribes to `INSERT` events on `public.comments`
3. Filters realtime events by `guestbook_id`
4. Appends new comments if they are not already present

## Styling

Global styles are defined in `app/globals.css`.

Current styling is intentionally simple:
- Centered container
- Card-based form layout
- Responsive two-column form that collapses on smaller screens
- Sticky-note board cards
- Modal for entry detail and comments

## Current Risks And Notes

- Existing Korean UI text and README content appear to have mojibake encoding issues.
- No authentication is implemented.
- Public upload policy allows anonymous uploads to the storage bucket.
- No rate limiting, moderation, or spam protection exists.
- No automated tests are currently present.
- `next.config.mjs` allows remote images from any HTTPS hostname.
