import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { useAuthStore } from '../stores/auth-store';

type RequireAuthOptions = {
  reason?: string;
  onAuthenticated?: () => void;
};

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const requireAuth = useCallback(
    (options?: RequireAuthOptions) => {
      if (store.user) {
        options?.onAuthenticated?.();
        return true;
      }

      Alert.alert(
        'Login required',
        options?.reason ?? 'Please sign in to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Login',
            onPress: () => {
              router.push('/(auth)/login');
            },
          },
        ]
      );

      return false;
    },
    [router, store.user]
  );

  return {
    ...store,
    isAuthenticated: Boolean(store.user),
    requireAuth,
  };
}
