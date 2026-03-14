-- Onboarding funnel completion by variant.
with started as (
  select distinct funnel_session_id, coalesce(variant_id, 'onboarding_v1') as variant_id
  from public.onboarding_events
  where event_name = 'onboarding_started'
),
completed as (
  select distinct funnel_session_id
  from public.onboarding_events
  where event_name = 'onboarding_completed'
)
select
  s.variant_id,
  count(*) as started_sessions,
  count(c.funnel_session_id) as completed_sessions,
  round(100.0 * count(c.funnel_session_id) / nullif(count(*), 0), 2) as completion_rate_pct
from started s
left join completed c using (funnel_session_id)
group by s.variant_id
order by started_sessions desc;

-- Step drop-off by first view per step.
with first_step_views as (
  select
    funnel_session_id,
    step_index,
    min(created_at) as first_seen_at
  from public.onboarding_events
  where event_name = 'onboarding_step_viewed'
  group by funnel_session_id, step_index
),
sessions_started as (
  select count(distinct funnel_session_id) as total_started
  from public.onboarding_events
  where event_name = 'onboarding_started'
)
select
  fv.step_index,
  count(distinct fv.funnel_session_id) as reached_sessions,
  round(
    100.0 * count(distinct fv.funnel_session_id) /
    nullif((select total_started from sessions_started), 0),
    2
  ) as reach_rate_pct
from first_step_views fv
group by fv.step_index
order by fv.step_index asc;

-- Trial start rate and result breakdown by plan and variant.
with paywall_views as (
  select distinct
    funnel_session_id,
    coalesce(plan_selected, 'unknown') as plan_selected,
    coalesce(variant_id, 'onboarding_v1') as variant_id
  from public.onboarding_events
  where event_name = 'paywall_viewed'
),
trial_tapped as (
  select distinct funnel_session_id
  from public.onboarding_events
  where event_name = 'paywall_trial_tapped'
),
trial_results as (
  select
    funnel_session_id,
    coalesce(props ->> 'trial_result_status', 'unknown') as trial_result_status
  from public.onboarding_events
  where event_name = 'paywall_trial_result'
)
select
  p.variant_id,
  p.plan_selected,
  count(distinct p.funnel_session_id) as paywall_sessions,
  count(distinct t.funnel_session_id) as trial_tapped_sessions,
  round(
    100.0 * count(distinct t.funnel_session_id) /
    nullif(count(distinct p.funnel_session_id), 0),
    2
  ) as trial_start_rate_pct,
  count(*) filter (where r.trial_result_status = 'success') as trial_success_events,
  count(*) filter (where r.trial_result_status = 'cancelled') as trial_cancelled_events,
  count(*) filter (where r.trial_result_status = 'error') as trial_error_events,
  count(*) filter (where r.trial_result_status in ('not_configured', 'no_offering')) as trial_setup_events
from paywall_views p
left join trial_tapped t using (funnel_session_id)
left join trial_results r using (funnel_session_id)
group by p.variant_id, p.plan_selected
order by paywall_sessions desc;
