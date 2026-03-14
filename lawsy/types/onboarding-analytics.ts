export type OnboardingStepKey =
  | 'hook'
  | 'big_numbers'
  | 'social_proof'
  | 'personalization'
  | 'eligibility_scan'
  | 'potential_results'
  | 'prepaywall'
  | 'paywall';

export type OnboardingEventName =
  | 'onboarding_started'
  | 'onboarding_step_viewed'
  | 'onboarding_cta_tapped'
  | 'personalization_updated'
  | 'scan_completed'
  | 'results_viewed'
  | 'prepaywall_viewed'
  | 'paywall_viewed'
  | 'paywall_plan_selected'
  | 'paywall_trial_tapped'
  | 'paywall_trial_result'
  | 'paywall_limited_access_tapped'
  | 'onboarding_completed';

export type OnboardingEventPayload = {
  funnel_session_id: string;
  user_id?: string | null;
  step_key?: OnboardingStepKey;
  step_index?: number;
  plan_selected?: 'annual' | 'monthly' | null;
  variant_id?: string;
  selected_companies_count?: number;
  estimated_min?: number;
  estimated_max?: number;
  trial_result_status?: 'success' | 'cancelled' | 'not_configured' | 'no_offering' | 'error';
  entry_source?: string;
  cta_label?: string;
  completion_path?: 'trial' | 'limited_access';
};
