import { usePathname, useRouter } from 'expo-router';
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, useWindowDimensions } from 'react-native';

const tabPaths = ['/(tabs)', '/(tabs)/saved', '/(tabs)/tracker', '/(tabs)/settings'] as const;

function normalizeTabPath(pathname: string): (typeof tabPaths)[number] {
  if (pathname.endsWith('/saved')) {
    return '/(tabs)/saved';
  }

  if (pathname.endsWith('/tracker')) {
    return '/(tabs)/tracker';
  }

  if (pathname.endsWith('/settings')) {
    return '/(tabs)/settings';
  }

  return '/(tabs)';
}

export function TabSwipeContainer({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioningRef = useRef(false);

  const normalizedPath = normalizeTabPath(pathname);
  const currentIndex = tabPaths.indexOf(normalizedPath);
  const swipeTravel = Math.max(width * 0.45, 180);
  const swipeThreshold = Math.max(64, width * 0.2);

  useEffect(() => {
    isTransitioningRef.current = false;
    translateX.stopAnimation();
    translateX.setValue(0);
  }, [normalizedPath, translateX]);

  const navigateTo = useCallback(
    (targetIndex: number, direction: 'forward' | 'back') => {
      if (isTransitioningRef.current) {
        return;
      }

      const targetPath = tabPaths[targetIndex];

      if (!targetPath) {
        return;
      }

      isTransitioningRef.current = true;
      const exitOffset = direction === 'forward' ? -swipeTravel : swipeTravel;

      Animated.spring(translateX, {
        damping: 21,
        mass: 0.85,
        stiffness: 220,
        toValue: exitOffset,
        useNativeDriver: true,
      }).start(() => {
        translateX.setValue(0);
        isTransitioningRef.current = false;
        router.replace(targetPath);
      });
    },
    [router, swipeTravel, translateX]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 14 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 1.2,
        onPanResponderMove: (_, gestureState) => {
          if (isTransitioningRef.current) {
            return;
          }

          let offset = gestureState.dx;

          if (offset > 0 && currentIndex === 0) {
            offset *= 0.25;
          }

          if (offset < 0 && currentIndex === tabPaths.length - 1) {
            offset *= 0.25;
          }

          const clamped = Math.max(-swipeTravel, Math.min(swipeTravel, offset));
          translateX.setValue(clamped);
        },
        onPanResponderRelease: (_, gestureState) => {
          if (isTransitioningRef.current) {
            return;
          }

          if (gestureState.dx < -swipeThreshold && currentIndex < tabPaths.length - 1) {
            navigateTo(currentIndex + 1, 'forward');
            return;
          }

          if (gestureState.dx > swipeThreshold && currentIndex > 0) {
            navigateTo(currentIndex - 1, 'back');
            return;
          }

          Animated.spring(translateX, {
            damping: 20,
            mass: 0.8,
            stiffness: 250,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          if (isTransitioningRef.current) {
            return;
          }

          Animated.spring(translateX, {
            damping: 20,
            mass: 0.8,
            stiffness: 250,
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [currentIndex, navigateTo, swipeThreshold, swipeTravel, translateX]
  );

  return (
    <Animated.View {...panResponder.panHandlers} style={[styles.root, { transform: [{ translateX }] }]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
