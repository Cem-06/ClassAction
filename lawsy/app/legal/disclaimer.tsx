import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';

export default function DisclaimerScreen() {
  return (
    <Screen>
      <Text variant="title">Legal Disclaimer</Text>
      <Text variant="body">
        Lawsy is an information and discovery tool only. It does not provide legal advice.
      </Text>
    </Screen>
  );
}
