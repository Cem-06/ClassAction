create table if not exists public.onboarding_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
  funnel_session_id uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  step_key text,
  step_index integer,
  plan_selected text,
  variant_id text,
  props jsonb not null default '{}'::jsonb
);

create index if not exists onboarding_events_created_at_idx
on public.onboarding_events (created_at);

create index if not exists onboarding_events_event_name_created_at_idx
on public.onboarding_events (event_name, created_at);

create index if not exists onboarding_events_funnel_session_id_idx
on public.onboarding_events (funnel_session_id);

create index if not exists onboarding_events_user_id_created_at_idx
on public.onboarding_events (user_id, created_at);

alter table public.onboarding_events enable row level security;

drop policy if exists "onboarding events insert anon and auth" on public.onboarding_events;
create policy "onboarding events insert anon and auth"
on public.onboarding_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "onboarding events read service role only" on public.onboarding_events;
create policy "onboarding events read service role only"
on public.onboarding_events
for select
to service_role
using (true);
