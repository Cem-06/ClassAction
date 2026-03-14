import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingStore = {
  hasCompletedOnboarding: boolean;
  postOnboardingRoute: 'register' | 'tabs';
  completeOnboarding: (route?: 'register' | 'tabs') => void;
  resetOnboarding: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      postOnboardingRoute: 'register',
      completeOnboarding: (route = 'register') =>
        set({ hasCompletedOnboarding: true, postOnboardingRoute: route }),
      resetOnboarding: () =>
        set({
          hasCompletedOnboarding: false,
          postOnboardingRoute: 'register',
        }),
    }),
    {
      name: 'lawsy-onboarding-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
