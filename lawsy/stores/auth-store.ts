import { create } from 'zustand';

import {
  getSession,
  onAuthStateChange,
  signInWithPassword,
  signOutUser,
  signUpWithPassword,
} from '../lib/auth';
import { clearPaywallUser, syncPaywallUser } from '../lib/paywall';
import type { AuthError, AuthState, AuthUser, SignInInput, SignUpInput } from '../types/auth';

type AuthStore = AuthState & {
  init: () => Promise<void>;
  restoreSession: () => Promise<void>;
  signIn: (input: SignInInput) => Promise<{ error: AuthError | null }>;
  signUp: (input: SignUpInput) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  clearError: () => void;
};

let hasInitialized = false;

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  user: null,
  isLoading: false,
  isHydrating: false,
  error: null,

  async init() {
    if (hasInitialized) {
      return;
    }

    hasInitialized = true;

    await get().restoreSession();

    onAuthStateChange(async (_event, session) => {
      const user: AuthUser = session?.user ?? null;
      set({ session, user });
    });
  },

  async restoreSession() {
    set({ isHydrating: true, error: null });

    const { session, error } = await getSession();

    set({
      session,
      user: session?.user ?? null,
      isHydrating: false,
      error,
    });

    if (session?.user?.id) {
      void syncPaywallUser(session.user.id);
    }
  },

  async signIn(input) {
    set({ isLoading: true, error: null });

    const { session, user, error } = await signInWithPassword(input);

    set({
      session: session ?? null,
      user: user ?? null,
      isLoading: false,
      error,
    });

    if (user?.id) {
      void syncPaywallUser(user.id);
    }

    return { error };
  },

  async signUp(input) {
    set({ isLoading: true, error: null });

    const { session, user, error } = await signUpWithPassword(input);

    set({
      session: session ?? null,
      user: user ?? null,
      isLoading: false,
      error,
    });

    if (user?.id) {
      void syncPaywallUser(user.id);
    }

    return { error };
  },

  async signOut() {
    set({ isLoading: true, error: null });

    const { error } = await signOutUser();

    if (error) {
      set({
        isLoading: false,
        error,
      });
      return { error };
    }

    set({
      session: null,
      user: null,
      isLoading: false,
      error: null,
    });

    void clearPaywallUser();

    return { error };
  },

  clearError() {
    set({ error: null });
  },
}));
