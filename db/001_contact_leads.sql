create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'archived')),
  source text not null default 'contact_form'
);

alter table public.contact_leads enable row level security;

revoke all on table public.contact_leads from anon, authenticated;
