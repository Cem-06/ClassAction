export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      onboarding_events: {
        Row: {
          id: string;
          created_at: string;
          event_name: string;
          funnel_session_id: string;
          user_id: string | null;
          step_key: string | null;
          step_index: number | null;
          plan_selected: string | null;
          variant_id: string | null;
          props: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          event_name: string;
          funnel_session_id: string;
          user_id?: string | null;
          step_key?: string | null;
          step_index?: number | null;
          plan_selected?: string | null;
          variant_id?: string | null;
          props?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          event_name?: string;
          funnel_session_id?: string;
          user_id?: string | null;
          step_key?: string | null;
          step_index?: number | null;
          plan_selected?: string | null;
          variant_id?: string | null;
          props?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type OnboardingEventInsert = Database['public']['Tables']['onboarding_events']['Insert'];
