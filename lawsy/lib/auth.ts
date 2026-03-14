import type { AuthError as SupabaseAuthError } from '@supabase/supabase-js';

import type { AuthError, SignInInput, SignUpInput } from '../types/auth';
import { supabase } from './supabase';

function mapSupabaseAuthError(error: SupabaseAuthError | null): AuthError | null {
  if (!error) {
    return null;
  }

  const message = error.message.toLowerCase();

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid credentials')
  ) {
    return { code: 'invalid_credentials', message: 'Invalid email or password.' };
  }

  if (message.includes('user already registered') || message.includes('already been registered')) {
    return { code: 'email_in_use', message: 'An account with this email already exists.' };
  }

  if (message.includes('email not confirmed')) {
    return {
      code: 'email_not_confirmed',
      message: 'Please confirm your email before signing in.',
    };
  }

  if (message.includes('password') && (message.includes('weak') || message.includes('short'))) {
    return {
      code: 'weak_password',
      message: 'Use a stronger password with at least 8 characters.',
    };
  }

  if (message.includes('network') || message.includes('fetch')) {
    return {
      code: 'network',
      message: 'Network error. Please check your internet connection.',
    };
  }

  return {
    code: 'unknown',
    message: error.message || 'Authentication failed. Please try again.',
  };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  return {
    session: data.session,
    error: mapSupabaseAuthError(error),
  };
}

export async function signInWithPassword({ email, password }: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  return {
    session: data.session,
    user: data.user,
    error: mapSupabaseAuthError(error),
  };
}

export async function signUpWithPassword({ email, password }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  return {
    session: data.session,
    user: data.user,
    error: mapSupabaseAuthError(error),
  };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();

  return {
    error: mapSupabaseAuthError(error),
  };
}

export function onAuthStateChange(
  callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]
) {
  return supabase.auth.onAuthStateChange(callback);
}
