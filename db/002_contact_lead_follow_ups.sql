create table if not exists public.contact_lead_follow_ups (
  id uuid primary key default gen_random_uuid(),
  contact_lead_id uuid not null
    references public.contact_leads(id)
    on delete cascade,
  created_at timestamptz not null default now(),
  to_email text not null,
  subject text not null,
  message text not null,
  resend_email_id text
);

create index if not exists contact_lead_follow_ups_lead_created_idx
  on public.contact_lead_follow_ups (contact_lead_id, created_at desc);

alter table public.contact_lead_follow_ups enable row level security;

revoke all on table public.contact_lead_follow_ups from anon, authenticated;
grant select, insert on table public.contact_lead_follow_ups to service_role;
