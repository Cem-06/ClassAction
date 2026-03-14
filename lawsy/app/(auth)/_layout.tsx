import { Stack } from 'expo-router';

import { Colors } from '../../constants/colors';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="welcome"
        options={{
          contentStyle: { backgroundColor: '#ECFDF5' },
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </Stack>
  );
}
