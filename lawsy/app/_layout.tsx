import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="case/[slug]" options={{ title: 'Case Details' }} />
        <Stack.Screen name="eligibility/[caseId]" options={{ title: 'Eligibility Check' }} />
        <Stack.Screen name="legal/disclaimer" options={{ title: 'Disclaimer' }} />
        <Stack.Screen name="legal/privacy" options={{ title: 'Privacy' }} />
      </Stack>
    </>
  );
}
