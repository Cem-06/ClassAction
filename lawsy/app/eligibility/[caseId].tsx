import { useMemo, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Screen } from '../../components/ui/Screen';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../constants/colors';
import { getCaseById } from '../../lib/cases';
import { useCasesStore, type EligibilityStatus } from '../../stores/cases-store';

type Answer = 'yes' | 'no' | 'unknown';

function getResultStatus(answers: Answer[]): { status: EligibilityStatus; label: string; color: string } {
  const yesCount = answers.filter((item) => item === 'yes').length;
  const noCount = answers.filter((item) => item === 'no').length;

  if (yesCount === answers.length) {
    return { status: 'likely_eligible', label: 'Likely Eligible', color: Colors.success };
  }

  if (noCount >= 2) {
    return { status: 'not_eligible', label: 'Likely Not Eligible', color: '#B91C1C' };
  }

  return { status: 'needs_review', label: 'Needs Manual Review', color: Colors.warning };
}

export default function EligibilityScreen() {
  const { caseId } = useLocalSearchParams<{ caseId: string }>();
  const record = getCaseById(caseId);
  const { setEligibilityStatus, eligibilityByCaseId } = useCasesStore();
  const [answers, setAnswers] = useState<Answer[]>(() =>
    record?.qualifyRules.map(() => 'unknown') ?? []
  );
  const [submitted, setSubmitted] = useState(false);

  if (!record) {
    return (
      <Screen>
        <Text variant="title">Case not found</Text>
        <Text color={Colors.textSecondary}>Could not load eligibility rules for this case.</Text>
        <Link href="/(tabs)" asChild>
          <Button label="Back to Home" />
        </Link>
      </Screen>
    );
  }

  const result = useMemo(() => getResultStatus(answers), [answers]);
  const previousStatus = eligibilityByCaseId[record.id];

  const onSubmit = () => {
    setEligibilityStatus(record.id, result.status);
    setSubmitted(true);
  };

  return (
    <Screen>
      <Text variant="title">Eligibility Check</Text>
      <Text color={Colors.textSecondary}>{record.title}</Text>
      {previousStatus ? (
        <Text variant="caption" color={Colors.textSecondary}>
          Last saved result: {previousStatus.replace('_', ' ')}
        </Text>
      ) : null}

      {record.qualifyRules.map((rule, index) => (
        <Card key={rule}>
          <Text variant="label">{rule}</Text>
          <View style={styles.answerRow}>
            {(['yes', 'no', 'unknown'] as const).map((option) => {
              const selected = answers[index] === option;
              return (
                <Pressable
                  key={option}
                  onPress={() =>
                    setAnswers((prev) => prev.map((item, i) => (i === index ? option : item)))
                  }
                  style={[
                    styles.optionPill,
                    selected ? styles.optionPillSelected : styles.optionPillDefault,
                  ]}
                >
                  <Text
                    variant="caption"
                    color={selected ? Colors.white : Colors.textSecondary}
                    style={styles.optionText}
                  >
                    {option === 'yes' ? 'Yes' : option === 'no' ? 'No' : 'Not sure'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Card>
      ))}

      <Card>
        <Text variant="sectionTitle">Current Result</Text>
        <Text variant="title" color={result.color}>
          {result.label}
        </Text>
        <Button label="Save Result" onPress={onSubmit} />
        {submitted ? (
          <Text variant="caption" color={Colors.textSecondary}>
            Result saved in Tracker.
          </Text>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  answerRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionPill: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionPillDefault: {
    backgroundColor: Colors.border,
  },
  optionPillSelected: {
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontWeight: '600',
  },
});
