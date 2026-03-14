import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';

import { Colors } from '../constants/colors';
import { useAuthStore } from '../stores/auth-store';
import { useOnboardingStore } from '../stores/onboarding-store';

export default function IndexScreen() {
  const initAuth = useAuthStore((state) => state.init);
  const user = useAuthStore((state) => state.user);
  const hasCompletedOnboarding = useOnboardingStore((state) => state.hasCompletedOnboarding);
  const postOnboardingRoute = useOnboardingStore((state) => state.postOnboardingRoute);

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isOnboardingHydrated, setIsOnboardingHydrated] = useState(
    useOnboardingStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (!isOnboardingHydrated) {
      void useOnboardingStore.persist.rehydrate();
    }

    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      setIsOnboardingHydrated(true);
    });

    return () => {
      unsubscribe();
    };
  }, [isOnboardingHydrated]);

  useEffect(() => {
    let mounted = true;

    void initAuth().finally(() => {
      if (mounted) {
        setIsAuthReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [initAuth]);

  if (!isAuthReady || !isOnboardingHydrated) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  if (hasCompletedOnboarding) {
    if (postOnboardingRoute === 'tabs') {
      return <Redirect href="/(tabs)" />;
    }

    // Never drop unauthenticated users straight into signup.
    // Keep the value-first onboarding entry and let signup happen from paywall intent.
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}

const styles = StyleSheet.create({
  loaderWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  root: {
    backgroundColor: Colors.background,
    flex: 1,
  },
});
