import type { Session, User } from '@supabase/supabase-js';

export type AuthSession = Session | null;
export type AuthUser = User | null;

export type AuthErrorCode =
  | 'invalid_credentials'
  | 'email_in_use'
  | 'email_not_confirmed'
  | 'weak_password'
  | 'network'
  | 'unknown';

export type AuthError = {
  code: AuthErrorCode;
  message: string;
};

export type AuthState = {
  session: AuthSession;
  user: AuthUser;
  isLoading: boolean;
  isHydrating: boolean;
  error: AuthError | null;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  email: string;
  password: string;
};
