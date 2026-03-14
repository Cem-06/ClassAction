import { Link, useRouter } from 'expo-router';
import { Lock, Mail, Shield } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Features } from '../../constants/features';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { useAuth } from '../../hooks/useAuth';
import { Colors } from '../../constants/colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { isLoading, signUp, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const onSubmit = async () => {
    clearError();
    setValidationError(null);

    if (!email.trim().includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setValidationError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    const result = await signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (!result.error) {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="titleXl">Create account</Text>
        <Text color={Colors.textSecondary}>Set up your profile to track settlement opportunities.</Text>
      </View>

      <Card>
        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <Mail color={Colors.textMuted} size={14} />
            <Text variant="caption" color={Colors.textSecondary}>
              Email
            </Text>
          </View>
          <Input
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="you@example.com"
            value={email}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <Lock color={Colors.textMuted} size={14} />
            <Text variant="caption" color={Colors.textSecondary}>
              Password
            </Text>
          </View>
          <Input
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={setPassword}
            placeholder="Minimum 8 characters"
            secureTextEntry
            value={password}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputLabelRow}>
            <Shield color={Colors.textMuted} size={14} />
            <Text variant="caption" color={Colors.textSecondary}>
              Confirm password
            </Text>
          </View>
          <Input
            autoCapitalize="none"
            autoComplete="new-password"
            onChangeText={setConfirmPassword}
            placeholder="Repeat password"
            secureTextEntry
            value={confirmPassword}
          />
        </View>

        {validationError ? <Text color="#B91C1C">{validationError}</Text> : null}
        {error ? <Text color="#B91C1C">{error.message}</Text> : null}

        <Button
          disabled={isLoading}
          label={isLoading ? 'Creating account...' : 'Create account'}
          onPress={onSubmit}
        />
      </Card>

      <Card>
        <Text variant="sectionTitle">Continue with</Text>
        <Button
          disabled={!Features.enableGoogleAuth}
          label={Features.enableGoogleAuth ? 'Google' : 'Google (coming soon)'}
          variant="secondary"
        />
        <Button
          disabled={!Features.enableAppleAuth}
          label={Features.enableAppleAuth ? 'Apple' : 'Apple (coming soon)'}
          variant="secondary"
        />
      </Card>

      <View style={styles.footer}>
        <Text color={Colors.textSecondary}>Already have an account?</Text>
        <Link href="/(auth)/login">
          <Text variant="label" color={Colors.primary}>
            Login
          </Text>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  header: {
    gap: 8,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
});
