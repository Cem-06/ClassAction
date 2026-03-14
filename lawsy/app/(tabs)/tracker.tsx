import { Link } from 'expo-router';

import { Card } from '../../components/ui/Card';
import { TabSwipeContainer } from '../../components/navigation/TabSwipeContainer';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { caseRecords } from '../../lib/cases';
import { useCasesStore } from '../../stores/cases-store';

function getStatusLabel(status?: string) {
  if (status === 'likely_eligible') {
    return { color: Colors.success, label: 'Likely Eligible' };
  }

  if (status === 'not_eligible') {
    return { color: '#B91C1C', label: 'Not Eligible' };
  }

  if (status === 'needs_review') {
    return { color: Colors.warning, label: 'Needs Review' };
  }

  return { color: Colors.textMuted, label: 'Not Checked' };
}

export default function TrackerScreen() {
  const { savedCaseIds, eligibilityByCaseId } = useCasesStore();
  const trackedCases = caseRecords
    .filter((item) => savedCaseIds.includes(item.id))
    .sort((a, b) => a.deadlineIso.localeCompare(b.deadlineIso));

  return (
    <TabSwipeContainer>
      <Screen>
        <Text variant="title">Tracker</Text>

        {!trackedCases.length ? (
          <Card>
            <Text variant="sectionTitle">No tracked cases yet</Text>
            <Text color={Colors.textSecondary}>
              Save a case first, then run eligibility checks to track progress here.
            </Text>
          </Card>
        ) : null}

        {trackedCases.map((item) => {
          const status = getStatusLabel(eligibilityByCaseId[item.id]);

          return (
            <Card key={item.id}>
              <Text variant="sectionTitle">{item.title}</Text>
              <Text color={Colors.textSecondary}>Deadline: {item.deadlineLabel}</Text>
              <Text variant="label" color={status.color}>
                Eligibility: {status.label}
              </Text>
              <Link href={`/eligibility/${item.id}`}>
                <Text variant="label" color={Colors.primary}>
                  Update Eligibility
                </Text>
              </Link>
            </Card>
          );
        })}
      </Screen>
    </TabSwipeContainer>
  );
}
