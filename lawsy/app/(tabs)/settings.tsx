import { Link } from 'expo-router';
import { Alert, Switch, View, StyleSheet } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { TabSwipeContainer } from '../../components/navigation/TabSwipeContainer';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { useCasesStore } from '../../stores/cases-store';
import { useOnboardingStore } from '../../stores/onboarding-store';

export default function SettingsScreen() {
  const { clearAllLocalData } = useCasesStore();
  const { resetOnboarding } = useOnboardingStore();

  const onClearData = () => {
    Alert.alert(
      'Reset local data?',
      'This will clear saved cases, eligibility statuses, and onboarding progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            clearAllLocalData();
            resetOnboarding();
          },
        },
      ]
    );
  };

  return (
    <TabSwipeContainer>
      <Screen>
        <Text variant="title">Settings</Text>

        <Card>
          <Text variant="sectionTitle">Preferences</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text variant="label">Deadline reminders</Text>
              <Text variant="caption" color={Colors.textSecondary}>
                UI placeholder for upcoming notification settings.
              </Text>
            </View>
            <Switch value />
          </View>
        </Card>

        <Card>
          <Text variant="sectionTitle">Legal</Text>
          <Link href="/legal/disclaimer">
            <Text variant="label" color={Colors.primary}>
              Disclaimer
            </Text>
          </Link>
          <Link href="/legal/privacy">
            <Text variant="label" color={Colors.primary}>
              Privacy
            </Text>
          </Link>
        </Card>

        <Card>
          <Text variant="sectionTitle">Data</Text>
          <Text color={Colors.textSecondary}>This clears local app state and onboarding progress only.</Text>
          <Button label="Reset Local Data" onPress={onClearData} variant="secondary" />
        </Card>
      </Screen>
    </TabSwipeContainer>
  );
}

const styles = StyleSheet.create({
  settingCopy: {
    flex: 1,
    gap: 2,
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
});
