create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  author text not null,
  content text not null,
  image_url text not null,
  image_type text not null check (image_type in ('upload', 'drawing'))
);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  guestbook_id bigint not null references public.guestbook(id) on delete cascade,
  author text not null,
  content text not null
);

alter publication supabase_realtime add table public.guestbook;
alter publication supabase_realtime add table public.comments;

insert into storage.buckets (id, name, public)
values ('guestbook-images', 'guestbook-images', true)
on conflict (id) do nothing;

create policy "Public read guestbook images"
on storage.objects for select
using (bucket_id = 'guestbook-images');

create policy "Public upload guestbook images"
on storage.objects for insert
with check (bucket_id = 'guestbook-images');
