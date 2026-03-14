import { supabase } from './supabase';
import type { OnboardingEventInsert } from '../types/database';
import type { OnboardingEventName, OnboardingEventPayload } from '../types/onboarding-analytics';

const DEFAULT_VARIANT_ID = 'onboarding_v1';
const DEFAULT_ENTRY_SOURCE = 'welcome_onboarding';

export function createFunnelSessionId() {
  // RFC4122-ish v4 UUID for client-side event stitching.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const randomNibble = Math.floor(Math.random() * 16);
    const value = char === 'x' ? randomNibble : (randomNibble & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function trackOnboardingEvent(
  eventName: OnboardingEventName,
  payload: OnboardingEventPayload
): Promise<void> {
  const record: OnboardingEventInsert = {
    event_name: eventName,
    funnel_session_id: payload.funnel_session_id,
    user_id: payload.user_id ?? null,
    step_key: payload.step_key ?? null,
    step_index: payload.step_index ?? null,
    plan_selected: payload.plan_selected ?? null,
    variant_id: payload.variant_id ?? DEFAULT_VARIANT_ID,
    props: {
      selected_companies_count: payload.selected_companies_count ?? null,
      estimated_min: payload.estimated_min ?? null,
      estimated_max: payload.estimated_max ?? null,
      trial_result_status: payload.trial_result_status ?? null,
      entry_source: payload.entry_source ?? DEFAULT_ENTRY_SOURCE,
      cta_label: payload.cta_label ?? null,
      completion_path: payload.completion_path ?? null,
    },
  };

  const { error } = await supabase.from('onboarding_events').insert(record);

  if (error) {
    console.warn('[analytics] onboarding event failed', error.message);
  }
}
